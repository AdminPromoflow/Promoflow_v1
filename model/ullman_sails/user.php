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

    public function loginUserUllmanSails(string $password, string $debugStep = ''): array
    {
        if ($this->email === '' || $password === '') {
            return $this->invalidCredentials();
        }

        try {
            $this->debugBreakpoint($debugStep, 'model_before_query', array(
                'email' => $this->email,
                'table' => 'users'
            ));

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

            $this->debugBreakpoint($debugStep, 'model_after_query', array(
                'user_found' => is_array($user),
                'user' => is_array($user)
                    ? array(
                        'id' => (int) $user['id'],
                        'name' => (string) $user['name'],
                        'email' => (string) $user['email'],
                        'role' => (string) $user['role'],
                        'status' => (string) $user['status']
                    )
                    : null
            ));

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

            $passwordIsValid = password_verify($password, $this->passwordHash);

            $this->debugBreakpoint($debugStep, 'model_after_password', array(
                'password_valid' => $passwordIsValid,
                'role' => $this->role,
                'status' => $this->status
            ));

            if (!$passwordIsValid) {
                return $this->invalidCredentials();
            }

            if (strtolower($this->status) !== 'active') {
                return $this->invalidCredentials();
            }

            if (strtolower($this->role) !== 'admin') {
                return $this->invalidCredentials();
            }

            $response = array(
                'success' => true,
                'user' => array(
                    'id' => $this->id,
                    'name' => $this->name,
                    'email' => $this->email,
                    'role' => $this->role,
                    'status' => $this->status
                )
            );

            $this->debugBreakpoint($debugStep, 'model_success', array(
                'response' => $response
            ));

            return $response;
        } catch (PDOException $error) {
            error_log('Ullman Sails user lookup failed: ' . $error->getMessage());

            return $this->invalidCredentials();
        }
    }

    public function getUsers(): array
    {
        $statement = $this->db->query("
            SELECT
                id,
                name,
                email,
                role,
                status,
                created_at,
                updated_at
            FROM `users`
            ORDER BY created_at DESC, id DESC
        ");

        $users = $statement->fetchAll(PDO::FETCH_ASSOC);

        return is_array($users) ? array_map(array($this, 'sanitizeUser'), $users) : array();
    }

    public function getUserById(int $id): ?array
    {
        $statement = $this->db->prepare("
            SELECT
                id,
                name,
                email,
                role,
                status,
                created_at,
                updated_at
            FROM `users`
            WHERE id = :id
            LIMIT 1
        ");
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        $user = $statement->fetch(PDO::FETCH_ASSOC);

        return is_array($user) ? $this->sanitizeUser($user) : null;
    }

    public function emailExists(string $email, int $excludeId = 0): bool
    {
        $query = 'SELECT 1 FROM `users` WHERE LOWER(email) = LOWER(:email)';

        if ($excludeId > 0) {
            $query .= ' AND id <> :exclude_id';
        }

        $query .= ' LIMIT 1';
        $statement = $this->db->prepare($query);
        $statement->bindValue(':email', $email, PDO::PARAM_STR);

        if ($excludeId > 0) {
            $statement->bindValue(':exclude_id', $excludeId, PDO::PARAM_INT);
        }

        $statement->execute();

        return (bool) $statement->fetchColumn();
    }

    public function createUser(string $password): ?array
    {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        if (!is_string($passwordHash) || $passwordHash === '') {
            throw new RuntimeException('The password could not be secured.');
        }

        $statement = $this->db->prepare("
            INSERT INTO `users` (
                name,
                email,
                password_hash,
                role,
                status,
                created_at,
                updated_at
            ) VALUES (
                :name,
                :email,
                :password_hash,
                :role,
                :status,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
        ");
        $statement->execute(array(
            ':name' => $this->name,
            ':email' => $this->email,
            ':password_hash' => $passwordHash,
            ':role' => $this->role,
            ':status' => $this->status
        ));

        $this->setId((int) $this->db->lastInsertId());

        return $this->getUserById($this->id);
    }

    public function updateUser(?string $password = null): ?array
    {
        $fields = array(
            'name = :name',
            'email = :email',
            'role = :role',
            'status = :status',
            'updated_at = CURRENT_TIMESTAMP'
        );
        $parameters = array(
            ':id' => $this->id,
            ':name' => $this->name,
            ':email' => $this->email,
            ':role' => $this->role,
            ':status' => $this->status
        );

        if (is_string($password) && $password !== '') {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            if (!is_string($passwordHash) || $passwordHash === '') {
                throw new RuntimeException('The password could not be secured.');
            }

            $fields[] = 'password_hash = :password_hash';
            $parameters[':password_hash'] = $passwordHash;
        }

        $statement = $this->db->prepare(
            'UPDATE `users` SET ' . implode(', ', $fields) . ' WHERE id = :id'
        );
        $statement->execute($parameters);

        return $this->getUserById($this->id);
    }

    public function hasPageActivity(int $id): bool
    {
        $statement = $this->db->prepare(
            'SELECT 1 FROM `page_activity` WHERE user_id = :id LIMIT 1'
        );
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        return (bool) $statement->fetchColumn();
    }

    public function deleteUser(): bool
    {
        $statement = $this->db->prepare('DELETE FROM `users` WHERE id = :id');
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
        $statement->execute();

        return $statement->rowCount() > 0;
    }

    private function sanitizeUser(array $user): array
    {
        return array(
            'id' => (int) $user['id'],
            'name' => (string) $user['name'],
            'email' => (string) $user['email'],
            'role' => (string) $user['role'],
            'status' => (string) $user['status'],
            'created_at' => isset($user['created_at']) ? (string) $user['created_at'] : null,
            'updated_at' => isset($user['updated_at']) ? (string) $user['updated_at'] : null
        );
    }

    private function debugBreakpoint(string $requestedStage, string $stage, array $data): void
    {
        if (
            !defined('ULLMAN_LOGIN_DEBUG')
            || constant('ULLMAN_LOGIN_DEBUG') !== true
            || $requestedStage !== $stage
        ) {
            return;
        }

        http_response_code(200);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(array(
            'success' => false,
            'debug' => true,
            'stage' => $stage,
            'message' => 'Login breakpoint reached.',
            'data' => $data
        ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    private function invalidCredentials(): array
    {
        return array(
            'success' => false,
            'message' => 'Invalid credentials'
        );
    }
}
