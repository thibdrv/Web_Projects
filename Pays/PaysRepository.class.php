<?php
require_once 'Pays.class.php';
require_once 'PaysException.class.php';

class PaysRepository {
    private $pdo;
    private $paysInterdits = ['US'];

    public function __construct() {
        $dsn = "mysql:host=localhost;dbname=paysdb;charset=utf8mb4";
        $username = "root";
        $password = "";

        try {
            $this->pdo = new PDO($dsn, $username, $password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Erreur de connexion : " . $e->getMessage());
        }
    }

    public function inserer($pays) {
        $nom = $pays->getNom();

        if (in_array($nom, $this->paysInterdits)) {
            throw new PaysException("Pays $nom non autorisé", "orange");
        }

        if ($this->existe($nom)) {
            throw new PaysException("Pays $nom déjà inséré", "rouge");
        }

        $stmt = $this->pdo->prepare("INSERT INTO pays (nom, population) VALUES (:nom, :population)");
        $stmt->execute([
            ':nom' => $nom,
            ':population' => $pays->getPopulation()
        ]);
    }

    private function existe($nom) {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM pays WHERE nom = :nom");
        $stmt->execute([':nom' => $nom]);
        return $stmt->fetchColumn() > 0;
    }
}