<?php

class Users
{
    private PDO $db;
    private string $name = '';
    private string $email = '';
    private string $password = '';
    private string $role = '';
    private ?string $avatar = null;

    public function __construct(Database $connection)
    {
        $this->db = $connection->getConnection();
    }

    public function setName(string $name): void { $this->name = $name; }
    public function setEmail(string $email): void { $this->email = $email; }
    public function setPassword(string $password): void { $this->password = $password; }
    public function setRole(string $role): void { $this->role = $role; }
    public function setAvatar(?string $avatar): void { $this->avatar = $avatar; }

    public function getIdUserByEmail(): int
    {
        if ($this->email === '') return 0;

        try {
            $statement = $this->db->prepare('SELECT idUser FROM Users WHERE email = :email LIMIT 1');
            $statement->execute([':email' => $this->email]);
            return (int) ($statement->fetchColumn() ?: 0);
        } catch (PDOException $exception) {
            error_log('Error getting user ID: ' . $exception->getMessage());
            return 0;
        }
    }

    public function loginUser(): bool
    {
        try {
            $statement = $this->db->prepare('SELECT password FROM Users WHERE email = :email LIMIT 1');
            $statement->execute([':email' => $this->email]);
            $storedPassword = $statement->fetchColumn();

            if (!is_string($storedPassword) || $storedPassword === '') return false;

            // New passwords are hashed. The fallback keeps existing legacy accounts working.
            return password_verify($this->password, $storedPassword)
                || hash_equals($storedPassword, $this->password);
        } catch (PDOException $exception) {
            error_log('Error logging in user: ' . $exception->getMessage());
            return false;
        }
    }

    public function createUser(): bool
    {
        try {
            $statement = $this->db->prepare(
                'INSERT INTO Users (name, email, password, role) VALUES (:name, :email, :password, :role)'
            );

            return $statement->execute([
                ':name' => $this->name,
                ':email' => $this->email,
                ':password' => password_hash($this->password, PASSWORD_DEFAULT),
                ':role' => $this->role,
            ]);
        } catch (PDOException $exception) {
            error_log('Error creating user: ' . $exception->getMessage());
            return false;
        }
    }

    public function getUsers(): array
    {
        try {
            $statement = $this->db->query(
                'SELECT idUser, name, email, role, imageURL FROM Users ORDER BY idUser DESC'
            );
            return $statement->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $exception) {
            error_log('Error getting users: ' . $exception->getMessage());
            return [];
        }
    }

    public function getUserById(int $idUser): ?array
    {
        try {
            $statement = $this->db->prepare(
                'SELECT idUser, name, email, role, imageURL FROM Users WHERE idUser = :idUser LIMIT 1'
            );
            $statement->execute([':idUser' => $idUser]);
            $user = $statement->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $exception) {
            error_log('Error getting user: ' . $exception->getMessage());
            return null;
        }
    }

    public function emailExists(string $email, ?int $excludeId = null): bool
    {
        $query = 'SELECT 1 FROM Users WHERE LOWER(email) = LOWER(:email)';
        $params = [':email' => $email];

        if ($excludeId !== null) {
            $query .= ' AND idUser <> :excludeId';
            $params[':excludeId'] = $excludeId;
        }

        $query .= ' LIMIT 1';
        $statement = $this->db->prepare($query);
        $statement->execute($params);
        return (bool) $statement->fetchColumn();
    }

    public function updateUser(
        int $idUser,
        string $name,
        string $email,
        string $role,
        ?string $password = null
    ): bool {
        $fields = ['name = :name', 'email = :email', 'role = :role'];
        $params = [
            ':idUser' => $idUser,
            ':name' => $name,
            ':email' => $email,
            ':role' => $role,
        ];

        if ($password !== null && $password !== '') {
            $fields[] = 'password = :password';
            $params[':password'] = password_hash($password, PASSWORD_DEFAULT);
        }

        $statement = $this->db->prepare(
            'UPDATE Users SET ' . implode(', ', $fields) . ' WHERE idUser = :idUser'
        );
        return $statement->execute($params);
    }

    private function updateField(int $idUser, string $field, string $value): bool
    {
        $allowed = ['name', 'email', 'role', 'password', 'imageURL'];
        if (!in_array($field, $allowed, true)) return false;

        try {
            $statement = $this->db->prepare("UPDATE Users SET {$field} = :value WHERE idUser = :idUser");
            return $statement->execute([':value' => $value, ':idUser' => $idUser]);
        } catch (PDOException $exception) {
            error_log("Error updating {$field}: " . $exception->getMessage());
            return false;
        }
    }

    public function updateName(int $idUser, string $name): bool
    {
        return $this->updateField($idUser, 'name', $name);
    }

    public function updateEmail(int $idUser, string $email): bool
    {
        return $this->updateField($idUser, 'email', $email);
    }

    public function updateRole(int $idUser, string $role): bool
    {
        return $this->updateField($idUser, 'role', $role);
    }

    public function updatePassword(int $idUser, string $password): bool
    {
        return $this->updateField($idUser, 'password', password_hash($password, PASSWORD_DEFAULT));
    }

    public function updateAvatar(int $idUser, string $avatarDataUrl): bool
    {
        return $this->updateField($idUser, 'imageURL', $avatarDataUrl);
    }

    public function deleteUser(int $idUser): bool
    {
        try {
            $statement = $this->db->prepare('DELETE FROM Users WHERE idUser = :idUser');
            $statement->execute([':idUser' => $idUser]);
            return $statement->rowCount() > 0;
        } catch (PDOException $exception) {
            error_log('Error deleting user: ' . $exception->getMessage());
            return false;
        }
    }
}
