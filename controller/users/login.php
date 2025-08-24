<?php
class LoginClass {

    // handle login request and switch by action
    public function handleLogin() {

        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input['action'])) {
            echo json_encode(["error" => "No action received"]);
            return;
        }

        switch ($input['action']) {
            case "requestLogin":
                $this->Login($input);
                break;
            default:
                echo json_encode(["error" => "Invalid action"]);
                break;
        }
    }

    // execute login using UserModelPromoflow
    private function Login($input) {



        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        echo json_encode([
            "status" => "error4",
            "message" => "Invalid credentials"
        ]);exit;
        // initialize connection and model
        $connection = new Database();
        $modelUser  = new UserModelPromoflow($connection);



        // set credentials
        $modelUser->setEmail($email);
        $modelUser->setPassword($password);

        // check login
        $isLogged = $modelUser->loginUser();

        if ($isLogged) {
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

// include required files
include_once '../../../controller/config/database.php';
include_once '../../../model/promoflow/user.php';

// create login controller and handle request
$loginClass = new LoginClass();
$loginClass->handleLogin();
