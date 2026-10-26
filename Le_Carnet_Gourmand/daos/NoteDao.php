<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/daos/AbstractDao.php");
require_once(ROOT . "/entities/Note.php");

class NoteDao extends AbstractDao implements IDao
{
    function getTableName(): string {
        return "mettre_note";
    }

    // Clé composite
    function getPrimaryKeyName(): array {
        return ["fk_compte", "fk_recette"];
    }

    function createEntityFromRow(object $row): Note {
        return Note::createFromRow($row);
    }

    function findByPk(int|array $pk): ?Note {
        return parent::findByPk($pk);
    }

    // Toutes les notes d'un compte (tableau vide s'il n'a rien noté)
    function findByCompte(int $fkCompte): array {
        $rows = $this->db()->fetchAll(
            "SELECT mn.* FROM mettre_note mn WHERE mn.fk_compte = :fkCompte ORDER BY mn.fk_recette",
            [":fkCompte" => $fkCompte]
        );
        return $this->createEntitiesFromRows($rows);
    }

    // Moyenne et nombre de notes d'une recette (les notes NULL sont ignorées)
    function statsByRecette(int $fkRecette): object {
        return $this->db()->fetchOne(
            "SELECT AVG(note) AS moyenne, COUNT(note) AS nombre_notes
             FROM mettre_note
             WHERE fk_recette = :fkRecette",
            [":fkRecette" => $fkRecette]
        );
    }

    // La table n'a pas de clé primaire en BDD : renvoie le nombre de lignes insérées
    function insert(IEntity $entity): int {
        $this->checkEntity($entity, Note::class);
        /** @var Note $entity */
        return $this->db()->execute(
            "INSERT INTO mettre_note (fk_compte, fk_recette, note) VALUES (:fkCompte, :fkRecette, :note)",
            [
                ":fkCompte" => $entity->getFkCompte(),
                ":fkRecette" => $entity->getFkRecette(),
                ":note" => $entity->getNote(),
            ]
        );
    }

    function update(IEntity $entity): bool {
        $this->checkEntity($entity, Note::class);
        /** @var Note $entity */
        return $this->db()->execute(
            "UPDATE mettre_note SET note = :note WHERE fk_compte = :fkCompte AND fk_recette = :fkRecette",
            [
                ":note" => $entity->getNote(),
                ":fkCompte" => $entity->getFkCompte(),
                ":fkRecette" => $entity->getFkRecette(),
            ]
        ) > 0;
    }
}
?>
