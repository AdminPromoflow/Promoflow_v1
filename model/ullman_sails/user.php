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
