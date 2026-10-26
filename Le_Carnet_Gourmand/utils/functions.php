<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");
require_once(ROOT . "/exceptions/BadRequestException.php");
require_once(ROOT . "/exceptions/NotFoundException.php");
require_once(ROOT . "/exceptions/MethodNotAllowedException.php");
require_once(ROOT . "/exceptions/UnsupportedMediaTypeException.php");
require_once(ROOT . "/controllers/IController.php");

// ---------------------------------------------------------------------------
// Amorçage : aucune erreur PHP n'est affichée dans la réponse (elle casserait le JSON).
// Les warnings/notices deviennent des exceptions, interceptées par api.php.
// ---------------------------------------------------------------------------
function serverBootstrap(): void
{
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    error_reporting(E_ALL);
    date_default_timezone_set('Europe/Paris');

    set_error_handler(function (int $severity, string $message, string $file = '', int $line = 0): bool {
        if (!(error_reporting() & $severity)) {
            return false; // erreur masquée par l'opérateur @
        }
        if ($severity === E_DEPRECATED || $severity === E_USER_DEPRECATED) {
            error_log("Deprecated : $message ($file:$line)");
            return true;
        }
        throw new ErrorException($message, 0, $severity, $file, $line);
    });

    // Erreur fatale non interceptable (mémoire, compilation...) : on renvoie quand même du JSON
    register_shutdown_function(function (): void {
        $error = error_get_last();
        $fatal = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR];
        if ($error !== null && in_array($error['type'], $fatal, true) && !headers_sent()) {
            sendJsonError(500, "Erreur interne du serveur.");
        }
    });
}

// ---------------------------------------------------------------------------
// Réponses JSON (format du contrat : voir API_CONTRACT.md)
// ---------------------------------------------------------------------------
function jsonEncode(mixed $data): string
{
    return json_encode(
        $data,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR
    );
}

function sendJson(int $status, string $json): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo $json;
}

// {"success": false, "error": "..."}
function sendJsonError(int $status, string $message): void
{
    sendJson($status, jsonEncode(["success" => false, "error" => $message]));
}

// Transforme une HttpStatusException en réponse d'erreur
function raiseHttpStatus(HttpStatusException $ex): void
{
    $status = $ex->getCode();
    if ($status < 400 || $status > 599) {
        error_log("Code HTTP invalide " . $status . " : " . $ex);
        $status = 500;
    }
    $message = $ex->getMessage();
    if ($status >= 500) {
        error_log((string)$ex); // erreur serveur : on garde la trace complète dans les logs
        if ($status !== 503) {
            $message = "Erreur interne du serveur."; // le détail (classe, fichier...) ne sort pas du serveur
        }
    }
    sendJsonError($status, $message);
}

// Erreurs SQL non anticipées par les services : le message SQL n'est jamais renvoyé au client
function raisePdoException(PDOException $ex): void
{
    error_log((string)$ex);
    switch ($ex->errorInfo[1] ?? null) {
        case 1062: // doublon sur une clé unique
            sendJsonError(409, "Cette ressource existe déjà.");
            break;
        case 1451: // ligne encore référencée par une clé étrangère
            sendJsonError(409, "Cette ressource est encore utilisée par d'autres données.");
            break;
        case 1452: // clé étrangère vers une ligne inexistante
            sendJsonError(400, "La requête fait référence à une ressource inexistante.");
            break;
        default:
            sendJsonError(500, "Erreur de base de données.");
    }
}

// ---------------------------------------------------------------------------
// Lecture de la requête
// ---------------------------------------------------------------------------

// Paramètres de la requête : query string, fusionnée avec le corps JSON pour POST / PUT / DELETE
function extractForm(): array
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    switch ($method) {
        case 'GET':
            return $_GET;
        case 'POST':
        case 'PUT':
            return array_merge($_GET, readJsonBody(false));
        case 'DELETE':
            // les paramètres d'un DELETE peuvent aussi passer dans l'URL : le corps est facultatif
            return array_merge($_GET, readJsonBody(true));
        default:
            throw new MethodNotAllowedException("Méthode HTTP non supportée : " . $method);
    }
}

