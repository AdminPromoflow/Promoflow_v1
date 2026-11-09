<?php

class Resques63API
{
    private $dot63WebhookUrl = "https://promoflow.net/dot63/controller/promoflow/promoflow_webhook.php";

    private $approvalSessionCookie = '';
    private $approvalCsrfToken = '';

    public function __construct()
    {
        $configured = trim((string)getenv('DOT63_WEBHOOK_URL'));
        if ($configured !== '') {
            $this->dot63WebhookUrl = $configured;
        } elseif (in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1', '::1'], true)) {
            $port = (int)($_SERVER['SERVER_PORT'] ?? 80);
            $this->dot63WebhookUrl = 'http://127.0.0.1' . ($port === 80 ? '' : ':' . $port)
                . '/Dot63_v1/controller/promoflow/promoflow_webhook.php';
        }
    }

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

        // This is an internal API: every forwarded action requires a Promoflow session.
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST'
            || stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
            http_response_code(415);
            echo json_encode(['success' => false, 'message' => 'A JSON POST request is required.']);
            exit;
        }
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            $origin = parse_url($_SERVER['HTTP_ORIGIN']);
            $scheme = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
            $expected = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? '');
            if (rtrim($_SERVER['HTTP_ORIGIN'], '/') !== $expected) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Cross-origin requests are not allowed.']);
                exit;
            }
        }
        if (session_status() !== PHP_SESSION_ACTIVE) session_start();
        if (($_SESSION['is_logged'] ?? false) !== true || empty($_SESSION['user_email'])) {
            session_write_close();
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Sign in to Promoflow to use this API.']);
            exit;
        }
        if (empty($_SESSION['dot63_csrf_token'])) $_SESSION['dot63_csrf_token'] = bin2hex(random_bytes(32));
        $this->approvalCsrfToken = $_SESSION['dot63_csrf_token'];
        $this->approvalSessionCookie = session_name() . '=' . rawurlencode(session_id());
        session_write_close();

        switch ($data["action"] ?? null) {
            case 'get_review_preview':
            case 'get_review_variation_children':
            case 'get_review_variation_prices':
                $this->sendToDot63(array_intersect_key($data, array_flip(['action', 'sku', 'variation_id', 'ids', 'quantity'])));
                break;

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

    public function sendToDot63($payload)
    {
        $ch = curl_init($this->dot63WebhookUrl);

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json; charset=utf-8',
                'X-Dot63-CSRF-Token: ' . $this->approvalCsrfToken,
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_TIMEOUT => 20,
        ]);

        if ($this->approvalSessionCookie !== '') curl_setopt($ch, CURLOPT_COOKIE, $this->approvalSessionCookie);
        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if ($response === false || !empty($curlError)) {
            http_response_code(502);
            echo json_encode([
                'success' => false,
                'error' => 'Could not connect to DOT63 API.',
                'curl_error' => $curlError
            ]);
            exit;
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            http_response_code($httpCode >= 400 && $httpCode <= 599 ? $httpCode : 502);
            $error = json_decode((string)$response, true);
            echo json_encode(['success' => false, 'message' => $error['message'] ?? $error['error'] ?? 'DOT63 API could not process the request.']);
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
            "sku" => $data["sku"],
            "status_request_version" => $data["status_request_version"] ?? null,
            "requested_status" => $data["requested_status"] ?? null
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
            "sku" => $data["sku"],
            "status_request_version" => $data["status_request_version"] ?? null,
            "requested_status" => $data["requested_status"] ?? null
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
