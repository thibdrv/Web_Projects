<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/FavoriService.php");
require_once(ROOT . "/services/AuthService.php");

// GET api.php?route=Favori                → favoris du compte connecté (avec les recettes)
// GET api.php?route=Favori&fk_recette=X   → {"fk_recette": X, "est_favori": bool}
class FavoriGetController extends AbstractController implements IController
{
    private FavoriService $service;
    private ?int $fkRecette = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new FavoriService();
    }

    protected function checkForm(): void
    {
        // ancien nom de paramètre encore utilisé par le frontend
        $this->alias("fk_recette", "pk_recette");
    }

    protected function checkCybersec(): void
    {
        if ($this->has("fk_recette")) {
            $this->fkRecette = $this->getId("fk_recette");
        }
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        if ($this->fkRecette !== null) {
            $this->response = [
                "fk_recette" => $this->fkRecette,
                "est_favori" => $this->service->estFavori($this->fkRecette),
            ];
            return;
        }
        $this->response = $this->service->findMine();
    }
}
?>
