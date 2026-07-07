<?php

class PromoflowWebhook
{
  public function handleResques()
  {
    header('Content-Type: application/json; charset=utf-8');

    $input = file_get_contents('php://input');
    $data  = json_decode($input, true);

    if (!is_array($data)) {
      echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON payload.'
      ]);
      exit;
    }

    switch ($data["action"] ?? null) {
      case 'get_cases_and_messages':
        $this->getCasesAndMessages($data);
        break;

      case 'get_cases':
        $this->getCases($data);
        break;

      case 'create_case':
        $this->createCase($data);
        break;

      case 'send_message':
        $this->sendMessage($data);
        break;

      case 'get_suppliers':
        $this->getSuppliers($data);
        break;

      default:
        echo json_encode([
          'success' => false,
          'error' => 'Unsupported action.'
        ]);
        break;
    }

    exit;
  }

  private function getCasesAndMessages($data)
  {
    echo json_encode([
      "response" => true,
      "message" => "hola Cases and Messages",
      "data_received" => $data
    ]);
    exit;
  }

  private function getCases($data)
  {
    header('Content-Type: application/json; charset=utf-8');

    $connection = new Database();
    $message = new Message($connection);


    $result = $message->getCases();

    echo json_encode($result);
    exit;
  }

  private function createCase($data)
  {
    echo json_encode([
      "response" => true,
      "message" => "hola Create Case",
      "data_received" => $data
    ]);
    exit;
  }

  private function sendMessage($data)
  {
    echo json_encode([
      "response" => true,
      "message" => "hola Send Message",
      "data_received" => $data
    ]);
    exit;
  }

  private function getSuppliers($data)
  {
    echo json_encode([
      "response" => true,
      "message" => "hola Get Suppliers",
      "data_received" => $data
    ]);
    exit;
  }
}

include "../../controller/config/database.php";
include "../../model/message.php";
include "../../model/promoflow/user.php";

$payload = json_decode(file_get_contents("php://input"), true);

if (is_array($payload)) {
  $apiHandler = new PromoflowWebhook();
  $apiHandler->handleResques();
} else {
  header('Content-Type: application/json; charset=utf-8');

  echo json_encode([
    'success' => false,
    'error' => 'No valid payload received.'
  ]);

  exit;
}

?>
