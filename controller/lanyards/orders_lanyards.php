<?php
// Start the session
session_start();

class OrdersLanyardsForYou {
    // Function to handle incoming requests
    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData);

            if ($data !== null && isset($data->action)) {
                $action = $data->action;

                switch ($action) {
                    case "getOrdersInfo":
                        $this->getOrdersInfo($data);
                        break;
                    default:
                        http_response_code(400);
                        echo json_encode(["message" => "Unknown action"]);
                        break;
                }
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Incomplete JSON data or missing action"]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
    }

    private function getOrdersInfo($data) {
      // Primero asegúrate de tener la conexión a la base de datos
      $connection = new Database(); // Suponiendo que esta clase ya está definida

      // Crear una instancia del modelo
      $lanyardsModel = new LanyardsForYou_Model($connection);

      // Llamar a la función para obtener todas las órdenes
      $allOrders = $lanyardsModel->getAllOrders();

      // Mostrar resultados (por ejemplo, en JSON para una API)
      echo json_encode($allOrders);

    }
}
require_once('../../config/database.php');
require_once('../../models/LanyardsForYou/lanyards_for_you.php');




// Instanciar y manejar la solicitud
$ordersLanyards = new OrdersLanyardsForYou();
$ordersLanyards->handleRequest();
?>
