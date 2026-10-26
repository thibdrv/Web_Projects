<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/RecetteService.php");
require_once(ROOT . "/services/AuthService.php");

// DELETE api.php?route=Recette&pk_recette=X : suppression logique (auteur ou administrateur)
class RecetteDeleteController extends AbstractController implements IController
{
    private RecetteService $service;
    private int $pkRecette;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new RecetteService();
    }

    protected function checkForm(): void
    {
        $this->alias("pk_recette", "pk");
        $this->requireParams("pk_recette");
    }

    protected function checkCybersec(): void
    {
        $this->pkRecette = $this->getId("pk_recette");
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $this->service->delete($this->pkRecette);
        $this->response = ["pk_recette" => $this->pkRecette];
    }
}
?>
