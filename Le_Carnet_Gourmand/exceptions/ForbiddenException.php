<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");

// 403 : l'utilisateur est connecté mais n'a pas le droit d'effectuer l'action.
class ForbiddenException extends HttpStatusException
{
    public function __construct(string $message = "Action non autorisée.", ?Throwable $previous = null)
    {
        parent::__construct($message, 403, $previous);
    }
}
?>