// Corps de la requête, obligatoirement en application/json et sous forme d'objet
function readJsonBody(bool $optional): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        if ($optional) {
            return [];
        }
        throw new BadRequestException("Le corps de la requête (objet JSON) est obligatoire.");
    }

    $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
    if (!isJsonContentType($contentType)) {
        throw new UnsupportedMediaTypeException("Le Content-Type doit être application/json.");
    }

    try {
        $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        throw new BadRequestException("Le corps de la requête n'est pas un JSON valide.");
    }
    if (!is_array($data) || ($data !== [] && array_is_list($data))) {
        throw new BadRequestException("Le corps de la requête doit être un objet JSON.");
    }
    return $data;
}

function isJsonContentType(string $contentType): bool
{
    $mediaType = strtolower(trim(explode(';', $contentType)[0]));
    return $mediaType === 'application/json';
}

function extractRoute(array $form): string
{
    $route = $form['route'] ?? null;
    if (!is_string($route) || $route === '') {
        throw new BadRequestException("Paramètre 'route' manquant.");
    }
    // Une majuscule suivie de 1 à 63 lettres : le nom sert à charger un fichier, rien d'autre n'est accepté
    if (!preg_match("/^[A-Z][A-Za-z]{1,63}$/", $route)) {
        throw new BadRequestException("Syntaxe de route invalide.");
    }
    return $route;
}

// Instancie dynamiquement <Route><Methode>Controller (ex : RecettePostController)
function createController(array $form): IController
{
    $route = extractRoute($form);
    $method = ucfirst(strtolower($_SERVER['REQUEST_METHOD'] ?? 'GET'));
    $className = $route . $method . "Controller";
    $file = ROOT . "/controllers/" . $className . ".php";

    if (!is_file($file)) {
        foreach (['Get', 'Post', 'Put', 'Delete'] as $other) {
            if (is_file(ROOT . "/controllers/" . $route . $other . "Controller.php")) {
                throw new MethodNotAllowedException("La route " . $route . " n'accepte pas la méthode " . strtoupper($method) . ".");
            }
        }
        throw new NotFoundException("Route inconnue : " . $route);
    }

    require_once($file);
    if (!class_exists($className, false) || !is_subclass_of($className, 'IController')) {
        throw new HttpStatusException("Contrôleur invalide : " . $className, 500);
    }
    return new $className($form);
}

// ---------------------------------------------------------------------------
// Validation de format (utilisée par les contrôleurs dans checkCybersec)
// ---------------------------------------------------------------------------
function isEmail(string $mail): bool
{
    return mb_strlen($mail) <= 100 && filter_var($mail, FILTER_VALIDATE_EMAIL) !== false;
}

// Au moins 12 caractères, une majuscule, une minuscule et un caractère spécial.
// 72 octets maximum : au-delà, bcrypt ignore silencieusement la fin du mot de passe.
function isPassword(string $password): bool
{
    return strlen($password) <= 72
        && preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{12,}$/u', $password) === 1;
}

// 3 à 50 caractères : lettres (accents compris), chiffres, espace, point, tiret, tiret bas
function isPseudo(string $pseudo): bool
{
    return preg_match('/^[\p{L}\p{N} ._\-]{3,50}$/u', $pseudo) === 1;
}

function isHttpUrl(string $url): bool
{
    if (mb_strlen($url) > 255 || filter_var($url, FILTER_VALIDATE_URL) === false) {
        return false;
    }
    $scheme = strtolower((string)parse_url($url, PHP_URL_SCHEME));
    return $scheme === 'http' || $scheme === 'https';
}

// Image d'une recette : fichier du dossier public/image/ ou URL http(s)
function isImagePath(string $path): bool
{
    if (isHttpUrl($path)) {
        return true;
    }
    return mb_strlen($path) <= 255
        && preg_match('#^public/image/[^/\\\\"<>]+\.(webp|png|jpe?g|gif)$#iu', $path) === 1;
}

?>
