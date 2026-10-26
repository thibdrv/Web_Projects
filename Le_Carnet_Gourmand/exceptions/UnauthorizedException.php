<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");

// 401 : l'action demande d'être connecté.
class UnauthorizedException extends HttpStatusException
{
    public function __construct(string $message = "Vous devez être connecté.", ?Throwable $previous = null)
    {
        parent::__construct($message, 401, $previous);
    }
}
?>
