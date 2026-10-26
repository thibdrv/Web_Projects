<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/daos/AbstractDao.php");
require_once(ROOT . "/daos/RecetteDao.php");
require_once(ROOT . "/entities/Favori.php");
require_once(ROOT . "/entities/Recette.php");

class FavoriDao extends AbstractDao implements IDao
{
    function getTableName(): string {
        return "favori";
    }

    function getPrimaryKeyName(): array {
        return ["fk_compte", "fk_recette"];
    }

    function createEntityFromRow(object $row): Favori {
        return Favori::createFromRow($row);
    }

    function findByPk(int|array $pk): ?Favori {
        return parent::findByPk($pk);
    }

    // Favoris d'un compte, avec la recette complète (recettes supprimées exclues)
    function findByCompte(int $fkCompte): array {
        $rows = $this->db()->fetchAll(
            RecetteDao::SELECT . "
             INNER JOIN favori f ON f.fk_recette = r.pk_recette
             WHERE f.fk_compte = :fkCompte AND r.est_supprime = 0
             ORDER BY r.nom",
            [":fkCompte" => $fkCompte]
        );

        $favoris = [];
        foreach ($rows as $row) {
            $favori = Favori::create($fkCompte, (int)$row->pk_recette);
            $favori->setRecette(Recette::createFromRow($row));
            $favoris[] = $favori;
        }
        return $favoris;
    }

    function exists(int $fkCompte, int $fkRecette): bool {
        return $this->findByPk(['fk_compte' => $fkCompte, 'fk_recette' => $fkRecette]) !== null;
    }

    // La table n'a pas de clé primaire en BDD : renvoie le nombre de lignes insérées
    function insert(IEntity $entity): int {
        $this->checkEntity($entity, Favori::class);
        /** @var Favori $entity */
        return $this->db()->execute(
            "INSERT INTO favori (fk_compte, fk_recette) VALUES (:fkCompte, :fkRecette)",
            [":fkCompte" => $entity->getFkCompte(), ":fkRecette" => $entity->getFkRecette()]
        );
    }

    // Un favori n'a aucune colonne modifiable en dehors de sa clé
    function update(IEntity $entity): bool {
        throw new LogicException("Un favori ne se modifie pas : supprimer puis recréer.");
    }
}
?>
