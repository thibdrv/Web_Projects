<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/AbstractEntity.php");

// Table de liaison `categories_recettes` (clé composite fk_recette + fk_categorie)
class CategorieRecette extends AbstractEntity implements IEntity
{
    private ?int $fk_recette = null;
    private ?int $fk_categorie = null;

    // Champs lus par jointure, non enregistrés
    private ?string $recette_nom = null;
    private ?string $categorie_nom = null;

    public function getFkRecette(): ?int {
        return $this->fk_recette;
    }
    public function setFkRecette(?int $fk_recette): void {
        $this->fk_recette = $fk_recette;
    }

    public function getFkCategorie(): ?int {
        return $this->fk_categorie;
    }
    public function setFkCategorie(?int $fk_categorie): void {
        $this->fk_categorie = $fk_categorie;
    }

    public function getRecetteNom(): ?string {
        return $this->recette_nom;
    }
    public function setRecetteNom(?string $recette_nom): void {
        $this->recette_nom = $recette_nom;
    }

    public function getCategorieNom(): ?string {
        return $this->categorie_nom;
    }
    public function setCategorieNom(?string $categorie_nom): void {
        $this->categorie_nom = $categorie_nom;
    }

    public function getPk(): array {
        return ['fk_recette' => $this->fk_recette, 'fk_categorie' => $this->fk_categorie];
    }

    // CategorieRecette::createFromRow($row) (lecture BDD)
    public static function createFromRow(object $row): CategorieRecette {
        $categorieRecette = self::create((int)$row->fk_recette, (int)$row->fk_categorie);
        $categorieRecette->setRecetteNom($row->recette_nom ?? null);
        $categorieRecette->setCategorieNom($row->categorie_nom ?? null);
        return $categorieRecette;
    }

    // CategorieRecette::create(...) (POST)
    public static function create(int $fkRecette, int $fkCategorie): CategorieRecette {
        $categorieRecette = new CategorieRecette();
        $categorieRecette->setFkRecette($fkRecette);
        $categorieRecette->setFkCategorie($fkCategorie);
        return $categorieRecette;
    }
}
?>
