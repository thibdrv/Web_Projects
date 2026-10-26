<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CategorieService.php");
require_once(ROOT . "/services/AuthService.php");

// PUT api.php?route=Categorie {"pk_categorie", "nom"} : renommage, administrateurs seulement
class CategoriePutController extends AbstractController implements IController
{
    private CategorieService $service;
    private int $pkCategorie;
    private string $nom;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CategorieService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("pk_categorie", "nom");
    }

    protected function checkCybersec(): void
    {
        $this->pkCategorie = $this->getId("pk_categorie");
        $this->nom = $this->getString("nom", 2, 75);
    }

    protected function checkRights(): void
    {
        AuthService::requireAdmin();
    }

    protected function processRequest(): void
    {
        $categorie = $this->service->findByPk($this->pkCategorie);
        $categorie->setNom($this->nom);
        $this->response = $this->service->update($categorie);
    }
}
?>
