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
    // $connection = new Database();
    // $user = new Users($connection);
    //
    // $result = $user->getAllUsers();
    //
    // echo json_encode($result);
    // exit;
    echo json_encode("hola Cases and Messages");
     exit;
  }
  private function getCases($data)
  {
    // $connection = new Database();
    // $user = new Users($connection);
    //
    // $result = $user->getAllUsers();
    //
    // echo json_encode($result);
    // exit;
    echo json_encode("hola solo Cases");
     exit;
  }
}

include "../../controller/config/database.php";

// include "../../model/products.php";
// include "../../model/users.php";
// include "../../model/categories.php";
// include "../../model/groups.php";
// include "../../model/variations.php";
// include "../../model/prices.php";
//
// include "../../controller/products/variations.php";
// include "../../controller/emails/emails_sender.php";

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
