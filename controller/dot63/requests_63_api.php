<?php

class Resques63API
{
    private $dot63WebhookUrl = "https://promoflow.net/dot63/controller/promoflow/promoflow_webhook.php";

    public function handleResques63API()
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
            case 'get_API_overview_data':
                $this->getAPIOverviewData();
                break;

            case 'get_preview_product_details':
                $this->getPreviewProductDetails($data);
                break;

            case 'approve_product':
                $this->approveProduct($data);
                break;

            case 'publish_product':
                $this->publishProduct($data);
                break;

            case 'get_variation_children_by_id':
                $this->getVariationChildrenById($data);
                break;

            case 'get_variation_prices':
                $this->getVariationPrices($data);
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

    private function sendToDot63($payload)
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

    private function getAPIOverviewData()
    {
        $payload = [
            "action" => "get_API_overview_data"
        ];

        $this->sendToDot63($payload);
    }

    private function approveProduct($data)
    {
        if (empty($data["sku"])) {
            echo json_encode([
                'success' => false,
                'message' => 'SKU is missing.'
            ]);
            exit;
        }

        $payload = [
            "action" => "approve_product",
            "sku" => $data["sku"]
        ];

        $this->sendToDot63($payload);
    }

    private function publishProduct($data)
    {
        if (empty($data["sku"])) {
            echo json_encode([
                'success' => false,
                'message' => 'SKU is missing.'
            ]);
            exit;
        }

        $payload = [
            "action" => "publish_product",
            "sku" => $data["sku"]
        ];

        $this->sendToDot63($payload);
    }

    private function getPreviewProductDetails($data)
    {
        if (empty($data["sku"])) {
            echo json_encode([
                'success' => false,
                'message' => 'SKU is missing.'
            ]);
            exit;
        }

        $payload = [
            "action" => "get_preview_product_details",
            "sku" => $data["sku"]
        ];

        $this->sendToDot63($payload);
    }

    private function getVariationChildrenById($data)
    {
        if (empty($data["variation_id"])) {
            echo json_encode([
                'success' => false,
                'message' => 'Variation ID is missing.'
            ]);
            exit;
        }

        $payload = [
            "action" => "get_variation_children_by_id",
            "variation_id" => $data["variation_id"]
        ];

        $this->sendToDot63($payload);
    }

    private function getVariationPrices($data)
    {
        if (empty($data["ids"]) || !is_array($data["ids"])) {
            echo json_encode([
                'success' => false,
                'message' => 'Variation IDs are missing.'
            ]);
            exit;
        }

        $payload = [
            "action" => "get_variation_prices",
            "ids" => $data["ids"],
            "max_quantity" => $data["max_quantity"] ?? null
        ];

        $this->sendToDot63($payload);
    }
}

$payload = json_decode(file_get_contents("php://input"), true);

if (is_array($payload)) {
    $apiHandler = new Resques63API();
    $apiHandler->handleResques63API();
} else {
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode([
        'success' => false,
        'error' => 'No valid payload received.'
    ]);

    exit;
}

?>
