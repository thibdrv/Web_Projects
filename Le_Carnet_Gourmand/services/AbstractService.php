<?php

require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/exceptions/NotFoundException.php");

abstract class AbstractService implements IService
{
    // Initialisé par le constructeur de chaque service
    protected IDao $dao;

    function getDao(): IDao {
        return $this->dao;
    }

    function findByPk(int|array $pk): IEntity {
        return $this->findOrFail($pk, "Ressource introuvable.");
    }

    function findAll(): array {
        return $this->getDao()->findAll();
    }

    // Le DAO renvoie null quand la ligne n'existe pas : le service le traduit en 404
    protected function findOrFail(int|array $pk, string $message): IEntity {
        $entity = $this->getDao()->findByPk($pk);
        if ($entity === null) {
            throw new NotFoundException($message);
        }
        return $entity;
    }
}
?>
