<?php
class UserModelPromoflow
{
    private $connection;

    private string $name;
    private string $email;
    private string $password;
    private string $role;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    /* ===== set user name ===== */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /* ===== set user email ===== */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    /* ===== set user password ===== */
    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    /* ===== set user role ===== */
    public function setRole(string $role): void
    {
        $this->role = $role;
    }

    /* ===== register new user ===== */
    public function registerUser(): bool
    {
        try {
            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                INSERT INTO Users (name, email, password, role)
                VALUES (:name, :email, :password, :role)
            ");

            $sql->bindParam(':name', $this->name, PDO::PARAM_STR);
            $sql->bindParam(':email', $this->email, PDO::PARAM_STR);
            $sql->bindParam(':password', $this->password, PDO::PARAM_STR);
            $sql->bindParam(':role', $this->role, PDO::PARAM_STR);

            $result = $sql->execute();

            $this->connection->closeConnection();

            return $result; // true if user registered, false otherwise
        } catch (PDOException $e) {
            echo "Error registering user: " . $e->getMessage();
            return false;
        }
    }

    /* ===== check user login ===== */
    public function loginUser(): bool
    {
        try {
            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                SELECT idUser
                FROM Users
                WHERE email = :email AND password = :password
                LIMIT 1
            ");

            $sql->bindParam(':email', $this->email, PDO::PARAM_STR);
            $sql->bindParam(':password', $this->password, PDO::PARAM_STR);

            $sql->execute();
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            $this->connection->closeConnection();

            return $user ? true : false; // return true if user found
        } catch (PDOException $e) {
            echo "Error during login: " . $e->getMessage();
            return false;
        }
    }
}
