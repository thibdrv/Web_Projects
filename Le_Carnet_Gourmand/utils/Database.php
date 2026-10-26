<?php

require_once(ROOT . "/exceptions/DatabaseException.php");

// Connexion PDO unique (design pattern Singleton) et exécution des requêtes préparées.
// Les DAOs passent exclusivement par cette classe pour parler à la base :
// chaque valeur est liée par bindValue(), jamais concaténée dans le SQL.
class Database
{
    // Format DATETIME de MySQL (H = heure sur 24 h, i = minutes)
    public const DATE_FORMAT = "Y-m-d H:i:s";

    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct()
    {
        $config = self::loadConfig();
        $dsn = sprintf(
            "mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4",
            $config['host'],
            (int)$config['port'],
            $config['name']
        );

        try {
            $this->pdo = new PDO($dsn, $config['user'], $config['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                PDO::ATTR_EMULATE_PREPARES => false,
                // rowCount() compte les lignes trouvées, même si un UPDATE ne change aucune valeur
                PDO::MYSQL_ATTR_FOUND_ROWS => true,
            ]);
        } catch (PDOException $e) {
            error_log("Connexion BDD impossible : " . $e->getMessage());
            throw new DatabaseException("Base de données indisponible.", $e);
        }
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getPdo(): PDO
    {
        return $this->pdo;
    }

    // Configuration : valeurs par défaut (XAMPP local), surchargées par utils/config.php
    // puis par les variables d'environnement DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS.
    private static function loadConfig(): array
    {
        $config = [
            'host' => '',
            'port' => ,
            'name' => '',
            'user' => '',
            'pass' => '',
        ];

        $file = ROOT . "/utils/config.php";
        if (is_file($file)) {
            $config = array_merge($config, require $file);
        }

        $env = ['host' => 'DB_HOST', 'port' => 'DB_PORT', 'name' => 'DB_NAME', 'user' => 'DB_USER', 'pass' => 'DB_PASS'];
        foreach ($env as $key => $variable) {
            $value = getenv($variable);
            if ($value !== false) {
                $config[$key] = $value;
            }
        }
        return $config;
    }

    // Première ligne du résultat, ou null si aucune
    public function fetchOne(string $sql, array $params = []): ?object
    {
        $row = $this->run($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    public function fetchAll(string $sql, array $params = []): array
    {
        return $this->run($sql, $params)->fetchAll();
    }

    // Première colonne de la première ligne (COUNT, AVG...), ou null si aucune ligne
    public function fetchValue(string $sql, array $params = []): mixed
    {
        $value = $this->run($sql, $params)->fetchColumn();
        return $value === false ? null : $value;
    }

    // UPDATE / DELETE : renvoie le nombre de lignes concernées
    public function execute(string $sql, array $params = []): int
    {
        return $this->run($sql, $params)->rowCount();
    }

    // INSERT : renvoie l'identifiant AUTO_INCREMENT généré (0 pour une table sans auto-incrément)
    public function insert(string $sql, array $params = []): int
    {
        $this->run($sql, $params);
        return (int)$this->pdo->lastInsertId();
    }

    // Exécute $callback dans une transaction : tout est validé, ou tout est annulé.
    // Un appel imbriqué rejoint la transaction déjà ouverte.
    public function transaction(callable $callback): mixed
    {
        if ($this->pdo->inTransaction()) {
            return $callback();
        }

        $this->pdo->beginTransaction();
        try {
            $result = $callback();
            $this->pdo->commit();
            return $result;
        } catch (Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    // Prépare la requête et lie chaque paramètre avec le type PDO adapté.
    // $params : [':nom' => valeur] pour des marqueurs nommés, ou [valeur, ...] pour des "?".
    private function run(string $sql, array $params): PDOStatement
    {
        $stmt = $this->pdo->prepare($sql);
        foreach ($params as $key => $value) {
            $placeholder = is_int($key) ? $key + 1 : $key;
            if ($value instanceof DateTimeInterface) {
                $stmt->bindValue($placeholder, $value->format(self::DATE_FORMAT), PDO::PARAM_STR);
            } elseif (is_bool($value)) {
                $stmt->bindValue($placeholder, $value ? 1 : 0, PDO::PARAM_INT);
            } elseif (is_int($value)) {
                $stmt->bindValue($placeholder, $value, PDO::PARAM_INT);
            } elseif ($value === null) {
                $stmt->bindValue($placeholder, null, PDO::PARAM_NULL);
            } else {
                $stmt->bindValue($placeholder, (string)$value, PDO::PARAM_STR);
            }
        }
        $stmt->execute();
        return $stmt;
    }

    private function __clone() {}

    public function __wakeup()
    {
        throw new LogicException("Database est un singleton : il ne peut pas être désérialisé.");
    }
}
?>
