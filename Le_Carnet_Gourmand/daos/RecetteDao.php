<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/daos/AbstractDao.php");
require_once(ROOT . "/entities/Recette.php");

class RecetteDao extends AbstractDao implements IDao
{
    // Recette + pseudo de l'auteur en une seule requête (le pseudo d'un compte supprimé est masqué)
    public const SELECT = "SELECT r.*, CASE WHEN a.est_supprime = 1 THEN NULL ELSE a.pseudo END AS auteur_pseudo
                           FROM recettes r
                           INNER JOIN comptes a ON a.pk_compte = r.fk_compte";

    function getTableName(): string {
        return "recettes";
    }

    function getPrimaryKeyName(): string {
        return "pk_recette";
    }

    function createEntityFromRow(object $row): Recette {
        return Recette::createFromRow($row);
    }

    // Toutes les recettes non supprimées, approuvées ou non
    function findAll(): array {
        return $this->search(false);
    }

    // Renvoie aussi les recettes supprimées ou non approuvées : le service filtre
    function findByPk(int|array $pk): ?Recette {
        [$where, $params] = $this->pkCondition($pk, "r");
        $row = $this->db()->fetchOne(self::SELECT . " WHERE " . $where . " LIMIT 1", $params);
        return $row === null ? null : $this->createEntityFromRow($row);
    }

    // Recettes non supprimées, avec filtres facultatifs
    function search(bool $approuveesSeulement, ?int $fkCategorie = null, ?int $fkCompte = null): array {
        $sql = self::SELECT . " WHERE r.est_supprime = 0";
        $params = [];
        if ($approuveesSeulement) {
            $sql .= " AND r.est_approuve = 1";
        }
        if ($fkCategorie !== null) {
            // EXISTS plutôt qu'une jointure : pas de doublon si la liaison existe deux fois
            $sql .= " AND EXISTS (SELECT 1 FROM categories_recettes cr
                                  WHERE cr.fk_recette = r.pk_recette AND cr.fk_categorie = :fkCategorie)";
            $params[":fkCategorie"] = $fkCategorie;
        }
        if ($fkCompte !== null) {
            $sql .= " AND r.fk_compte = :fkCompte";
            $params[":fkCompte"] = $fkCompte;
        }
        $rows = $this->db()->fetchAll($sql . " ORDER BY r.date_creation DESC, r.pk_recette DESC", $params);
        return $this->createEntitiesFromRows($rows);
    }

    function insert(IEntity $entity): int {
        $this->checkEntity($entity, Recette::class);
        /** @var Recette $entity */
        return $this->db()->insert(
            "INSERT INTO recettes (nom, ingredients, details, date_creation, date_modification,
                                   est_approuve, est_supprime, image, lien, fk_compte)
             VALUES (:nom, :ingredients, :details, :dCreation, :dModif,
                     :estApprouve, :estSupprime, :image, :lien, :fkCompte)",
            [
                ":nom" => $entity->getNom(),
                ":ingredients" => $entity->getIngredients(),
                ":details" => $entity->getDetails(),
                ":dCreation" => $entity->getDateCreation(),
                ":dModif" => $entity->getDateModification(),
                ":estApprouve" => $entity->getEstApprouve(),
                ":estSupprime" => $entity->getEstSupprime(),
                ":image" => $entity->getImage(),
                ":lien" => $entity->getLien(),
                ":fkCompte" => $entity->getFkCompte(),
            ]
        );
    }

    function update(IEntity $entity): bool {
        $this->checkEntity($entity, Recette::class);
        /** @var Recette $entity */
        return $this->db()->execute(
            "UPDATE recettes SET
                nom = :nom,
                ingredients = :ingredients,
                details = :details,
                date_modification = :dModif,
                est_approuve = :estApprouve,
                est_supprime = :estSupprime,
                image = :image,
                lien = :lien
             WHERE pk_recette = :pkRecette",
            [
                ":nom" => $entity->getNom(),
                ":ingredients" => $entity->getIngredients(),
                ":details" => $entity->getDetails(),
                ":dModif" => $entity->getDateModification(),
                ":estApprouve" => $entity->getEstApprouve(),
                ":estSupprime" => $entity->getEstSupprime(),
                ":image" => $entity->getImage(),
                ":lien" => $entity->getLien(),
                ":pkRecette" => $entity->getPkRecette(),
            ]
        ) > 0;
    }

    // Suppression logique : les notes, favoris et commentaires restent liés en base
    function delete(int|array $pk): bool {
        [$where, $params] = $this->pkCondition($pk);
        $params[":dModif"] = new DateTime();
        return $this->db()->execute(
            "UPDATE recettes SET est_supprime = 1, date_modification = :dModif WHERE " . $where . " AND est_supprime = 0",
            $params
        ) > 0;
    }
}
?>
