<?php

require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/services/AbstractService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/Compte.php");
require_once(ROOT . "/entities/Role.php");
require_once(ROOT . "/daos/CompteDao.php");
require_once(ROOT . "/daos/RoleDao.php");
require_once(ROOT . "/exceptions/BadRequestException.php");
require_once(ROOT . "/exceptions/UnauthorizedException.php");
require_once(ROOT . "/exceptions/ForbiddenException.php");
require_once(ROOT . "/exceptions/NotFoundException.php");
require_once(ROOT . "/exceptions/ConflictException.php");

class CompteService extends AbstractService implements IService
{
    private RoleDao $roleDao;

    public function __construct() {
        $this->dao = new CompteDao();
        $this->roleDao = new RoleDao();
    }

    function getDao(): CompteDao {
        return $this->dao;
    }

    // Liste de tous les comptes (bannis et supprimés compris) : administrateurs seulement
    function findAll(): array {
        AuthService::requireAdmin();
        return $this->getDao()->findAll();
    }

    // Son propre compte, ou n'importe quel compte pour un administrateur
    function findByPk(int|array $pk): Compte {
        $moi = AuthService::requireUser();
        if (!$moi->isAdmin() && $moi->getPkCompte() !== $pk) {
            throw new ForbiddenException("Vous ne pouvez consulter que votre propre compte.");
        }
        return $this->findOrFail($pk, "Compte introuvable.");
    }

    // Inscription. Le compte reçu porte le mot de passe en clair : il est remplacé par son hash.
    function insert(IEntity $entity): int {
        /** @var Compte $entity */
        if (AuthService::isLogged()) {
            throw new ConflictException("Vous êtes déjà connecté : déconnectez-vous pour créer un autre compte.");
        }
        $this->checkEmailDisponible($entity->getEmail(), null);
        $this->checkPseudoDisponible($entity->getPseudo(), null);

        $role = $this->roleDao->findByPk(Role::UTILISATEUR);
        if ($role === null) {
            throw new HttpStatusException("Le rôle utilisateur est absent de la base.", 500);
        }

        $entity->setMotDePasse(password_hash($entity->getMotDePasse(), PASSWORD_DEFAULT));
        $entity->setDateCreation(new DateTime());
        $entity->setEstBanni(false);
        $entity->setEstSupprime(false);
        $entity->setFkRole($role->getPkRole());

        $pk = $this->getDao()->insert($entity);
        $entity->setPkCompte($pk);
        $entity->setRoleNom($role->getNom());
        return $pk;
    }

    // Connexion : renvoie le compte si l'email et le mot de passe sont corrects
    function authenticate(string $email, string $motDePasse): Compte {
        if (AuthService::isLogged()) {
            throw new ConflictException("Vous êtes déjà connecté.");
        }

        $compte = $this->getDao()->findByEmail($email);
        // Même message que l'email existe ou non : on ne révèle pas quels emails sont inscrits
        if ($compte === null
            || $compte->getEstSupprime()
            || $compte->getMotDePasse() === ""
            || !password_verify($motDePasse, $compte->getMotDePasse())) {
            throw new UnauthorizedException("Email ou mot de passe incorrect.");
        }
        if ($compte->getEstBanni()) {
            throw new ForbiddenException("Ce compte a été banni.");
        }

        // Hash plus robuste disponible (nouvelle version de PHP) : on le met à jour
        if (password_needs_rehash($compte->getMotDePasse(), PASSWORD_DEFAULT)) {
            $compte->setMotDePasse(password_hash($motDePasse, PASSWORD_DEFAULT));
            $this->getDao()->update($compte);
        }
        return $compte;
    }

