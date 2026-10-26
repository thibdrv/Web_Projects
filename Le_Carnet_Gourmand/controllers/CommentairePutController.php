<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/controllers/CommentairePostController.php");
require_once(ROOT . "/services/CommentaireService.php");
require_once(ROOT . "/services/AuthService.php");

// PUT api.php?route=Commentaire, deux usages :
//  - l'auteur modifie son texte : {"fk_recette", "contenu"} (le commentaire repasse en validation)
//  - un administrateur modère :  {"fk_recette", "fk_compte", "est_approuve": true|false}
// Sans "fk_compte", le commentaire visé est celui du compte connecté.
class CommentairePutController extends AbstractController implements IController
{
    private CommentaireService $service;
    private int $fkRecette;
    private ?int $fkCompte = null;
    private ?string $contenu = null;
    private ?bool $estApprouve = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CommentaireService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("fk_recette");
        $this->requireOneOf("contenu", "est_approuve");
    }

    protected function checkCybersec(): void
    {
        $this->fkRecette = $this->getId("fk_recette");
        if ($this->has("fk_compte")) {
            $this->fkCompte = $this->getId("fk_compte");
        }
        if ($this->has("contenu")) {
            $this->contenu = $this->getString("contenu", 2, CommentairePostController::CONTENU_MAX);
        }
        if ($this->has("est_approuve")) {
            $this->estApprouve = $this->getBool("est_approuve");
        }
    }

    protected function checkRights(): void
    {
        // Auteur (contenu) ou administrateur (est_approuve) : vérifié par le service
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $fkCompte = $this->fkCompte ?? AuthService::requireUser()->getPkCompte();

        // On part du commentaire actuel et on applique uniquement les champs envoyés
        $commentaire = $this->service->findByPk(['fk_compte' => $fkCompte, 'fk_recette' => $this->fkRecette]);
        if ($this->contenu !== null) {
            $commentaire->setContenu($this->contenu);
        }
        if ($this->estApprouve !== null) {
            $commentaire->setEstApprouve($this->estApprouve);
        }

        $this->response = $this->service->update($commentaire);
    }
}
?>
