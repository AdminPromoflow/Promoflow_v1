<?php
class SessionManage
{
    // handle ajax payload and respond in json
    public function handleSession(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        // read json body from ajax
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        // validate action
        $action = $input['action'] ?? null;
        if ($action === null) {
            echo json_encode(["status" => "error", "message" => "No action received"]);
            return;
        }

        switch ($action) {
            case 'check':
                $isLogged = $this->checkSession();
                echo json_encode([
                    "status"  => $isLogged ? "success" : "error",
                    "message" => $isLogged ? "User is logged in" : "User is not logged in"
                ]);
                break;

            case 'off':
                $ok = $this->turnOff();
                echo json_encode([
                    "status"  => $ok ? "success" : "error",
                    "message" => $ok ? "Session destroyed" : "No active session"
                ]);
                break;

            default:
                echo json_encode(["status" => "error", "message" => "Invalid session action"]);
                break;
        }
    }

    // check if user is logged in (returns bool)
    public function checkSession(): bool
    {
        return isset($_SESSION['is_logged']) && $_SESSION['is_logged'] === true;
    }

    // destroy current session (returns bool)
    public function turnOff(): bool
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION = [];
            session_unset();
            session_destroy();
            return true;
        }
        return false;
    }
}

$session = new SessionManage();
$session->handleSession();
