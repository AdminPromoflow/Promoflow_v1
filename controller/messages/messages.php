<?php
class Messages {

  private $dot63WebhookUrl = "https://promoflow.net/dot63/controller/promoflow/promoflow_webhook.php";

  public function handleMessages(){


    $input = file_get_contents('php://input');
    $data  = json_decode($input, true);


    switch ($data["action"] ?? null) {

      case 'get_data_messages':
        $this->getDataMessages($data);
        break;

      case 'get_suppliers':
        $this->getSuppliers($data);
        break;

      case 'save_messages':
        $this->saveMessages($data);
        break;

      case 'create_case':
        $this->createCase($data);
        break;

      case 'get_cases':
        $this->getCases($data);
        break;

      case 'get_cases_and_messages':
        $this->getCasesAndMessages($data);
        break;


      default:
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['response' => false, 'error' => 'Unsupported action']);
        break;
    }
  }


  private function getCasesAndMessages($data) {
    header('Content-Type: application/json; charset=utf-8');

    $connection = new Database();
    $message = new Message($connection);

    $message->setIdCase($data["caseId"]);

    $resultMessages = $message->getCasesAndMessages();

    echo json_encode($resultMessages);
    exit;
  }

  private function getCases($data) {
    header('Content-Type: application/json; charset=utf-8');

    $connection = new Database();
    $message = new Message($connection);


    $result = $message->getCases();

    echo json_encode($result);
    exit;
  }

  private function createCase($data) {
    header('Content-Type: application/json; charset=utf-8');


    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // save global session variables
    $email = $_SESSION['user_email'];

    $connection = new Database();
    $user = new Users($connection);
    $user->setEmail($email ?? '');
    $idUser = $user->getIdUserByEmail();

    $idSupplier = $data["supplierId"];
    $name = $data["caseName"];

    date_default_timezone_set("Europe/London");
    $datetime = date("Y-m-d H:i:s");

    $updateAt = date("Y-m-d H:i:s");




    $connection = new Database();
    $message = new Message($connection);

    $message->setIdAdmin($idUser ?? '');
    $message->setIdSupplier($idSupplier ?? '');
    $message->setName($name ?? '');
    $message->setStatus("open");
    $message->setCreatedAt($datetime ?? '');
    $message->setUpdatedAt($updateAt ?? '');

    $result = $message->saveCase();


    echo json_encode($result);
    exit;

  }

  private function getSuppliers($data) {

    $payload = [
        "action" => "get_suppliers"
    ];

    $this->sendToDot63($payload);
  }


  public function sendToDot63($payload)
  {
      $ch = curl_init($this->dot63WebhookUrl);

      curl_setopt_array($ch, [
          CURLOPT_POST => true,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_HTTPHEADER => [
              'Content-Type: application/json; charset=utf-8',
          ],
          CURLOPT_POSTFIELDS => json_encode($payload),
          CURLOPT_TIMEOUT => 20,
      ]);

      $response = curl_exec($ch);
      $curlError = curl_error($ch);
      $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

      curl_close($ch);

      if ($response === false || !empty($curlError)) {
          echo json_encode([
              'success' => false,
              'error' => 'Could not connect to DOT63 API.',
              'curl_error' => $curlError
          ]);
          exit;
      }

      if ($httpCode < 200 || $httpCode >= 300) {
          echo json_encode([
              'success' => false,
              'error' => 'DOT63 API returned an invalid HTTP response.',
              'http_code' => $httpCode,
              'response' => $response
          ]);
          exit;
      }

      echo $response;
      exit;
  }

  private function getDataMessages($data) {
    header('Content-Type: application/json; charset=utf-8');

    $connection = new Database();
    $message = new Message($connection);

    $result = $message->getMessages();

    echo json_encode($result);
    exit;
  }
  private function saveMessages($data) {

    $connection = new Database();

    $message = new Message($connection);

    $message->setNameCase("Approval request: SKU PRD-20251211");
    $message->setUser1("ian@kan-do-it.com");
    $message->setUser2("aleinarossui@gmail.com");
    $message->setMessage($data['message'] ?? '');


    $result = $message->saveMessages();
    echo json_encode($result);
  }


}

include "../../controller/config/database.php";
include "../../model/message.php";
include "../../model/promoflow/user.php";

$messagesClass = new Messages(); // instancia
$messagesClass->handleMessages();
