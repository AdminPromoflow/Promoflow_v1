<?php
// Start the session
session_start();

class LanyardCustomersApiHandler {
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
                    case "getAllLanyardCustomers":
                        $this->handleGetAllLanyardCustomers($data);
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

    // Function to handle user login
    private function handleGetAllLanyardCustomers($data) {
    //  echo json_encode($data);  exit;
      // Token de autenticación
      $token = "ZaPWPtiQvAjwWBFXvOzu3Cfo4PUZiQ4f"; // Reemplaza esto con tu token real

      // Datos que deseas enviar en la solicitud POST
      $data = array(
          'action' => 'getAllLanyardCustomers'
      );

      // URL del servicio
      $service_url = 'https://lanyardsforyou.com/LandingPage/controller/customers/get-customers-controller.php'; // Reemplaza con la URL de tu servicio real

      // Configura la solicitud
      $ch = curl_init($service_url);

      // Configura los encabezados, incluyendo el token de autenticación
      $headers = array(
          'Content-Type: application/json',
          'Auth-Token: ' . $token
      );
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

      // Configura la solicitud como POST
      curl_setopt($ch, CURLOPT_POST, 1);

      // Codifica los datos como JSON
      $json_data = json_encode($data);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);

      // Configura la opción para recibir la respuesta
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

      // Realiza la solicitud
      $response = curl_exec($ch);

      // Verifica si hubo errores
      if ($response === false) {
          die('Error al realizar la solicitud: ' . curl_error($ch));
      }

      // Cierra la sesión cURL
      curl_close($ch);

      // Procesa la respuesta
      echo $response;

    }
}

// Create an instance of the ApiHandler class and handle the request
$lanyardCustomersApiHandler = new LanyardCustomersApiHandler();
$lanyardCustomersApiHandler->handleRequest();
?>
