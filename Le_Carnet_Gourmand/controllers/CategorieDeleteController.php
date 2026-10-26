<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CategorieService.php");
require_once(ROOT . "/services/AuthService.php");

// DELETE api.php?route=Categorie&pk_categorie=X : administrateurs seulement,
// refusé (409) tant que des recettes utilisent la catégorie
class CategorieDeleteController extends AbstractController implements IController
{
    private CategorieService $service;
    private int $pkCategorie;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CategorieService();
    }

    protected function checkForm(): void
    {
        $this->alias("pk_categorie", "pk");
        $this->requireParams("pk_categorie");
    }

    protected function checkCybersec(): void
    {
        $this->pkCategorie = $this->getId("pk_categorie");
    }

    protected function checkRights(): void
    {
        AuthService::requireAdmin();
    }

    protected function processRequest(): void
    {
        $this->service->delete($this->pkCategorie);
        $this->response = ["pk_categorie" => $this->pkCategorie];
    }
}
?>
