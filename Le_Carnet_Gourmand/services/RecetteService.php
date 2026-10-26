<?php

require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/services/AbstractService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/Recette.php");
require_once(ROOT . "/entities/CategorieRecette.php");
require_once(ROOT . "/daos/RecetteDao.php");
require_once(ROOT . "/daos/CategorieDao.php");
require_once(ROOT . "/daos/CategorieRecetteDao.php");
require_once(ROOT . "/utils/Database.php");
require_once(ROOT . "/exceptions/BadRequestException.php");
require_once(ROOT . "/exceptions/ForbiddenException.php");
require_once(ROOT . "/exceptions/NotFoundException.php");
require_once(ROOT . "/exceptions/ConflictException.php");

// Règles de visibilité d'une recette :
//  - approuvée et non supprimée : visible par tous ;
//  - non approuvée : visible uniquement par son auteur et par les administrateurs ;
//  - supprimée : visible par personne (404).
class RecetteService extends AbstractService implements IService
{
    private CategorieDao $categorieDao;
    private CategorieRecetteDao $categorieRecetteDao;

    public function __construct() {
        $this->dao = new RecetteDao();
        $this->categorieDao = new CategorieDao();
        $this->categorieRecetteDao = new CategorieRecetteDao();
    }

    function getDao(): RecetteDao {
        return $this->dao;
    }

    function findAll(): array {
        return $this->search();
    }

    // Liste filtrée. Les recettes non approuvées n'apparaissent que pour un administrateur,
    // ou pour l'auteur qui consulte sa propre liste (filtre fk_compte).
    function search(?int $fkCategorie = null, ?int $fkCompte = null): array {
        if ($fkCategorie !== null && $this->categorieDao->findByPk($fkCategorie) === null) {
            throw new NotFoundException("Catégorie introuvable.");
        }
        $moi = AuthService::currentUser();
        $voitNonApprouvees = AuthService::isAdmin()
            || ($fkCompte !== null && $moi !== null && $moi->getPkCompte() === $fkCompte);

        $recettes = $this->getDao()->search(!$voitNonApprouvees, $fkCategorie, $fkCompte);
        return $this->withCategories($recettes);
    }

    function findByPk(int|array $pk): Recette {
        $recette = $this->getDao()->findByPk($pk);
        if ($recette === null || !$this->isVisible($recette)) {
            throw new NotFoundException("Recette introuvable.");
        }
        return $this->withCategories([$recette])[0];
    }

    // Recette visible ET publiée : nécessaire pour la noter, la commenter ou la mettre en favori
    function findPublished(int $pk): Recette {
        $recette = $this->findByPk($pk);
        if (!$recette->getEstApprouve()) {
            throw new ConflictException("Cette recette n'est pas encore publiée (en attente de validation).");
        }
        return $recette;
    }

    // Recette que l'utilisateur connecté peut modifier : son auteur ou un administrateur
    function findManageable(int $pk): Recette {
        AuthService::requireUser();
        $recette = $this->findByPk($pk);
        if (!AuthService::canManage($recette->getFkCompte())) {
            throw new ForbiddenException("Vous n'avez pas le droit de modifier cette recette.");
        }
        return $recette;
    }

    // Création : la recette est enregistrée en attente de validation, avec au moins une catégorie
    function insert(IEntity $entity, array $pkCategories = []): int {
        /** @var Recette $entity */
        $auteur = AuthService::requireUser();
        $pkCategories = $this->checkCategories($pkCategories);

        $now = new DateTime();
        $entity->setFkCompte($auteur->getPkCompte());
        $entity->setDateCreation($now);
        $entity->setDateModification($now);
        $entity->setEstApprouve(false);
        $entity->setEstSupprime(false);

        // Recette et liaisons dans la même transaction : pas de recette sans catégorie
        $pk = Database::getInstance()->transaction(function () use ($entity, $pkCategories): int {
            $pk = $this->getDao()->insert($entity);
            foreach ($pkCategories as $pkCategorie) {
                $this->categorieRecetteDao->insert(CategorieRecette::create($pk, $pkCategorie));
            }
            return $pk;
        });
        $entity->setPkRecette($pk);
        return $pk;
    }

    // Modification par l'auteur ou un administrateur. $pkCategories : null = catégories inchangées,
    // sinon remplace toutes les catégories. Une recette modifiée par son auteur repasse en
    // validation, pour qu'un contenu approuvé ne puisse pas être changé sans modération.
    function update(IEntity $entity, ?array $pkCategories = null): Recette {
        /** @var Recette $entity */
        $recette = $this->findManageable($entity->getPkRecette());
        if ($pkCategories !== null) {
            $pkCategories = $this->checkCategories($pkCategories);
        }

        $recette->setNom($entity->getNom());
        $recette->setIngredients($entity->getIngredients());
        $recette->setDetails($entity->getDetails());
        $recette->setImage($entity->getImage());
        $recette->setLien($entity->getLien());
        $recette->setDateModification(new DateTime());
        if (!AuthService::isAdmin()) {
            $recette->setEstApprouve(false);
        }

        Database::getInstance()->transaction(function () use ($recette, $pkCategories): void {
            $this->getDao()->update($recette);
            if ($pkCategories !== null) {
                $this->categorieRecetteDao->deleteByRecette($recette->getPkRecette());
                foreach ($pkCategories as $pkCategorie) {
                    $this->categorieRecetteDao->insert(CategorieRecette::create($recette->getPkRecette(), $pkCategorie));
                }
            }
        });
        return $this->findByPk($recette->getPkRecette());
    }

    // Validation (ou retrait de la validation) par un administrateur
    function approve(int $pk, bool $approuve): Recette {
        AuthService::requireAdmin();
        $recette = $this->findByPk($pk);
        $recette->setEstApprouve($approuve);
        $this->getDao()->update($recette);
        return $recette;
    }

    // Suppression logique par l'auteur ou un administrateur
    function delete(int|array $pk): void {
        $recette = $this->findManageable(is_array($pk) ? (int)($pk['pk_recette'] ?? 0) : $pk);
        $this->getDao()->delete($recette->getPkRecette());
    }

    // Ajoute à chaque recette ses catégories (une seule requête pour toute la liste)
    function withCategories(array $recettes): array {
        $pks = array_map(fn(Recette $recette) => $recette->getPkRecette(), $recettes);
        $categories = $this->categorieDao->findByRecettes($pks);
        foreach ($recettes as $recette) {
            $recette->setCategories($categories[$recette->getPkRecette()] ?? []);
        }
        return $recettes;
    }

    function isVisible(Recette $recette): bool {
        if ($recette->getEstSupprime()) {
            return false;
        }
        return $recette->getEstApprouve() || AuthService::canManage($recette->getFkCompte());
    }

    // Au moins une catégorie (association 1,n du MCD), toutes existantes, sans doublon
    private function checkCategories(array $pkCategories): array {
        $pkCategories = array_values(array_unique(array_map('intval', $pkCategories)));
        if (empty($pkCategories)) {
            throw new BadRequestException("Une recette doit avoir au moins une catégorie.");
        }
        foreach ($pkCategories as $pkCategorie) {
            if ($this->categorieDao->findByPk($pkCategorie) === null) {
                throw new NotFoundException("Catégorie $pkCategorie introuvable.");
            }
        }
        return $pkCategories;
    }
}
?>
