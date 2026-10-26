<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/RecetteService.php");

// GET api.php?route=Recette&pk_recette=X                 → une recette
// GET api.php?route=Recette[&fk_categorie=Y][&fk_compte=Z] → liste filtrée
// Lecture publique : les recettes non approuvées ne sont visibles que par leur auteur et les administrateurs
class RecetteGetController extends AbstractController implements IController
{
    private RecetteService $service;
    private ?int $pkRecette = null;
    private ?int $fkCategorie = null;
    private ?int $fkCompte = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new RecetteService();
    }

    protected function checkForm(): void
    {
        // anciens noms de paramètres encore utilisés par le frontend
        $this->alias("pk_recette", "pk");
        $this->alias("fk_categorie", "categories");
    }

    protected function checkCybersec(): void
    {
        if ($this->has("pk_recette")) {
            $this->pkRecette = $this->getId("pk_recette");
        }
        if ($this->has("fk_categorie")) {
            $this->fkCategorie = $this->getId("fk_categorie");
        }
        if ($this->has("fk_compte")) {
            $this->fkCompte = $this->getId("fk_compte");
        }
    }

    protected function checkRights(): void
    {
        // Lecture publique
    }

    protected function processRequest(): void
    {
        $this->response = $this->pkRecette !== null
            ? $this->service->findByPk($this->pkRecette)
            : $this->service->search($this->fkCategorie, $this->fkCompte);
    }
}
?>
