<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/entities/Favori.php");
require_once(ROOT . "/services/FavoriService.php");
require_once(ROOT . "/services/AuthService.php");

// POST api.php?route=Favori {"fk_recette"} : ajoute une recette publiée aux favoris du compte connecté
class FavoriPostController extends AbstractController implements IController
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
        $favori = Favori::create(null, $this->fkRecette); // le compte est fixé par le service
        $this->service->insert($favori);

        $this->statusCode = 201;
        $this->response = ["fk_recette" => $this->fkRecette, "est_favori" => true];
    }
}
?>
