<?php
// Start the session
session_start();

class ApiHandler {
    // Function to handle incoming requests
    public function handleRequest() {
        // Check if the request is POST
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            // Get raw JSON data from the request body
            $rawData = file_get_contents("php://input");

            // Decode the JSON data
            $data = json_decode($rawData);

            // Check if JSON data is valid and contains an "action" field
            if ($data !== null && isset($data->action)) {
                // Get the action from the JSON data
                $action = $data->action;

                // Perform actions based on the request
                switch ($action) {
                    case "register":
                        $this->handleRegistration($data);
                        break;
                    case "login":
                        $this->handleLogin($data);
                        break;
                    default:
                        // Unknown action
                        http_response_code(400); // Bad Request
                        $response = array("message" => "Unknown action");
                        echo json_encode($response);
                        break;
                }
            } else {
                // Incomplete JSON data or missing action
                http_response_code(400); // Bad Request
                echo json_encode(array("message" => "Incomplete JSON data or missing action"));
            }
        } else {
            // The request is not a valid POST request
            http_response_code(405); // Method Not Allowed
            echo json_encode(array("message" => "Method not allowed"));
        }
    }

    // Function to handle user registration
    private function handleRegistration($data) {
        // Extract user registration data from JSON
        $name = $data->nameRegister;
        $email = $data->emailRegister;
        $password = $data->passwordRegister;

        // Validate user data using the Security class
        $security = new Security();
        $var = $security->validateUserDataRegistration($name, $email, $password);

        if (!!$var) {
            // Create a database connection
            $connection = new Database();

            // Create a new Users instance and set user data
            $user = new Users($connection);
            $user->setName($var['username']);
            $user->setEmail($var['email']);
            $user->setPassword($var['password']);

            // Create the user in the database
            $user->createUser();

            // Send a success response
            $response = array("message" => "Registration successful");
            echo json_encode($response);
        } else {
            // User data validation failed; the user may already exist
            $response = array("message" => "Registration not successful. User already exists");
            echo json_encode($response);
        }
    }

    // Function to handle user login
    private function handleLogin($data) {
        // Logic to process user login
        // Create a database connection
        $connection = new Database();

        // Create a new Users instance and set user data
        $user = new Users($connection);

        // Check if $data is an object and if it contains the "email" property
        if (is_object($data) && property_exists($data, 'email')) {
            $user->setEmail($data->email);

            // Create the user in the database
            $storedHash = $user->getPasswordUserByEmail();
            $password = $data->password;

            if (password_verify($password, $storedHash)) {
                $response = array("message" => true);
                $_SESSION['logged_in'] = true;
                echo json_encode($response);
            } else {
                $response = array("message" => "Login not successful");
                echo json_encode($response);
            }
        } else {
            // If the "email" property is missing in $data
            $response = array("message" => "Invalid data for login");
            echo json_encode($response);
        }
    }
}

// Include required files
require_once '../config/database.php';
require_once '../config/security.php';
require_once '../models/users.php';

// Create an instance of the ApiHandler class and handle the request
$apiHandler = new ApiHandler();
$apiHandler->handleRequest();
?>
