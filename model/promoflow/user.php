<?php
class Users
{

    private PDO $db;

    private string $name = '';
    private string $email = '';
    private string $password = '';
    private string $role = '';
    private ?string $avatar = null; // base64 DataURL

    public function __construct(Database $connection){
        $this->db = $connection->getConnection();
    }

    public function setName(string $name): void { $this->name = $name; }
    public function setEmail(string $email): void { $this->email = $email; }
    public function setPassword(string $password): void { $this->password = $password; }
    public function setRole(string $role): void { $this->role = $role; }
    public function setAvatar(?string $avatar): void { $this->avatar = $avatar; }

    // ✅ SOLO: verificar si email y password existen en la BD
    public function loginUser(): bool
    {
        try {
            $stmt = $this->db->prepare("
                SELECT 1
                FROM Users
                WHERE email = :email AND password = :password
                LIMIT 1
            ");
            $stmt->bindValue(':email', $this->email, PDO::PARAM_STR);
            $stmt->bindValue(':password', $this->password, PDO::PARAM_STR);
            $stmt->execute();

            return (bool)$stmt->fetchColumn();

        } catch (PDOException $e) {
            echo "Error login user: " . $e->getMessage();
            return false;
        }
    }

    public function createUser(): bool
    {
        try {
            $sql = $this->db->prepare("
                INSERT INTO Users (name, email, password, role)
                VALUES (:name, :email, :password, :role)
            ");

            $sql->bindParam(':name', $this->name, PDO::PARAM_STR);
            $sql->bindParam(':email', $this->email, PDO::PARAM_STR);
            $sql->bindParam(':password', $this->password, PDO::PARAM_STR);
            $sql->bindParam(':role', $this->role, PDO::PARAM_STR);

            return (bool)$sql->execute();

        } catch (PDOException $e) {
            echo "Error creating user: " . $e->getMessage();
            return false;
        }
    }

    public function getUsers(): array
    {
        try {
            $sql = $this->db->prepare("
                SELECT idUser, name, email, password, role
                FROM Users
                ORDER BY idUser DESC
            ");
            $sql->execute();

            $users = $sql->fetchAll(PDO::FETCH_ASSOC);
            return $users ?: [];

        } catch (PDOException $e) {
            echo "Error getting users: " . $e->getMessage();
            return [];
        }
    }

    private function updateField(int $idUser, string $field, string $value): bool
    {
        $allowed = ['name', 'email', 'role', 'password', 'avatar'];
        if (!in_array($field, $allowed, true)) return false;

        try {
            $stmt = $this->db->prepare("UPDATE Users SET {$field} = :val WHERE idUser = :idUser");
            $stmt->bindValue(':val', $value, PDO::PARAM_STR);
            $stmt->bindValue(':idUser', $idUser, PDO::PARAM_INT);

            return (bool)$stmt->execute();

        } catch (PDOException $e) {
            echo "Error updating {$field}: " . $e->getMessage();
            return false;
        }
    }

    public function updateName(int $idUser, string $name): bool { return $this->updateField($idUser, 'name', $name); }
    public function updateEmail(int $idUser, string $email): bool { return $this->updateField($idUser, 'email', $email); }
    public function updateRole(int $idUser, string $role): bool { return $this->updateField($idUser, 'role', $role); }
    public function updatePassword(int $idUser, string $password): bool { return $this->updateField($idUser, 'password', $password); }
    public function updateAvatar(int $idUser, string $avatarDataUrl): bool { return $this->updateField($idUser, 'avatar', $avatarDataUrl); }

    public function deleteUser(int $idUser): bool
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM Users WHERE idUser = :idUser");
            $stmt->bindValue(':idUser', $idUser, PDO::PARAM_INT);

            return (bool)$stmt->execute();

        } catch (PDOException $e) {
            echo "Error deleting user: " . $e->getMessage();
            return false;
        }
    }
}
