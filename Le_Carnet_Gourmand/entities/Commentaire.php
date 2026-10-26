<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/AbstractEntity.php");

// Table `ecrire_commentaire` : pas d'identifiant propre, un commentaire est repéré
// par le couple (fk_compte, fk_recette) → un commentaire par compte et par recette.
class Commentaire extends AbstractEntity implements IEntity
{
    private ?int $fk_compte = null;
    private ?int $fk_recette = null;
    private string $contenu = "";
    private ?DateTime $date_creation = null;
    private bool $est_approuve = false;
    private bool $est_supprime = false;

    // Champ lu par jointure (comptes.pseudo, null si le compte auteur est supprimé), non enregistré
    private ?string $auteur_pseudo = null;

    public function getFkCompte(): ?int {
        return $this->fk_compte;
    }
    public function setFkCompte(?int $fk_compte): void {
        $this->fk_compte = $fk_compte;
    }

    public function getFkRecette(): ?int {
        return $this->fk_recette;
    }
    public function setFkRecette(?int $fk_recette): void {
        $this->fk_recette = $fk_recette;
    }

    public function getContenu(): string {
        return $this->contenu;
    }
    public function setContenu(string $contenu): void {
        $this->contenu = $contenu;
    }

    public function getDateCreation(): ?DateTime {
        return $this->date_creation;
    }
    public function setDateCreation(?DateTime $date_creation): void {
        $this->date_creation = $date_creation;
    }

    public function getEstApprouve(): bool {
        return $this->est_approuve;
    }
    public function setEstApprouve(bool $est_approuve): void {
        $this->est_approuve = $est_approuve;
    }

    public function getEstSupprime(): bool {
        return $this->est_supprime;
    }
    public function setEstSupprime(bool $est_supprime): void {
        $this->est_supprime = $est_supprime;
    }

    public function getAuteurPseudo(): ?string {
        return $this->auteur_pseudo;
    }
    public function setAuteurPseudo(?string $auteur_pseudo): void {
        $this->auteur_pseudo = $auteur_pseudo;
    }

    // Clé composite utilisée par le DAO
    public function getPk(): array {
        return ['fk_compte' => $this->fk_compte, 'fk_recette' => $this->fk_recette];
    }

    // Commentaire::createFromRow($row) (lecture BDD)
    public static function createFromRow(object $row): Commentaire {
        $commentaire = new Commentaire();
        $commentaire->setFkCompte((int)$row->fk_compte);
        $commentaire->setFkRecette((int)$row->fk_recette);
        $commentaire->setContenu($row->contenu);
        $commentaire->setDateCreation(self::toDateTime($row->date_creation));
        $commentaire->setEstApprouve((bool)$row->est_approuve);
        $commentaire->setEstSupprime((bool)$row->est_supprime);
        $commentaire->setAuteurPseudo($row->auteur_pseudo ?? null);
        return $commentaire;
    }

    // Commentaire::create(...) (POST) : l'auteur, la date et le statut sont fixés par le service
    public static function create(int $fkRecette, string $contenu): Commentaire {
        $commentaire = new Commentaire();
        $commentaire->setFkRecette($fkRecette);
        $commentaire->setContenu($contenu);
        return $commentaire;
    }
}
?>
