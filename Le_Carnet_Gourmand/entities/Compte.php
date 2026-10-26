<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/AbstractEntity.php");
require_once(ROOT . "/entities/Role.php");

// Table `comptes`
class Compte extends AbstractEntity implements IEntity
{
    // Le hash du mot de passe ne sort jamais dans le JSON
    protected const HIDDEN_FIELDS = ['mot_de_passe'];

    private ?int $pk_compte = null;
    private string $email = "";
    private string $pseudo = "";
    private string $mot_de_passe = ""; // hash (password_hash), jamais le mot de passe en clair en BDD
    private ?DateTime $date_creation = null;
    private bool $est_banni = false;
    private bool $est_supprime = false;
    private int $fk_role = Role::UTILISATEUR;

    // Champ lu par jointure (roles.nom), non enregistré
    private ?string $role_nom = null;

    public function getPkCompte(): ?int {
        return $this->pk_compte;
    }
    public function setPkCompte(?int $pk_compte): void {
        $this->pk_compte = $pk_compte;
    }

    public function getEmail(): string {
        return $this->email;
    }
    public function setEmail(string $email): void {
        $this->email = $email;
    }

    public function getPseudo(): string {
        return $this->pseudo;
    }
    public function setPseudo(string $pseudo): void {
        $this->pseudo = $pseudo;
    }

    public function getMotDePasse(): string {
        return $this->mot_de_passe;
    }
    public function setMotDePasse(string $mot_de_passe): void {
        $this->mot_de_passe = $mot_de_passe;
    }

    public function getDateCreation(): ?DateTime {
        return $this->date_creation;
    }
    public function setDateCreation(?DateTime $date_creation): void {
        $this->date_creation = $date_creation;
    }

    public function getEstBanni(): bool {
        return $this->est_banni;
    }
    public function setEstBanni(bool $est_banni): void {
        $this->est_banni = $est_banni;
    }

    public function getEstSupprime(): bool {
        return $this->est_supprime;
    }
    public function setEstSupprime(bool $est_supprime): void {
        $this->est_supprime = $est_supprime;
    }

    public function getFkRole(): int {
        return $this->fk_role;
    }
    public function setFkRole(int $fk_role): void {
        $this->fk_role = $fk_role;
    }

    public function getRoleNom(): ?string {
        return $this->role_nom;
    }
    public function setRoleNom(?string $role_nom): void {
        $this->role_nom = $role_nom;
    }

    public function isAdmin(): bool {
        return $this->fk_role === Role::ADMIN;
    }

    // Compte::createFromRow($row) (lecture BDD)
    public static function createFromRow(object $row): Compte {
        $compte = new Compte();
        $compte->setPkCompte((int)$row->pk_compte);
        $compte->setEmail($row->email);
        $compte->setPseudo($row->pseudo);
        $compte->setMotDePasse($row->mot_de_passe ?? "");
        $compte->setDateCreation(self::toDateTime($row->date_creation));
        $compte->setEstBanni((bool)$row->est_banni);
        $compte->setEstSupprime((bool)$row->est_supprime);
        $compte->setFkRole((int)$row->fk_role);
        $compte->setRoleNom($row->role_nom ?? null);
        return $compte;
    }

    // Compte::create(...) (inscription) : $motDePasse est le mot de passe saisi,
    // le service le remplace par son hash avant l'insertion
    public static function create(string $email, string $pseudo, string $motDePasse): Compte {
        $compte = new Compte();
        $compte->setEmail($email);
        $compte->setPseudo($pseudo);
        $compte->setMotDePasse($motDePasse);
        $compte->setDateCreation(new DateTime());
        $compte->setFkRole(Role::UTILISATEUR);
        return $compte;
    }
}
?>
