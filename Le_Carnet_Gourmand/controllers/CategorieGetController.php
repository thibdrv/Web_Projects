<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CategorieService.php");

// GET api.php?route=Categorie[&pk_categorie=X] : lecture publique
class CategorieGetController extends AbstractController implements IController
{
    private CategorieService $service;
    private ?int $pkCategorie = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CategorieService();
    }

    protected function checkForm(): void
    {
        $this->alias("pk_categorie", "pk");
    }

    protected function checkCybersec(): void
    {
        if ($this->has("pk_categorie")) {
            $this->pkCategorie = $this->getId("pk_categorie");
        }
    }

    protected function checkRights(): void
    {
        // Lecture libre
    }

    protected function processRequest(): void
    {
        $this->response = $this->pkCategorie !== null
            ? $this->service->findByPk($this->pkCategorie)
            : $this->service->findAll();
    }
}
?>
