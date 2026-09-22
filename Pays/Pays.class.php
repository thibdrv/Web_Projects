<?php
class Pays {
    private $nom;
    private $population;

    public function __construct($nom, $population) {
        $this->nom = strtoupper(trim($nom));
        $this->population = floatval($population);
    }

    public function getNom() {
        return $this->nom;
    }

    public function getPopulation() {
        return $this->population;
    }
}