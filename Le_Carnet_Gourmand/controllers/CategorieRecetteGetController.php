<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CategorieRecetteService.php");

// GET api.php?route=CategorieRecette&fk_recette=X  → catégories d'une recette
// GET api.php?route=CategorieRecette&fk_categorie=Y → recettes d'une catégorie
// Lecture publique (seules les recettes visibles par l'utilisateur sont renvoyées)
class CategorieRecetteGetController extends AbstractController implements IController
{
    private CategorieRecetteService $service;
    private ?int $fkRecette = null;
    private ?int $fkCategorie = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CategorieRecetteService();
    }

    protected function checkForm(): void
    {
        $this->requireOneOf("fk_recette", "fk_categorie");
    }

    protected function checkCybersec(): void
    {
        if ($this->has("fk_recette")) {
            $this->fkRecette = $this->getId("fk_recette");
        }
        if ($this->has("fk_categorie")) {
            $this->fkCategorie = $this->getId("fk_categorie");
        }
    }

    protected function checkRights(): void
    {
        // Lecture publique
    }

    protected function processRequest(): void
    {
        if ($this->fkRecette !== null && $this->fkCategorie !== null) {
            $this->response = $this->service->findByPk(['fk_recette' => $this->fkRecette, 'fk_categorie' => $this->fkCategorie]);
        } elseif ($this->fkRecette !== null) {
            $this->response = $this->service->findByRecette($this->fkRecette);
        } else {
            $this->response = $this->service->findByCategorie($this->fkCategorie);
        }
    }
}
?>
