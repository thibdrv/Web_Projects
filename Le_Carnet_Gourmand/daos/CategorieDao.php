<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/daos/AbstractDao.php");
require_once(ROOT . "/entities/Categorie.php");

class CategorieDao extends AbstractDao implements IDao
{
    function getTableName(): string {
        return "categories";
    }

    function getPrimaryKeyName(): string {
        return "pk_categorie";
    }

    function createEntityFromRow(object $row): Categorie {
        return Categorie::createFromRow($row);
    }

    function findAll(): array {
        $rows = $this->db()->fetchAll("SELECT c.* FROM categories c ORDER BY c.nom");
        return $this->createEntitiesFromRows($rows);
    }

    function findByPk(int|array $pk): ?Categorie {
        return parent::findByPk($pk);
    }

    // La colonne `nom` est UNIQUE (comparaison insensible à la casse avec la collation de la table)
    function findByNom(string $nom): ?Categorie {
        $row = $this->db()->fetchOne("SELECT c.* FROM categories c WHERE c.nom = :nom LIMIT 1", [":nom" => $nom]);
        return $row === null ? null : $this->createEntityFromRow($row);
    }

    // Catégories de plusieurs recettes en une seule requête : [pk_recette => Categorie[]]
    function findByRecettes(array $pkRecettes): array {
        if (empty($pkRecettes)) {
            return [];
        }
        [$in, $params] = $this->inClause($pkRecettes);
        $rows = $this->db()->fetchAll(
            "SELECT cr.fk_recette, c.*
             FROM categories_recettes cr
             INNER JOIN categories c ON c.pk_categorie = cr.fk_categorie
             WHERE cr.fk_recette IN (" . $in . ")
             ORDER BY c.nom",
            $params
        );

        $categoriesParRecette = [];
        foreach ($rows as $row) {
            $categoriesParRecette[(int)$row->fk_recette][] = $this->createEntityFromRow($row);
        }
        return $categoriesParRecette;
    }

    function insert(IEntity $entity): int {
        $this->checkEntity($entity, Categorie::class);
        /** @var Categorie $entity */
        return $this->db()->insert("INSERT INTO categories (nom) VALUES (:nom)", [
            ":nom" => $entity->getNom(),
        ]);
    }

    function update(IEntity $entity): bool {
        $this->checkEntity($entity, Categorie::class);
        /** @var Categorie $entity */
        return $this->db()->execute("UPDATE categories SET nom = :nom WHERE pk_categorie = :pk", [
            ":nom" => $entity->getNom(),
            ":pk" => $entity->getPkCategorie(),
        ]) > 0;
    }
}
?>
