<?php

class UserClass
{
    private const ALLOWED_ROLES = [
        'Ullman Sails',
        'W3P',
        'Amazon',
        'eBay',
        '.63',
        'Hello Print',
        'Admin',
    ];

    public function handleUser(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        if (($_SERVER['REQUEST_METHOD'] ?? 'POST') !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Method not allowed.'], 405);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!is_array($data) || empty($data['action'])) {
            $this->respond(['success' => false, 'message' => 'No action received.'], 400);
            return;
        }

        try {
            switch ($data['action']) {
                case 'createUser':
                    $this->createUser($data);
                    break;
                case 'updateUser':
                    $this->updateUser($data);
                    break;
                case 'readUsers':
                    $this->readUsers();
                    break;
                case 'deleteUsers':
                    $this->deleteUser($data);
                    break;
                case 'requestLogin':
                    $this->login($data);
                    break;
                default:
                    $this->respond(['success' => false, 'message' => 'Invalid action.'], 400);
            }
        } catch (Throwable $exception) {
            error_log('User controller error: ' . $exception->getMessage());
            $this->respond(['success' => false, 'message' => 'The server could not complete the request.'], 500);
        }
    }

    private function createUser(array $data): void
    {
        $validated = $this->validateUser($data, true);
        if (!$validated['success']) {
            $this->respond($validated, 422);
            return;
        }

        $connection = new Database();
        $user = new Users($connection);

        if ($user->emailExists($validated['email'])) {
            $this->respond(['success' => false, 'message' => 'That email address is already in use.'], 409);
            return;
        }

        $user->setName($validated['name']);
        $user->setEmail($validated['email']);
        $user->setPassword($validated['password']);
        $user->setRole($validated['role']);

        if (!$user->createUser()) {
            $this->respond(['success' => false, 'message' => 'User could not be created.'], 500);
            return;
        }

        $createdId = $user->getIdUserByEmail();
        $this->respond([
            'success' => true,
            'message' => 'User created.',
            'user' => $user->getUserById($createdId),
        ], 201);
    }

    private function updateUser(array $data): void
    {
        $idUser = filter_var($data['idUser'] ?? null, FILTER_VALIDATE_INT);
        if (!$idUser || $idUser < 1) {
            $this->respond(['success' => false, 'message' => 'Invalid user ID.'], 422);
            return;
        }

        $validated = $this->validateUser($data, false);
        if (!$validated['success']) {
            $this->respond($validated, 422);
            return;
        }

        $connection = new Database();
        $user = new Users($connection);

        if (!$user->getUserById($idUser)) {
            $this->respond(['success' => false, 'message' => 'User not found.'], 404);
            return;
        }

        if ($user->emailExists($validated['email'], $idUser)) {
            $this->respond(['success' => false, 'message' => 'That email address is already in use.'], 409);
            return;
        }

        $password = $validated['password'] !== '' ? $validated['password'] : null;
        if (!$user->updateUser($idUser, $validated['name'], $validated['email'], $validated['role'], $password)) {
            $this->respond(['success' => false, 'message' => 'User could not be updated.'], 500);
            return;
        }

        $this->respond([
            'success' => true,
            'message' => 'User updated.',
            'user' => $user->getUserById($idUser),
        ]);
    }

    private function readUsers(): void
    {
        $connection = new Database();
        $user = new Users($connection);
        $this->respond(['success' => true, 'users' => $user->getUsers()]);
    }

    private function deleteUser(array $data): void
    {
        $idUser = filter_var($data['idUser'] ?? null, FILTER_VALIDATE_INT);
        if (!$idUser || $idUser < 1) {
            $this->respond(['success' => false, 'message' => 'Invalid user ID.'], 422);
            return;
        }

        $connection = new Database();
        $user = new Users($connection);
        $existing = $user->getUserById($idUser);

        if (!$existing) {
            $this->respond(['success' => false, 'message' => 'User not found.'], 404);
            return;
        }

        if (!$user->deleteUser($idUser)) {
            $this->respond(['success' => false, 'message' => 'User could not be deleted. It may be linked to existing records.'], 409);
            return;
        }

        $this->respond(['success' => true, 'message' => 'User deleted.']);
    }

    private function validateUser(array $data, bool $requiresPassword): array
    {
        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $role = $this->normalizeRole((string) ($data['role'] ?? ''));

        if (mb_strlen($name) < 2 || mb_strlen($name) > 50) {
            return ['success' => false, 'message' => 'Full name must contain between 2 and 50 characters.'];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 50) {
            return ['success' => false, 'message' => 'Enter a valid email address (maximum 50 characters).'];
        }

        if ($role === null) {
            return ['success' => false, 'message' => 'Select at least one valid access role.'];
        }

        if (($requiresPassword && strlen($password) < 6) || (!$requiresPassword && $password !== '' && strlen($password) < 6)) {
            return ['success' => false, 'message' => 'Password must contain at least 6 characters.'];
        }

        return [
            'success' => true,
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $role,
        ];
    }

    private function normalizeRole(string $role): ?string
    {
        $requestedRoles = array_values(array_unique(array_filter(array_map('trim', explode(',', $role)))));
        if (!$requestedRoles) return null;
        if (in_array('Admin', $requestedRoles, true)) return 'Admin';

        foreach ($requestedRoles as $requestedRole) {
            if (!in_array($requestedRole, self::ALLOWED_ROLES, true)) return null;
        }

        $normalized = implode(', ', $requestedRoles);
        return strlen($normalized) <= 50 ? $normalized : null;
    }

    private function login(array $data): void
    {
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $connection = new Database();
        $user = new Users($connection);
        $user->setEmail($email);
        $user->setPassword($password);

        if (!$user->loginUser()) {
            $this->respond(['status' => 'error', 'message' => 'Invalid credentials.'], 401);
            return;
        }

        if (session_status() === PHP_SESSION_NONE) session_start();
        session_regenerate_id(true);
        $_SESSION['user_email'] = $email;
        $_SESSION['is_logged'] = true;

        $this->respond(['status' => 'success', 'message' => 'Login successful.', 'user' => $email]);
    }

    private function respond(array $payload, int $status = 200): void
    {
        http_response_code($status);
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}

include_once '../../controller/config/database.php';
include_once '../../model/promoflow/user.php';

if (isset($_SERVER['SCRIPT_FILENAME']) && realpath($_SERVER['SCRIPT_FILENAME']) === __FILE__) {
    (new UserClass())->handleUser();
}
