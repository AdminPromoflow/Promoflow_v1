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
    header('Content-Type: application/json; charset=utf-8');

    $connection = new Database();
    $message = new Message($connection);

    $message->setIdCase($data["caseId"]);

    $resultMessages = $message->getCasesAndMessages();

    echo json_encode($resultMessages);
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
    header('Content-Type: application/json; charset=utf-8');


    $idUser = $data["user_id"];

    date_default_timezone_set("Europe/London");
    $created_at = date("Y-m-d H:i:s");


    $connection = new Database();
    $message = new Message($connection);


    $message->setIdCase($data["caseId"]);
    $message->setSenderType("supplier");
    $message->setSenderId($idUser);
    $message->setMessage($data["message"]);
    $message->setMessageCreatedAt($created_at);

    echo json_encode([
        "response" => true,
        "debug" => true,
        "caseId" => $data["caseId"] ?? null,
        "sender_type" => "supplier",
        "sender_id" => $idUser ?? null,
        "message" => $data["message"] ?? null,
        "message_created_at" => $created_at ?? null,
        "all_data_received" => $data
    ]);
    exit;
    $resultMessages = $message->sendMessage();

    echo json_encode($resultMessages);
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
