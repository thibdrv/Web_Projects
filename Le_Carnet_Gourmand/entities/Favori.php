<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/AbstractEntity.php");
require_once(ROOT . "/entities/Recette.php");

// Table `favori` (clé composite fk_compte + fk_recette)
class Favori extends AbstractEntity implements IEntity
{
    private ?int $fk_compte = null;
    private ?int $fk_recette = null;

    // Recette complète, chargée par jointure pour la liste des favoris (non enregistrée)
    private ?Recette $recette = null;

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

    public function getRecette(): ?Recette {
        return $this->recette;
    }
    public function setRecette(?Recette $recette): void {
        $this->recette = $recette;
    }

    public function getPk(): array {
        return ['fk_compte' => $this->fk_compte, 'fk_recette' => $this->fk_recette];
    }

    // Favori::createFromRow($row) (lecture BDD)
    public static function createFromRow(object $row): Favori {
        return self::create((int)$row->fk_compte, (int)$row->fk_recette);
    }

    // Favori::create(...) (POST)
    public static function create(?int $fkCompte, int $fkRecette): Favori {
        $favori = new Favori();
        $favori->setFkCompte($fkCompte);
        $favori->setFkRecette($fkRecette);
        return $favori;
    }
}
?>
