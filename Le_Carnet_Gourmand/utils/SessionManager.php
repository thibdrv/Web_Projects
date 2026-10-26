<?php

// Gestion bas niveau de la session PHP : cookie, expiration, stockage du compte connecté.
// La vérification du compte (banni, supprimé, rôle) est faite par services/AuthService.php.
class SessionManager
{
    const PK_COMPTE = "pk_compte";
    const FK_ROLE = "fk_role";
    const START_TIME = "start_time";
    const LAST_ACTIVITY = "last_activity";

    // Déconnexion automatique après 45 minutes sans requête
    const MAX_INACTIVITY = 45 * 60;

    public static function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => self::isHttps(),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();

        if (self::isExpired()) {
            $_SESSION = [];
            session_regenerate_id(true);
        }

        $now = time();
        $_SESSION[self::START_TIME] ??= $now;
        $_SESSION[self::LAST_ACTIVITY] = $now;
    }

    public static function isLogged(): bool
    {
        return isset($_SESSION[self::PK_COMPTE]);
    }

    public static function getComptePk(): ?int
    {
        return self::isLogged() ? (int)$_SESSION[self::PK_COMPTE] : null;
    }

    public static function getRolePk(): ?int
    {
        return isset($_SESSION[self::FK_ROLE]) ? (int)$_SESSION[self::FK_ROLE] : null;
    }

    // Timestamp Unix auquel la session expirera sans nouvelle requête
    public static function getExpirationTime(): ?int
    {
        return isset($_SESSION[self::LAST_ACTIVITY]) ? $_SESSION[self::LAST_ACTIVITY] + self::MAX_INACTIVITY : null;
    }

    public static function login(int $pkCompte, int $fkRole): void
    {
        // Nouvel identifiant de session à la connexion (protection contre la fixation de session)
        session_regenerate_id(true);
        $now = time();
        $_SESSION = [
            self::PK_COMPTE => $pkCompte,
            self::FK_ROLE => $fkRole,
            self::START_TIME => $now,
            self::LAST_ACTIVITY => $now,
        ];
    }

    public static function logout(): void
    {
        $_SESSION = [];
        if (session_status() !== PHP_SESSION_ACTIVE) {
            return;
        }
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $params['path'],
                'domain' => $params['domain'],
                'secure' => $params['secure'],
                'httponly' => $params['httponly'],
                'samesite' => $params['samesite'] ?? 'Lax',
            ]);
        }
        session_destroy();
    }

    private static function isExpired(): bool
    {
        return isset($_SESSION[self::LAST_ACTIVITY])
            && time() - $_SESSION[self::LAST_ACTIVITY] > self::MAX_INACTIVITY;
    }

    private static function isHttps(): bool
    {
        return !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    }
}
?>
