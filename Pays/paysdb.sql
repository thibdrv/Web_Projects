-- Création de la base de données
CREATE DATABASE IF NOT EXISTS paysdb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Utilisation de la base
USE paysdb;

-- Création de la table `pays`
CREATE TABLE IF NOT EXISTS pays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    population FLOAT NOT NULL
);
