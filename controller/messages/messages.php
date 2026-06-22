<?php
class Messages {
  public function handleMessages(){

    $input = file_get_contents('php://input');
    $data  = json_decode($input, true);

    switch ($data["action"] ?? null) {

      case 'get_data_messages':
        $this->getDataMessages($data);
        break;
        case 'save_messages':
          $this->saveMessages($data);
          break;


      default:
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['response' => false, 'error' => 'Unsupported action']);
        break;
    }
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

$messagesClass = new Messages(); // instancia
$messagesClass->handleMessages();
