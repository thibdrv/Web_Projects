<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CommentaireService.php");
require_once(ROOT . "/services/AuthService.php");

// GET api.php?route=Commentaire&fk_recette=X     → commentaires approuvés d'une recette
//                                                   (+ ceux en attente du compte connecté ; tout pour un admin)
// GET api.php?route=Commentaire[&est_approuve=0]  → liste de modération (administrateurs seulement)
class CommentaireGetController extends AbstractController implements IController
{
    private CommentaireService $service;
    private ?int $fkRecette = null;
    private ?bool $estApprouve = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CommentaireService();
    }

    protected function checkForm(): void {}

    protected function checkCybersec(): void
    {
        if ($this->has("fk_recette")) {
            $this->fkRecette = $this->getId("fk_recette");
        }
        if ($this->has("est_approuve")) {
            $this->estApprouve = $this->getBool("est_approuve");
        }
    }

    protected function checkRights(): void
    {
        if ($this->fkRecette === null) {
            AuthService::requireAdmin();
        }
    }

    protected function processRequest(): void
    {
        $this->response = $this->fkRecette !== null
            ? $this->service->findByRecette($this->fkRecette)
            : $this->service->findAll($this->estApprouve);
    }
}
?>
