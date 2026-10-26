<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");

// 405 : la route existe mais pas pour cette méthode HTTP.
class MethodNotAllowedException extends HttpStatusException
{
    public function __construct(string $message = "Méthode non autorisée.", ?Throwable $previous = null)
    {
        parent::__construct($message, 405, $previous);
    }
}
?>
