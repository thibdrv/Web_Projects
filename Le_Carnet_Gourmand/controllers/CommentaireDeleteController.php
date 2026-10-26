<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CommentaireService.php");
require_once(ROOT . "/services/AuthService.php");

// DELETE api.php?route=Commentaire&fk_recette=X[&fk_compte=Y] : suppression logique.
// Sans fk_compte : son propre commentaire ; avec fk_compte : celui d'un autre (administrateurs).
class CommentaireDeleteController extends AbstractController implements IController
{
    private CommentaireService $service;
    private int $fkRecette;
    private ?int $fkCompte = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CommentaireService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("fk_recette");
    }

    protected function checkCybersec(): void
    {
        $this->fkRecette = $this->getId("fk_recette");
        if ($this->has("fk_compte")) {
            $this->fkCompte = $this->getId("fk_compte");
        }
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $pk = [
            'fk_compte' => $this->fkCompte ?? AuthService::requireUser()->getPkCompte(),
            'fk_recette' => $this->fkRecette,
        ];
        $this->service->delete($pk);
        $this->response = $pk;
    }
}
?>
