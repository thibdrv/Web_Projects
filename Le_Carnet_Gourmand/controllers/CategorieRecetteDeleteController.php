<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CategorieRecetteService.php");
require_once(ROOT . "/services/AuthService.php");

// DELETE api.php?route=CategorieRecette&fk_recette=X&fk_categorie=Y : auteur de la recette ou administrateur
class CategorieRecetteDeleteController extends AbstractController implements IController
{
    private CategorieRecetteService $service;
    private int $fkRecette;
    private int $fkCategorie;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CategorieRecetteService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("fk_recette", "fk_categorie");
    }

    protected function checkCybersec(): void
    {
        $this->fkRecette = $this->getId("fk_recette");
        $this->fkCategorie = $this->getId("fk_categorie");
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $pk = ['fk_recette' => $this->fkRecette, 'fk_categorie' => $this->fkCategorie];
        $this->service->delete($pk);
        $this->response = $pk;
    }
}
?>
