<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/AbstractEntity.php");

// Table `mettre_note` (clé composite fk_compte + fk_recette, note DECIMAL(2,1))
class Note extends AbstractEntity implements IEntity
{
    private ?int $fk_compte = null;
    private ?int $fk_recette = null;
    private ?float $note = null;

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

    public function getNote(): ?float {
        return $this->note;
    }
    public function setNote(?float $note): void {
        $this->note = $note;
    }

    public function getPk(): array {
        return ['fk_compte' => $this->fk_compte, 'fk_recette' => $this->fk_recette];
    }

    // Note::createFromRow($row) (lecture BDD)
    public static function createFromRow(object $row): Note {
        $note = new Note();
        $note->setFkCompte((int)$row->fk_compte);
        $note->setFkRecette((int)$row->fk_recette);
        $note->setNote($row->note === null ? null : (float)$row->note);
        return $note;
    }

    // Note::create(...) (POST / PUT) : le compte est fixé par le service
    public static function create(int $fkRecette, float $note): Note {
        $noteObj = new Note();
        $noteObj->setFkRecette($fkRecette);
        $noteObj->setNote($note);
        return $noteObj;
    }
}
?>
