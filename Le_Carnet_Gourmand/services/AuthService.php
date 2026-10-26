<?php

require_once(ROOT . "/utils/SessionManager.php");
require_once(ROOT . "/daos/CompteDao.php");
require_once(ROOT . "/entities/Compte.php");
require_once(ROOT . "/entities/Role.php");
require_once(ROOT . "/exceptions/UnauthorizedException.php");
require_once(ROOT . "/exceptions/ForbiddenException.php");

// Qui fait la requête ? Le compte connecté est relu en base une seule fois par requête :
// un compte banni ou supprimé depuis sa connexion perd immédiatement sa session.
class AuthService
{
    private static ?Compte $currentUser = null;
    private static bool $loaded = false;

    public static function currentUser(): ?Compte
    {
        if (!self::$loaded) {
            self::$loaded = true;
            $pk = SessionManager::getComptePk();
            if ($pk !== null) {
                $compte = (new CompteDao())->findByPk($pk);
                if ($compte === null || $compte->getEstSupprime() || $compte->getEstBanni()) {
                    SessionManager::logout();
                } else {
                    self::$currentUser = $compte;
                }
            }
        }
        return self::$currentUser;
    }

    public static function isLogged(): bool
    {
        return self::currentUser() !== null;
    }

    public static function isAdmin(): bool
    {
        $compte = self::currentUser();
        return $compte !== null && $compte->isAdmin();
    }

    // 401 si personne n'est connecté
    public static function requireUser(): Compte
    {
        $compte = self::currentUser();
        if ($compte === null) {
            throw new UnauthorizedException("Vous devez être connecté.");
        }
        return $compte;
    }

    // 401 si personne n'est connecté, 403 si le compte n'est pas administrateur
    public static function requireAdmin(): Compte
    {
        $compte = self::requireUser();
        if (!$compte->isAdmin()) {
            throw new ForbiddenException("Action réservée aux administrateurs.");
        }
        return $compte;
    }

    // Le compte connecté est le propriétaire de la ressource, ou un administrateur
    public static function canManage(?int $fkCompteProprietaire): bool
    {
        $compte = self::currentUser();
        return $compte !== null && ($compte->isAdmin() || $compte->getPkCompte() === $fkCompteProprietaire);
    }

    public static function login(Compte $compte): void
    {
        SessionManager::login($compte->getPkCompte(), $compte->getFkRole());
        self::$currentUser = $compte;
        self::$loaded = true;
    }

    public static function logout(): void
    {
        SessionManager::logout();
        self::$currentUser = null;
        self::$loaded = true;
    }
}
?>
