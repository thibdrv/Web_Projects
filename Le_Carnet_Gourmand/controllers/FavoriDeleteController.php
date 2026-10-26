<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/FavoriService.php");
require_once(ROOT . "/services/AuthService.php");

// DELETE api.php?route=Favori&fk_recette=X : retire la recette des favoris du compte connecté
class FavoriDeleteController extends AbstractController implements IController
{
    private FavoriService $service;
    private int $fkRecette;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new FavoriService();
    }

    protected function checkForm(): void
    {
        $this->alias("fk_recette", "pk_recette");
        $this->requireParams("fk_recette");
    }

    protected function checkCybersec(): void
    {
        $this->fkRecette = $this->getId("fk_recette");
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $this->service->delete($this->fkRecette);
        $this->response = ["fk_recette" => $this->fkRecette, "est_favori" => false];
    }
}
?>
