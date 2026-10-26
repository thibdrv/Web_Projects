<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/AbstractEntity.php");
require_once(ROOT . "/entities/Categorie.php");

// Table `recettes`
class Recette extends AbstractEntity implements IEntity
{
    private ?int $pk_recette = null;
    private string $nom = "";
    private string $ingredients = "";
    private string $details = "";
    private ?DateTime $date_creation = null;
    private ?DateTime $date_modification = null;
    private bool $est_approuve = false;
    private bool $est_supprime = false;
    private string $image = "";   // colonne NOT NULL : chaîne vide si aucune image
    private ?string $lien = null;
    private ?int $fk_compte = null;

    // Champs lus par jointure, non enregistrés dans `recettes`
    private ?string $auteur_pseudo = null; // comptes.pseudo de l'auteur (null si compte supprimé)
    private array $categories = [];        // Categorie[] via `categories_recettes`

    public function getPkRecette(): ?int {
        return $this->pk_recette;
    }
    public function setPkRecette(?int $pk_recette): void {
        $this->pk_recette = $pk_recette;
    }

    public function getNom(): string {
        return $this->nom;
    }
    public function setNom(string $nom): void {
        $this->nom = $nom;
    }

    public function getIngredients(): string {
        return $this->ingredients;
    }
    public function setIngredients(string $ingredients): void {
        $this->ingredients = $ingredients;
    }

    public function getDetails(): string {
        return $this->details;
    }
    public function setDetails(string $details): void {
        $this->details = $details;
    }

    public function getDateCreation(): ?DateTime {
        return $this->date_creation;
    }
    public function setDateCreation(?DateTime $date_creation): void {
        $this->date_creation = $date_creation;
    }

    public function getDateModification(): ?DateTime {
        return $this->date_modification;
    }
    public function setDateModification(?DateTime $date_modification): void {
        $this->date_modification = $date_modification;
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

    public function getImage(): string {
        return $this->image;
    }
    public function setImage(string $image): void {
        $this->image = $image;
    }

    public function getLien(): ?string {
        return $this->lien;
    }
    public function setLien(?string $lien): void {
        $this->lien = $lien;
    }

    public function getFkCompte(): ?int {
        return $this->fk_compte;
    }
    public function setFkCompte(?int $fk_compte): void {
        $this->fk_compte = $fk_compte;
    }

    public function getAuteurPseudo(): ?string {
        return $this->auteur_pseudo;
    }
    public function setAuteurPseudo(?string $auteur_pseudo): void {
        $this->auteur_pseudo = $auteur_pseudo;
    }

    /** @return Categorie[] */
    public function getCategories(): array {
        return $this->categories;
    }
    /** @param Categorie[] $categories */
    public function setCategories(array $categories): void {
        $this->categories = $categories;
    }

    // Recette::createFromRow($row) (lecture BDD)
    public static function createFromRow(object $row): Recette {
        $recette = new Recette();
        $recette->setPkRecette((int)$row->pk_recette);
        $recette->setNom($row->nom);
        $recette->setIngredients($row->ingredients);
        $recette->setDetails($row->details);
        $recette->setDateCreation(self::toDateTime($row->date_creation));
        $recette->setDateModification(self::toDateTime($row->date_modification));
        $recette->setEstApprouve((bool)$row->est_approuve);
        $recette->setEstSupprime((bool)$row->est_supprime);
        $recette->setImage($row->image ?? "");
        // lien vide ('') et NULL coexistent dans le jeu de données : on normalise en null
        $recette->setLien(($row->lien ?? '') === '' ? null : $row->lien);
        $recette->setFkCompte((int)$row->fk_compte);
        $recette->setAuteurPseudo($row->auteur_pseudo ?? null);
        return $recette;
    }

    // Recette::create(...) (POST) : dates, statut et auteur sont fixés par le service
    public static function create(string $nom, string $ingredients, string $details, string $image = "", ?string $lien = null): Recette {
        $recette = new Recette();
        $recette->setNom($nom);
        $recette->setIngredients($ingredients);
        $recette->setDetails($details);
        $recette->setImage($image);
        $recette->setLien($lien);
        return $recette;
    }
}
?>
