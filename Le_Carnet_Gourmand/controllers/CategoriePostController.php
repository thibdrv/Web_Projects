<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/entities/Categorie.php");
require_once(ROOT . "/services/CategorieService.php");
require_once(ROOT . "/services/AuthService.php");

// POST api.php?route=Categorie {"nom"} : administrateurs seulement
class CategoriePostController extends AbstractController implements IController
{
    private CategorieService $service;
    private string $nom;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CategorieService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("nom");
    }

    protected function checkCybersec(): void
    {
        // Le texte est enregistré tel quel : c'est à l'affichage qu'il doit être échappé
        $this->nom = $this->getString("nom", 2, 75);
    }

    protected function checkRights(): void
    {
        AuthService::requireAdmin();
    }

    protected function processRequest(): void
    {
        $categorie = Categorie::create($this->nom);
        $this->service->insert($categorie);

        $this->statusCode = 201;
        $this->response = $categorie;
    }
}
?>
