<?php

class Resques63API{
  public function handleResques63API(){
    $input = file_get_contents('php://input');
    $data  = json_decode($input, true);

    switch ($data["action"] ?? null) {
      case 'get_API_overview_data':
        $this->getAPIOverviewData();
        break;

      default:
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['response' => false, 'error' => 'Unsupported action']);
        break;
    }

  }

  private function getAPIOverviewData(){
    $url = "https://promoflow.net/dot63/controller/webhook/requestAPIProductDetails.php";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
  }

}

if ($payload = (json_decode(file_get_contents("php://input"), true) ?? [])) {
  $apiHandler = new Resques63API();
  $apiHandler->handleResques63API();
}


/*$url = "https://tudominio.com/receiver.php"; // <-- cambia esta URL

$payload = ['action' => 'get_small_json'];

$ch = curl_init($url);
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json; charset=utf-8'],
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_TIMEOUT => 20
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP: $httpCode\n";
echo $response;*/
?>
