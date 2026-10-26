<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");
require_once(ROOT . "/exceptions/BadRequestException.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/utils/functions.php");

abstract class AbstractController implements IController
{
    protected array $form;
    protected mixed $response = null;
    protected int $statusCode = 200;

    public function __construct(array $form)
    {
        $this->form = $form;
    }

    public function execute(): string
    {
        $this->checkForm();       // les paramètres obligatoires existent ?
        $this->checkCybersec();   // ils sont conformes : int, string, longueur, format ?
        $this->checkRights();     // l'utilisateur est connecté / admin ?
        $this->processRequest();  // transmet au service
        return $this->processResponse(); // transforme en JSON
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    abstract protected function checkForm(): void;

    abstract protected function checkCybersec(): void;

    abstract protected function checkRights(): void;

    abstract protected function processRequest(): void;

    // Succès : {"success": true, "data": ...}
    protected function processResponse(): string
    {
        return jsonEncode(["success" => true, "data" => $this->response]);
    }

    // -----------------------------------------------------------------------
    // Outils de lecture des paramètres (le JSON peut contenir des int, des bool,
    // des tableaux... on ne fait donc jamais confiance au type reçu)
    // -----------------------------------------------------------------------

    // Le paramètre est présent et non vide
    protected function has(string $name): bool
    {
        return array_key_exists($name, $this->form) && $this->form[$name] !== null && $this->form[$name] !== '';
    }

    protected function requireParams(string ...$names): void
    {
        $missing = array_filter($names, fn(string $name) => !$this->has($name));
        if (!empty($missing)) {
            throw new BadRequestException("Paramètre(s) obligatoire(s) manquant(s) : " . implode(", ", $missing));
        }
    }

    // Exige au moins un des paramètres (mise à jour partielle)
    protected function requireOneOf(string ...$names): void
    {
        foreach ($names as $name) {
            if ($this->has($name)) {
                return;
            }
        }
        throw new BadRequestException("Au moins un de ces paramètres est attendu : " . implode(", ", $names));
    }

    // Accepte un ancien nom de paramètre (ex : "pk") pour le nom officiel (ex : "pk_recette")
    protected function alias(string $name, string ...$aliases): void
    {
        foreach ($aliases as $alias) {
            if (!$this->has($name) && $this->has($alias)) {
                $this->form[$name] = $this->form[$alias];
            }
        }
    }

    // Identifiant : entier strictement positif (accepte 12 ou "12")
    protected function getId(string $name): int
    {
        $id = self::toPositiveInt($this->form[$name] ?? null);
        if ($id === null) {
            throw new BadRequestException("Le paramètre '$name' doit être un entier positif.");
        }
        return $id;
    }

    // Liste d'identifiants : [1, 2], 3 ou "3" → [1, 2] / [3] (sans doublon)
    protected function getIdList(string $name): array
    {
        $values = $this->form[$name] ?? null;
        if (!is_array($values)) {
            $values = [$values];
        }
        $ids = [];
        foreach ($values as $value) {
            $id = self::toPositiveInt($value);
            if ($id === null) {
                throw new BadRequestException("Le paramètre '$name' doit contenir des entiers positifs.");
            }
            $ids[$id] = $id;
        }
        return array_values($ids);
    }

    // Chaîne nettoyée de ses espaces de début et de fin, avec contrôle de longueur
    protected function getString(string $name, int $min, int $max): string
    {
        $value = $this->form[$name] ?? null;
        if (!is_string($value)) {
            throw new BadRequestException("Le paramètre '$name' doit être une chaîne de caractères.");
        }
        $value = trim($value);
        $length = mb_strlen($value);
        if ($length < $min || $length > $max) {
            throw new BadRequestException("Le paramètre '$name' doit contenir entre $min et $max caractères.");
        }
        return $value;
    }

    // Mot de passe : jamais modifié (pas de trim), seule la présence est vérifiée ici
    protected function getPassword(string $name): string
    {
        $value = $this->form[$name] ?? null;
        if (!is_string($value) || $value === '') {
            throw new BadRequestException("Le paramètre '$name' doit être une chaîne non vide.");
        }
        return $value;
    }

    // Booléen : true/false, 1/0, "true"/"false", "1"/"0"
    protected function getBool(string $name): bool
    {
        $value = $this->form[$name] ?? null;
        if (is_bool($value)) {
            return $value;
        }
        if (in_array($value, [1, '1', 'true'], true)) {
            return true;
        }
        if (in_array($value, [0, '0', 'false'], true)) {
            return false;
        }
        throw new BadRequestException("Le paramètre '$name' doit être un booléen.");
    }

    protected function getFloat(string $name): float
    {
        $value = $this->form[$name] ?? null;
        if (is_int($value) || is_float($value) || (is_string($value) && is_numeric($value))) {
            return (float)$value;
        }
        throw new BadRequestException("Le paramètre '$name' doit être un nombre.");
    }

    private static function toPositiveInt(mixed $value): ?int
    {
        if (is_int($value)) {
            return $value > 0 ? $value : null;
        }
        if (is_string($value) && ctype_digit($value) && strlen($value) <= 18 && (int)$value > 0) {
            return (int)$value;
        }
        return null;
    }
}
?>
