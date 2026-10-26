<?php

require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/services/AbstractService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/services/RecetteService.php");
require_once(ROOT . "/services/CategorieService.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/CategorieRecette.php");
require_once(ROOT . "/daos/CategorieRecetteDao.php");
require_once(ROOT . "/exceptions/ConflictException.php");
require_once(ROOT . "/exceptions/MethodNotAllowedException.php");
require_once(ROOT . "/exceptions/NotFoundException.php");

class CategorieRecetteService extends AbstractService implements IService
{
    private RecetteService $recetteService;
    private CategorieService $categorieService;

    public function __construct() {
        $this->dao = new CategorieRecetteDao();
        $this->recetteService = new RecetteService();
        $this->categorieService = new CategorieService();
    }

    function getDao(): CategorieRecetteDao {
        return $this->dao;
    }

    function findByPk(int|array $pk): CategorieRecette {
        $liaison = $this->findOrFail($pk, "Cette recette n'appartient pas à cette catégorie.");
        // la recette doit être visible par l'utilisateur
        $this->recetteService->findByPk($liaison->getFkRecette());
        return $liaison;
    }

    // Catégories d'une recette visible
    function findByRecette(int $fkRecette): array {
        $this->recetteService->findByPk($fkRecette);
        return $this->getDao()->findByRecette($fkRecette);
    }

    // Recettes d'une catégorie (les non approuvées seulement pour un administrateur)
    function findByCategorie(int $fkCategorie): array {
        $this->categorieService->findByPk($fkCategorie);
        return $this->getDao()->findByCategorie($fkCategorie, !AuthService::isAdmin());
    }

    // Ajout d'une catégorie à une recette par son auteur ou un administrateur
    function insert(IEntity $entity): int {
        /** @var CategorieRecette $entity */
        $this->recetteService->findManageable($entity->getFkRecette());
        $this->categorieService->findByPk($entity->getFkCategorie());

        if ($this->getDao()->findByPk($entity->getPk()) !== null) {
            throw new ConflictException("Cette recette appartient déjà à cette catégorie.");
        }
        return $this->getDao()->insert($entity);
    }

    function update(IEntity $entity): IEntity {
        throw new MethodNotAllowedException("Une liaison catégorie/recette ne se modifie pas : supprimez-la puis recréez-la.");
    }

    // Retrait d'une catégorie : une recette doit en garder au moins une
    function delete(int|array $pk): void {
        $liaison = $this->getDao()->findByPk($pk);
        if ($liaison === null) {
            throw new NotFoundException("Cette recette n'appartient pas à cette catégorie.");
        }
        $this->recetteService->findManageable($liaison->getFkRecette());

        if ($this->getDao()->countByRecette($liaison->getFkRecette()) <= 1) {
            throw new ConflictException("Une recette doit garder au moins une catégorie.");
        }
        $this->getDao()->delete($liaison->getPk());
    }
}
?>
