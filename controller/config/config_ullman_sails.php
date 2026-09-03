<?php

class DatabaseUllmanSails
{
    private $servername = 'localhost';
    private $dbname = 'u273173398_ullman_sails';
    private $username = 'u273173398_Jon_Peg';
    private $password = '32skiff32!CI';
    private $connection = null;

    public function __construct()
    {
        $this->servername = $this->environmentValue('ULLMAN_DB_HOST', $this->servername);
        $this->dbname = $this->environmentValue('ULLMAN_DB_NAME', $this->dbname);
        $this->username = $this->environmentValue('ULLMAN_DB_USER', $this->username);
        $this->password = $this->environmentValue('ULLMAN_DB_PASSWORD', $this->password);

        try {
            $dsn = 'mysql:host=' . $this->servername
                . ';dbname=' . $this->dbname
                . ';charset=utf8mb4';

            $this->connection = new PDO(
                $dsn,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                )
            );
        } catch (PDOException $error) {
            error_log('Ullman Sails database connection failed: ' . $error->getMessage());
            $this->connection = null;
        }
    }

    public function getConnection()
    {
        return $this->connection;
    }

    public function closeConnection()
    {
        $this->connection = null;
    }

    private function environmentValue($name, $default)
    {
        $value = getenv($name);

        return is_string($value) && $value !== '' ? $value : $default;
    }
}
