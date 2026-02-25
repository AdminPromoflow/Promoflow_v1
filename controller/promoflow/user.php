<?php
class UserClass {

    public function handleUser() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!is_array($data) || !isset($data['action'])) {
            echo json_encode(["success" => false, "message" => "No action received"]);
            return;
        }

        switch ($data['action']) {
            case "createUser":
                $this->createUser($data);
                break;

            case "updateUser":
                $this->updateUser($data);
                break;

            case "readUsers":
                $this->readUsers();
                break;

            case "deleteUsers":
                $this->deleteUsers($data);
                break;

            case "requestLogin":
                $this->login($data);
                break;

            default:
                echo json_encode(["success" => false, "message" => "Invalid action"]);
                break;
        }
    }

    private function isNotEmpty(array $data, string $key): bool {
        if (!array_key_exists($key, $data)) return false;
        $v = $data[$key];
        if ($v === null) return false;
        if (is_string($v) && trim($v) === '') return false;
        return true;
    }

    private function createUser($data) {
        $connection = new Database();
        $user = new Users($connection);

        $user->setName($data['name'] ?? '');
        $user->setEmail($data['email'] ?? '');
        $user->setPassword($data['password'] ?? '');
        $user->setRole($data['role'] ?? '');
        echo json_encode("Buenas");exit;

        // ✅ avatar llega como DataURL base64 "data:image/...;base64,..."
      //  $user->setAvatar($data['avatar'] ?? null);

        $result = $user->createUser();

        echo json_encode([
            "success" => $result,
            "message" => $result ? "User created" : "Create failed"
        ]);
    }

    private function updateUser($data)
    {
        $idUser = isset($data['idUser']) ? (int)$data['idUser'] : 0;
        if ($idUser <= 0) {
            echo json_encode(["success" => false, "message" => "Invalid idUser"]);
            return;
        }

        $connection = new Database();
        $user = new Users($connection);

        $didUpdate = false;
        $errors = [];

        try {
            if ($this->isNotEmpty($data, 'name')) {
                $didUpdate = true;
                if (!$user->updateName($idUser, trim((string)$data['name']))) {
                    $errors[] = "Failed updating name";
                }
            }

            if ($this->isNotEmpty($data, 'email')) {
                $didUpdate = true;
                if (!$user->updateEmail($idUser, trim((string)$data['email']))) {
                    $errors[] = "Failed updating email";
                }
            }

            if ($this->isNotEmpty($data, 'role')) {
                $didUpdate = true;
                if (!$user->updateRole($idUser, trim((string)$data['role']))) {
                    $errors[] = "Failed updating role";
                }
            }

            // ✅ password solo si viene NO vacío
            if ($this->isNotEmpty($data, 'password')) {
                $didUpdate = true;
                if (!$user->updatePassword($idUser, (string)$data['password'])) {
                    $errors[] = "Failed updating password";
                }
            }

            // ✅ avatar solo si viene NO vacío
            if ($this->isNotEmpty($data, 'avatar')) {
                $didUpdate = true;
                if (!$user->updateAvatar($idUser, (string)$data['avatar'])) {
                    $errors[] = "Failed updating avatar";
                }
            }

            if (!$didUpdate) {
                echo json_encode(["success" => false, "message" => "Nothing to update"]);
                return;
            }

            if (!empty($errors)) {
                echo json_encode([
                    "success" => false,
                    "message" => $errors[0],   // o devuelve todos si quieres
                    "errors"  => $errors
                ]);
                return;
            }

            echo json_encode(["success" => true, "message" => "User updated"]);

        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        } finally {
            if (method_exists($connection, 'closeConnection')) {
                $connection->closeConnection();
            }
        }
    }

    private function readUsers() {
        $connection = new Database();
        $user = new Users($connection);
        echo json_encode($user->getUsers());
    }

    private function deleteUsers($data) {
        $idUser = isset($data['idUser']) ? (int)$data['idUser'] : 0;
        if ($idUser <= 0) {
            echo json_encode(["success" => false, "message" => "Invalid idUser"]);
            return;
        }

        $connection = new Database();
        $user = new Users($connection);
        $ok = $user->deleteUser($idUser);

        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "User deleted" : "Delete failed"
        ]);
    }

    private function login($data) {

      $email = $data['email'] ?? '';
      $password = $data['password'] ?? '';

        // initialize connection and model
      $connection = new Database();
      $modelUser  = new Users($connection);

      $modelUser->setEmail($email);
      $modelUser->setPassword($password);

      $isLogged = $modelUser->loginUser();

        if ($isLogged) {
            // start session if not already started
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            // save global session variables
            $_SESSION['user_email'] = $email;
            $_SESSION['is_logged']  = true;

            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => $email
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Invalid credentials"
            ]);
        }

    }
}

include_once '../../controller/config/database.php';
include_once '../../model/promoflow/user.php';

if (isset($_SERVER['SCRIPT_FILENAME']) && realpath($_SERVER['SCRIPT_FILENAME']) === __FILE__) {
    $userClass = new UserClass();
    $userClass->handleUser();
}
