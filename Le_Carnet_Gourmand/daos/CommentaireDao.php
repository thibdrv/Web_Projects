<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/daos/AbstractDao.php");
require_once(ROOT . "/entities/Commentaire.php");

class CommentaireDao extends AbstractDao implements IDao
{
    // Commentaire + pseudo de l'auteur (masqué si le compte est supprimé)
    private const SELECT = "SELECT ec.*, CASE WHEN a.est_supprime = 1 THEN NULL ELSE a.pseudo END AS auteur_pseudo
                            FROM ecrire_commentaire ec
                            INNER JOIN comptes a ON a.pk_compte = ec.fk_compte";

    function getTableName(): string {
        return "ecrire_commentaire";
    }

    function getPrimaryKeyName(): array {
        return ["fk_compte", "fk_recette"];
    }

    function createEntityFromRow(object $row): Commentaire {
        return Commentaire::createFromRow($row);
    }

    // Commentaires non supprimés, tous statuts (ou seulement approuvés / en attente)
    function findAll(?bool $estApprouve = null): array {
        $sql = self::SELECT . " WHERE ec.est_supprime = 0";
        $params = [];
        if ($estApprouve !== null) {
            $sql .= " AND ec.est_approuve = :estApprouve";
            $params[":estApprouve"] = $estApprouve;
        }
        $rows = $this->db()->fetchAll($sql . " ORDER BY ec.date_creation DESC", $params);
        return $this->createEntitiesFromRows($rows);
    }

    // Le commentaire du couple (compte, recette), même supprimé ; la ligne active est prioritaire
    function findByPk(int|array $pk): ?Commentaire {
        [$where, $params] = $this->pkCondition($pk, "ec");
        $row = $this->db()->fetchOne(self::SELECT . " WHERE " . $where . " ORDER BY ec.est_supprime ASC LIMIT 1", $params);
        return $row === null ? null : $this->createEntityFromRow($row);
    }

    // Commentaires non supprimés d'une recette.
    // $approuvesSeulement : seulement les approuvés, plus ceux de $fkCompteAuteur (ses commentaires en attente)
    function findByRecette(int $fkRecette, bool $approuvesSeulement, ?int $fkCompteAuteur = null): array {
        $sql = self::SELECT . " WHERE ec.fk_recette = :fkRecette AND ec.est_supprime = 0";
        $params = [":fkRecette" => $fkRecette];
        if ($approuvesSeulement) {
            $sql .= " AND (ec.est_approuve = 1 OR ec.fk_compte = :fkCompteAuteur)";
            $params[":fkCompteAuteur"] = $fkCompteAuteur ?? 0;
        }
        $rows = $this->db()->fetchAll($sql . " ORDER BY ec.date_creation DESC", $params);
        return $this->createEntitiesFromRows($rows);
    }

    // La table n'a pas de clé primaire en BDD : renvoie le nombre de lignes insérées
    function insert(IEntity $entity): int {
        $this->checkEntity($entity, Commentaire::class);
        /** @var Commentaire $entity */
        return $this->db()->execute(
            "INSERT INTO ecrire_commentaire (fk_compte, fk_recette, contenu, date_creation, est_approuve, est_supprime)
             VALUES (:fkCompte, :fkRecette, :contenu, :dCreation, :estApprouve, :estSupprime)",
            [
                ":fkCompte" => $entity->getFkCompte(),
                ":fkRecette" => $entity->getFkRecette(),
                ":contenu" => $entity->getContenu(),
                ":dCreation" => $entity->getDateCreation(),
                ":estApprouve" => $entity->getEstApprouve(),
                ":estSupprime" => $entity->getEstSupprime(),
            ]
        );
    }

    function update(IEntity $entity): bool {
        $this->checkEntity($entity, Commentaire::class);
        /** @var Commentaire $entity */
        return $this->db()->execute(
            "UPDATE ecrire_commentaire SET
                contenu = :contenu,
                date_creation = :dCreation,
                est_approuve = :estApprouve,
                est_supprime = :estSupprime
             WHERE fk_compte = :fkCompte AND fk_recette = :fkRecette",
            [
                ":contenu" => $entity->getContenu(),
                ":dCreation" => $entity->getDateCreation(),
                ":estApprouve" => $entity->getEstApprouve(),
                ":estSupprime" => $entity->getEstSupprime(),
                ":fkCompte" => $entity->getFkCompte(),
                ":fkRecette" => $entity->getFkRecette(),
            ]
        ) > 0;
    }

    // Suppression logique
    function delete(int|array $pk): bool {
        [$where, $params] = $this->pkCondition($pk);
        return $this->db()->execute(
            "UPDATE ecrire_commentaire SET est_supprime = 1 WHERE " . $where . " AND est_supprime = 0",
            $params
        ) > 0;
    }
}
?>
