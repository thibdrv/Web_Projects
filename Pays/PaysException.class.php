<?php
class PaysException extends Exception {
    private $niveau;

    public function __construct($message, $niveau = 'rouge') {
        parent::__construct($message);
        $this->niveau = $niveau;
    }

    public function getNiveau() {
        return $this->niveau;
    }
}