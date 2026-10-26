<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");

// 404 : la ressource n'existe pas ou n'est pas visible pour l'utilisateur.
class NotFoundException extends HttpStatusException
{
    public function __construct(string $message = "Ressource introuvable.", ?Throwable $previous = null)
    {
        parent::__construct($message, 404, $previous);
    }
}
?>
