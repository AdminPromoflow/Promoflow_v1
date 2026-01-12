<?php

class User_Model {
    private $User = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setUser(array $data)
    {
        $this->User = [
            'id_customers' => $data['idUser'] ?? null,
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null
        ];

        return $this;
    }

    public function userExist(bool $close = true): bool
    {
        try {
            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                SELECT id_customers
                FROM Customers
                WHERE id_customers = :id_customers
                LIMIT 1
            ");

            $sql->bindParam(':id_customers', $this->User['id_customers'], PDO::PARAM_INT);
            $sql->execute();

            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($close) {
                $this->connection->closeConnection();
            }

            return $user ? true : false;

        } catch (PDOException $e) {
            echo "Error al verificar usuario: " . $e->getMessage();
            return false;
        }
    }

    public function createUser(): bool
    {
        try {
            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                INSERT INTO Customers (id_customers, name, email)
                VALUES (:id_customers, :name, :email)
            ");

            $sql->bindParam(':id_customers', $this->User['id_customers'], PDO::PARAM_INT);
            $sql->bindParam(':name', $this->User['name'], PDO::PARAM_STR);
            $sql->bindParam(':email', $this->User['email'], PDO::PARAM_STR);

            $result = $sql->execute();

            $this->connection->closeConnection();

            return $result;

        } catch (PDOException $e) {
            echo "Error al crear usuario: " . $e->getMessage();
            return false;
        }
    }


}
?>
