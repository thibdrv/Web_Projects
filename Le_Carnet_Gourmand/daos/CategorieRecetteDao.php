<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/daos/AbstractDao.php");
require_once(ROOT . "/entities/CategorieRecette.php");

class CategorieRecetteDao extends AbstractDao implements IDao
{
    // Liaison + noms de la recette et de la catégorie
    private const SELECT = "SELECT cr.fk_recette, cr.fk_categorie, r.nom AS recette_nom, c.nom AS categorie_nom
                            FROM categories_recettes cr
                            INNER JOIN recettes r ON r.pk_recette = cr.fk_recette
                            INNER JOIN categories c ON c.pk_categorie = cr.fk_categorie";

    function getTableName(): string {
        return "categories_recettes";
    }

    function getPrimaryKeyName(): array {
        return ["fk_recette", "fk_categorie"];
    }

    function createEntityFromRow(object $row): CategorieRecette {
        return CategorieRecette::createFromRow($row);
    }

    function findAll(): array {
        $rows = $this->db()->fetchAll(self::SELECT . " ORDER BY cr.fk_recette, c.nom");
        return $this->createEntitiesFromRows($rows);
    }

    function findByPk(int|array $pk): ?CategorieRecette {
        [$where, $params] = $this->pkCondition($pk, "cr");
        $row = $this->db()->fetchOne(self::SELECT . " WHERE " . $where . " LIMIT 1", $params);
        return $row === null ? null : $this->createEntityFromRow($row);
    }

    function findByRecette(int $fkRecette): array {
        $rows = $this->db()->fetchAll(self::SELECT . " WHERE cr.fk_recette = :fkRecette ORDER BY c.nom", [
            ":fkRecette" => $fkRecette,
        ]);
        return $this->createEntitiesFromRows($rows);
    }

    // Liaisons d'une catégorie vers des recettes non supprimées (éventuellement approuvées seulement)
    function findByCategorie(int $fkCategorie, bool $approuveesSeulement): array {
        $sql = self::SELECT . " WHERE cr.fk_categorie = :fkCategorie AND r.est_supprime = 0";
        if ($approuveesSeulement) {
            $sql .= " AND r.est_approuve = 1";
        }
        $rows = $this->db()->fetchAll($sql . " ORDER BY r.nom", [":fkCategorie" => $fkCategorie]);
        return $this->createEntitiesFromRows($rows);
    }

    function countByRecette(int $fkRecette): int {
        return (int)$this->db()->fetchValue(
            "SELECT COUNT(*) FROM categories_recettes WHERE fk_recette = :fkRecette",
            [":fkRecette" => $fkRecette]
        );
    }

    function countByCategorie(int $fkCategorie): int {
        return (int)$this->db()->fetchValue(
            "SELECT COUNT(*) FROM categories_recettes WHERE fk_categorie = :fkCategorie",
            [":fkCategorie" => $fkCategorie]
        );
    }

    // La table n'a pas de clé primaire en BDD : renvoie le nombre de lignes insérées
    function insert(IEntity $entity): int {
        $this->checkEntity($entity, CategorieRecette::class);
        /** @var CategorieRecette $entity */
        return $this->db()->execute(
            "INSERT INTO categories_recettes (fk_recette, fk_categorie) VALUES (:fkRecette, :fkCategorie)",
            [":fkRecette" => $entity->getFkRecette(), ":fkCategorie" => $entity->getFkCategorie()]
        );
    }

    // Une liaison n'a aucune colonne modifiable en dehors de sa clé
    function update(IEntity $entity): bool {
        throw new LogicException("Une liaison catégorie/recette ne se modifie pas : supprimer puis recréer.");
    }

    function deleteByRecette(int $fkRecette): int {
        return $this->db()->execute("DELETE FROM categories_recettes WHERE fk_recette = :fkRecette", [
            ":fkRecette" => $fkRecette,
        ]);
    }
}
?>
