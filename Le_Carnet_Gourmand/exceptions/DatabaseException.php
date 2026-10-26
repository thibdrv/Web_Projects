<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");

// 503 : la base de données est injoignable (connexion PDO impossible).
class DatabaseException extends HttpStatusException
{
    public function __construct(string $message = "Base de données indisponible.", ?Throwable $previous = null)
    {
        parent::__construct($message, 503, $previous);
    }
}
?>
