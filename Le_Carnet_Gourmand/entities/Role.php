<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/AbstractEntity.php");

// Table `roles`
class Role extends AbstractEntity implements IEntity
{
    // Valeurs de roles.pk_role présentes dans BDD/bgetest_lcg.sql
    public const UTILISATEUR = 1;
    public const ADMIN = 2;

    private ?int $pk_role = null;
    private string $nom = "";

    public function getPkRole(): ?int {
        return $this->pk_role;
    }
    public function setPkRole(?int $pk_role): void {
        $this->pk_role = $pk_role;
    }

    public function getNom(): string {
        return $this->nom;
    }
    public function setNom(string $nom): void {
        $this->nom = $nom;
    }

    // Role::createFromRow($row) (lecture BDD)
    public static function createFromRow(object $row): Role {
        $role = new Role();
        $role->setPkRole((int)$row->pk_role);
        $role->setNom($row->nom);
        return $role;
    }

    // Role::create(...)
    public static function create(string $nom): Role {
        $role = new Role();
        $role->setNom($nom);
        return $role;
    }
}
?>
