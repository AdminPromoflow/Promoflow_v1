<?php

class UllmanSailsUser
{
    private PDO $db;

    private int $id = 0;
    private string $name = '';
    private string $email = '';
    private string $passwordHash = '';
    private string $role = '';
    private string $status = '';
    private ?string $createdAt = null;
    private ?string $updatedAt = null;

    public function __construct(DatabaseUllmanSails $connection)
    {
        $databaseConnection = $connection->getConnection();

        if (!$databaseConnection instanceof PDO) {
            throw new RuntimeException('The database connection is unavailable.');
        }

        $this->db = $databaseConnection;
    }

    public function setId(int $id): void { $this->id = $id; }
    public function setName(string $name): void { $this->name = $name; }
    public function setEmail(string $email): void { $this->email = $email; }
    public function setPasswordHash(string $passwordHash): void { $this->passwordHash = $passwordHash; }
    public function setRole(string $role): void { $this->role = $role; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function setCreatedAt(?string $createdAt): void { $this->createdAt = $createdAt; }
    public function setUpdatedAt(?string $updatedAt): void { $this->updatedAt = $updatedAt; }

    public function getId(): int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getEmail(): string { return $this->email; }
    public function getPasswordHash(): string { return $this->passwordHash; }
    public function getRole(): string { return $this->role; }
    public function getStatus(): string { return $this->status; }
    public function getCreatedAt(): ?string { return $this->createdAt; }
    public function getUpdatedAt(): ?string { return $this->updatedAt; }

    public function loginUserUllmanSails(string $password): array
    {
        if ($this->email === '' || $password === '') {
            return $this->invalidCredentials();
        }

        try {
            $statement = $this->db->prepare("
                SELECT
                    id,
                    name,
                    email,
                    password_hash,
                    role,
                    status,
                    created_at,
                    updated_at
                FROM `users`
                WHERE email = :email
                LIMIT 1
            ");

            $statement->bindValue(':email', $this->email, PDO::PARAM_STR);
            $statement->execute();

            $user = $statement->fetch(PDO::FETCH_ASSOC);

            if (!is_array($user)) {
                return $this->invalidCredentials();
            }

            $this->setId((int) $user['id']);
            $this->setName((string) $user['name']);
            $this->setEmail((string) $user['email']);
            $this->setPasswordHash((string) $user['password_hash']);
            $this->setRole((string) $user['role']);
            $this->setStatus((string) $user['status']);
            $this->setCreatedAt(isset($user['created_at']) ? (string) $user['created_at'] : null);
            $this->setUpdatedAt(isset($user['updated_at']) ? (string) $user['updated_at'] : null);

            if (!password_verify($password, $this->passwordHash)) {
                return $this->invalidCredentials();
            }

            if (strtolower($this->status) !== 'active') {
                return $this->invalidCredentials();
            }

            if (strtolower($this->role) !== 'admin') {
                return $this->invalidCredentials();
            }

            return array(
                'success' => true,
                'user' => array(
                    'id' => $this->id,
                    'name' => $this->name,
                    'email' => $this->email,
                    'role' => $this->role,
                    'status' => $this->status
                )
            );
        } catch (PDOException $error) {
            error_log('Ullman Sails user lookup failed: ' . $error->getMessage());

            return $this->invalidCredentials();
        }
    }

    private function invalidCredentials(): array
    {
        return array(
            'success' => false,
            'message' => 'Invalid credentials'
        );
    }
}
