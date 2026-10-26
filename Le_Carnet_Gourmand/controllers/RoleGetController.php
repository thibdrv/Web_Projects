<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/RoleService.php");
require_once(ROOT . "/services/AuthService.php");

// GET api.php?route=Role[&pk_role=X] : administrateurs seulement
class RoleGetController extends AbstractController implements IController
{
    private RoleService $service;
    private ?int $pkRole = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new RoleService();
    }

    protected function checkForm(): void
    {
        $this->alias("pk_role", "pk");
    }

    protected function checkCybersec(): void
    {
        if ($this->has("pk_role")) {
            $this->pkRole = $this->getId("pk_role");
        }
    }

    protected function checkRights(): void
    {
        AuthService::requireAdmin();
    }

    protected function processRequest(): void
    {
        $this->response = $this->pkRole !== null
            ? $this->service->findByPk($this->pkRole)
            : $this->service->findAll();
    }
}
?>