    // Modification d'un compte. $entity contient l'état voulu (chargé puis modifié par le contrôleur) ;
    // il est comparé à la version en base pour savoir ce qui change et qui a le droit de le changer :
    //  - le titulaire : email, pseudo, mot de passe (email et mot de passe exigent l'ancien mot de passe)
    //  - un administrateur, sur le compte d'un autre : est_banni, est_supprime, fk_role
    function update(IEntity $entity, ?string $nouveauMotDePasse = null, ?string $ancienMotDePasse = null): Compte {
        /** @var Compte $entity */
        $moi = AuthService::requireUser();
        $avant = $this->findByPk($entity->getPkCompte());
        $estTitulaire = $moi->getPkCompte() === $avant->getPkCompte();

        $changeEmail = mb_strtolower($entity->getEmail()) !== mb_strtolower($avant->getEmail());
        $changePseudo = $entity->getPseudo() !== $avant->getPseudo();
        $changeStatut = $entity->getEstBanni() !== $avant->getEstBanni()
            || $entity->getEstSupprime() !== $avant->getEstSupprime()
            || $entity->getFkRole() !== $avant->getFkRole();

        if (($changeEmail || $changePseudo || $nouveauMotDePasse !== null) && !$estTitulaire) {
            throw new ForbiddenException("Seul le titulaire du compte peut modifier son email, son pseudo ou son mot de passe.");
        }
        if ($changeStatut) {
            if (!$moi->isAdmin()) {
                throw new ForbiddenException("Seul un administrateur peut bannir, restaurer ou changer le rôle d'un compte.");
            }
            if ($estTitulaire) {
                throw new ConflictException("Un administrateur ne peut pas modifier le statut ou le rôle de son propre compte.");
            }
            if ($this->roleDao->findByPk($entity->getFkRole()) === null) {
                throw new NotFoundException("Rôle introuvable.");
            }
        }
        if ($changeEmail || $nouveauMotDePasse !== null) {
            if ($ancienMotDePasse === null) {
                throw new BadRequestException("Le paramètre 'ancien_mot_de_passe' est obligatoire pour changer l'email ou le mot de passe.");
            }
            if (!password_verify($ancienMotDePasse, $avant->getMotDePasse())) {
                throw new ForbiddenException("Ancien mot de passe incorrect.");
            }
        }
        if ($changeEmail) {
            $this->checkEmailDisponible($entity->getEmail(), $avant->getPkCompte());
        }
        if ($changePseudo) {
            $this->checkPseudoDisponible($entity->getPseudo(), $avant->getPkCompte());
        }

        // On repart de la version en base : seuls les champs autorisés sont recopiés
        $avant->setEmail($entity->getEmail());
        $avant->setPseudo($entity->getPseudo());
        $avant->setEstBanni($entity->getEstBanni());
        $avant->setEstSupprime($entity->getEstSupprime());
        $avant->setFkRole($entity->getFkRole());
        if ($nouveauMotDePasse !== null) {
            $avant->setMotDePasse(password_hash($nouveauMotDePasse, PASSWORD_DEFAULT));
        }

        $this->getDao()->update($avant);
        return $this->findOrFail($avant->getPkCompte(), "Compte introuvable.");
    }

    // Suppression logique : par le titulaire ou par un administrateur
    function delete(int|array $pk): void {
        $compte = $this->findByPk($pk);
        if ($compte->getEstSupprime()) {
            throw new NotFoundException("Ce compte est déjà supprimé.");
        }
        $this->getDao()->delete($compte->getPkCompte());
    }

    private function checkEmailDisponible(string $email, ?int $pkActuel): void {
        $existant = $this->getDao()->findByEmail($email);
        if ($existant !== null && $existant->getPkCompte() !== $pkActuel) {
            throw new ConflictException("Cet email est déjà utilisé.");
        }
    }

    private function checkPseudoDisponible(string $pseudo, ?int $pkActuel): void {
        $existant = $this->getDao()->findByPseudo($pseudo);
        if ($existant !== null && $existant->getPkCompte() !== $pkActuel) {
            throw new ConflictException("Ce pseudo est déjà utilisé.");
        }
    }
}
?>
