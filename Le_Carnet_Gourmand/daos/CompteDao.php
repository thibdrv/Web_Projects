<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/daos/AbstractDao.php");
require_once(ROOT . "/entities/Compte.php");

class CompteDao extends AbstractDao implements IDao
{
    // Compte + nom de son rôle
    private const SELECT = "SELECT c.*, r.nom AS role_nom
                            FROM comptes c
                            INNER JOIN roles r ON r.pk_role = c.fk_role";

    function getTableName(): string {
        return "comptes";
    }

    function getPrimaryKeyName(): string {
        return "pk_compte";
    }

    function createEntityFromRow(object $row): Compte {
        return Compte::createFromRow($row);
    }

    // Tous les comptes, y compris bannis et supprimés (liste d'administration)
    function findAll(): array {
        $rows = $this->db()->fetchAll(self::SELECT . " ORDER BY c.pk_compte");
        return $this->createEntitiesFromRows($rows);
    }

    // Le compte est renvoyé quel que soit son état (banni, supprimé) : c'est au service de décider
    function findByPk(int|array $pk): ?Compte {
        [$where, $params] = $this->pkCondition($pk, "c");
        $row = $this->db()->fetchOne(self::SELECT . " WHERE " . $where . " LIMIT 1", $params);
        return $row === null ? null : $this->createEntityFromRow($row);
    }

    // Comparaison insensible à la casse (collation utf8mb4_unicode_520_ci)
    function findByEmail(string $email): ?Compte {
        $row = $this->db()->fetchOne(self::SELECT . " WHERE c.email = :email ORDER BY c.pk_compte LIMIT 1", [
            ":email" => $email,
        ]);
        return $row === null ? null : $this->createEntityFromRow($row);
    }

    function findByPseudo(string $pseudo): ?Compte {
        $row = $this->db()->fetchOne(self::SELECT . " WHERE c.pseudo = :pseudo ORDER BY c.pk_compte LIMIT 1", [
            ":pseudo" => $pseudo,
        ]);
        return $row === null ? null : $this->createEntityFromRow($row);
    }

    // mot_de_passe doit déjà contenir le hash (le service s'en charge)
    function insert(IEntity $entity): int {
        $this->checkEntity($entity, Compte::class);
        /** @var Compte $entity */
        return $this->db()->insert(
            "INSERT INTO comptes (email, pseudo, mot_de_passe, date_creation, est_banni, est_supprime, fk_role)
             VALUES (:email, :pseudo, :mdp, :dCreation, :estBanni, :estSupprime, :fkRole)",
            [
                ":email" => $entity->getEmail(),
                ":pseudo" => $entity->getPseudo(),
                ":mdp" => $entity->getMotDePasse(),
                ":dCreation" => $entity->getDateCreation(),
                ":estBanni" => $entity->getEstBanni(),
                ":estSupprime" => $entity->getEstSupprime(),
                ":fkRole" => $entity->getFkRole(),
            ]
        );
    }

    function update(IEntity $entity): bool {
        $this->checkEntity($entity, Compte::class);
        /** @var Compte $entity */
        return $this->db()->execute(
            "UPDATE comptes SET
                email = :email,
                pseudo = :pseudo,
                mot_de_passe = :mdp,
                est_banni = :estBanni,
                est_supprime = :estSupprime,
                fk_role = :fkRole
             WHERE pk_compte = :pkCompte",
            [
                ":email" => $entity->getEmail(),
                ":pseudo" => $entity->getPseudo(),
                ":mdp" => $entity->getMotDePasse(),
                ":estBanni" => $entity->getEstBanni(),
                ":estSupprime" => $entity->getEstSupprime(),
                ":fkRole" => $entity->getFkRole(),
                ":pkCompte" => $entity->getPkCompte(),
            ]
        ) > 0;
    }

    // Suppression logique : le compte et ses contenus restent en base
    function delete(int|array $pk): bool {
        [$where, $params] = $this->pkCondition($pk);
        return $this->db()->execute("UPDATE comptes SET est_supprime = 1 WHERE " . $where, $params) > 0;
    }
}
?>
