<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/entities/CategorieRecette.php");
require_once(ROOT . "/services/CategorieRecetteService.php");
require_once(ROOT . "/services/AuthService.php");

// POST api.php?route=CategorieRecette {"fk_recette", "fk_categorie"} : auteur de la recette ou administrateur
class CategorieRecettePostController extends AbstractController implements IController
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
        $liaison = CategorieRecette::create($this->fkRecette, $this->fkCategorie);
        $this->service->insert($liaison);

        $this->statusCode = 201;
        $this->response = $this->service->findByPk($liaison->getPk());
    }
}
?>
