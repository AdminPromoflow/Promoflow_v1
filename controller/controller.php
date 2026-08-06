<?php

/**
 * Send a JSON response without exposing internal server details.
 */
function ullman_send_json_response($payload, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');

    $json = json_encode(
        $payload,
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );

    if ($json === false) {
        http_response_code(500);
        $json = '{"success":false,"message":"Unable to create the server response."}';
    }

    echo $json;
}

/**
 * Apply the CORS policy before loading any file that could produce output.
 */
function ullman_apply_cors_policy() {
    $allowedOrigins = array(
        'https://aleinarossui.com',
        'https://www.aleinarossui.com'
    );

    $origin = isset($_SERVER['HTTP_ORIGIN'])
        ? rtrim($_SERVER['HTTP_ORIGIN'], '/')
        : '';

    $requestMethod = isset($_SERVER['REQUEST_METHOD'])
        ? strtoupper($_SERVER['REQUEST_METHOD'])
        : '';

    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if ($origin === '' || !in_array($origin, $allowedOrigins, true)) {
        ullman_send_json_response(array(
            'success' => false,
            'message' => 'Origin not allowed.'
        ), 403);
        exit;
    }

    header('Access-Control-Allow-Origin: ' . $origin);

    if ($requestMethod === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

$ullmanStandaloneRequest = !defined('ABSPATH');

if ($ullmanStandaloneRequest) {
    // Keep PHP warnings/notices out of API responses while still logging them.
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    error_reporting(E_ALL);

    ullman_apply_cors_policy();
}

class ApiHandlerSendForms {

    private $requestData = array();

    public function handleRequest() {
        header('Content-Type: application/json; charset=UTF-8');

        $requestMethod = isset($_SERVER['REQUEST_METHOD'])
            ? strtoupper($_SERVER['REQUEST_METHOD'])
            : '';

        if ($requestMethod !== 'POST') {
            ullman_send_json_response(array(
                'success' => false,
                'message' => 'Method not allowed.'
            ), 405);
            return;
        }

        $this->requestData = $this->getRequestData();

        $action = isset($this->requestData['action'])
            ? $this->requestData['action']
            : null;

        /*
         * Compatibility with the existing WordPress JavaScript:
         * it changes action to "ullman_send_forms" and preserves the real
         * form action inside "form_action" before submitting the FormData.
         */
        if (
            $action === 'ullman_send_forms' &&
            isset($this->requestData['form_action']) &&
            $this->requestData['form_action'] !== ''
        ) {
            $action = $this->requestData['form_action'];
            $this->requestData['action'] = $action;
        }

        if ($action === null || $action === '') {
            ullman_send_json_response(array(
                'success' => false,
                'message' => 'Missing action.'
            ), 400);
            return;
        }

        switch ($action) {
            case 'send_emal_contact_us':
                $this->handleContactUs();
                break;

            case 'send_new_sail_quote':
                $this->handleNewSailQuote();
                break;

            case 'send_new_cover_quote':
                $this->handleNewCoverQuote();
                break;

            case 'send_new_repair_quote':
                $this->handleNewRepairQuote();
                break;

            case 'submit_customize_form':
                $this->handleCustomizeSailForm();
                break;

            default:
                ullman_send_json_response(array(
                    'success' => false,
                    'message' => 'Unknown action.'
                ), 400);
                break;
        }
    }

    private function getRequestData() {
        $contentType = isset($_SERVER['CONTENT_TYPE'])
            ? $_SERVER['CONTENT_TYPE']
            : '';

        if (stripos($contentType, 'application/json') !== false) {
            $input = file_get_contents('php://input');
            $jsonData = json_decode($input, true);

            if (is_array($jsonData)) {
                return $jsonData;
            }

            return array();
        }

        // Browser FormData arrives here as multipart/form-data in $_POST.
        return $_POST;
    }

    private function sendEmailResult($emailResult) {
        /*
         * Preserve the result produced by EmailSender when it already returns
         * an array/object. Normalize primitive values so the frontend always
         * receives a JSON object with success and message fields.
         */
        if (is_array($emailResult) || is_object($emailResult)) {
            ullman_send_json_response($emailResult);
            return;
        }

        if (is_bool($emailResult)) {
            ullman_send_json_response(array(
                'success' => $emailResult,
                'message' => $emailResult
                    ? 'Message sent successfully.'
                    : 'Unable to send your message.'
            ));
            return;
        }

        ullman_send_json_response(array(
            'success' => false,
            'message' => 'Unable to send your message.'
        ), 500);
    }

    private function handleContactUs() {
        $contactName = isset($this->requestData['contactName']) ? $this->requestData['contactName'] : null;
        $contactNumber = isset($this->requestData['contactNumber']) ? $this->requestData['contactNumber'] : null;
        $contactLocation = isset($this->requestData['contactLocation']) ? $this->requestData['contactLocation'] : null;
        $contactEmail = isset($this->requestData['contactEmail']) ? $this->requestData['contactEmail'] : null;
        $contactMessage = isset($this->requestData['contactMessage']) ? $this->requestData['contactMessage'] : null;

        $file = isset($_FILES['file']) ? $_FILES['file'] : null;

        $data = (object) array(
            'action' => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            'contactName' => $contactName,
            'contactNumber' => $contactNumber,
            'contactLocation' => $contactLocation,
            'contactEmail' => $contactEmail,
            'contactMessage' => $contactMessage,
            'file' => $file
        );

        $emailSender = new EmailSender();
        $emailSent = $emailSender->sendEmailContactUs($data);

        $this->sendEmailResult($emailSent);
    }

    private function handleNewCoverQuote() {
        $firstName = isset($this->requestData['first_name']) ? $this->requestData['first_name'] : null;
        $lastName = isset($this->requestData['last_name']) ? $this->requestData['last_name'] : null;
        $email = isset($this->requestData['email']) ? $this->requestData['email'] : null;
        $phone = isset($this->requestData['phone']) ? $this->requestData['phone'] : null;
        $address1 = isset($this->requestData['address_1']) ? $this->requestData['address_1'] : null;
        $address2 = isset($this->requestData['address_2']) ? $this->requestData['address_2'] : null;
        $city = isset($this->requestData['city']) ? $this->requestData['city'] : null;
        $postcode = isset($this->requestData['postcode']) ? $this->requestData['postcode'] : null;
        $contactByPhone = isset($this->requestData['contact_by_phone']) ? $this->requestData['contact_by_phone'] : '0';
        $contactByEmail = isset($this->requestData['contact_by_email']) ? $this->requestData['contact_by_email'] : '0';
        $boatType = isset($this->requestData['boat_type']) ? $this->requestData['boat_type'] : null;
        $sailType = isset($this->requestData['sail_type']) ? $this->requestData['sail_type'] : null;
        $boatLocation = isset($this->requestData['boat_location']) ? $this->requestData['boat_location'] : null;
        $additionalInfo = isset($this->requestData['additional_info']) ? $this->requestData['additional_info'] : null;
        $newsletter = isset($this->requestData['newsletter']) ? $this->requestData['newsletter'] : '0';

        $data = (object) array(
            'action' => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'phone' => $phone,
            'address_1' => $address1,
            'address_2' => $address2,
            'city' => $city,
            'postcode' => $postcode,
            'contact_by_phone' => $contactByPhone,
            'contact_by_email' => $contactByEmail,
            'boat_type' => $boatType,
            'sail_type' => $sailType,
            'boat_location' => $boatLocation,
            'additional_info' => $additionalInfo,
            'newsletter' => $newsletter
        );

        $emailSender = new EmailSender();
        $emailSent = $emailSender->sendNewCoverQuote($data);

        $this->sendEmailResult($emailSent);
    }

    private function handleNewRepairQuote() {
        $firstName = isset($this->requestData['first_name']) ? $this->requestData['first_name'] : null;
        $lastName = isset($this->requestData['last_name']) ? $this->requestData['last_name'] : null;
        $email = isset($this->requestData['email']) ? $this->requestData['email'] : null;
        $phone = isset($this->requestData['phone']) ? $this->requestData['phone'] : null;
        $address1 = isset($this->requestData['address_1']) ? $this->requestData['address_1'] : null;
        $address2 = isset($this->requestData['address_2']) ? $this->requestData['address_2'] : null;
        $city = isset($this->requestData['city']) ? $this->requestData['city'] : null;
        $postcode = isset($this->requestData['postcode']) ? $this->requestData['postcode'] : null;
        $contactByPhone = isset($this->requestData['contact_by_phone']) ? $this->requestData['contact_by_phone'] : '0';
        $contactByEmail = isset($this->requestData['contact_by_email']) ? $this->requestData['contact_by_email'] : '0';
        $boatType = isset($this->requestData['boat_type']) ? $this->requestData['boat_type'] : null;
        $boatName = isset($this->requestData['boat_name']) ? $this->requestData['boat_name'] : null;
        $sailType = isset($this->requestData['sail_type']) ? $this->requestData['sail_type'] : null;
        $workLaundry = isset($this->requestData['work_laundry']) ? $this->requestData['work_laundry'] : '0';
        $workService = isset($this->requestData['work_service']) ? $this->requestData['work_service'] : '0';
        $workRepair = isset($this->requestData['work_repair']) ? $this->requestData['work_repair'] : '0';
        $workDetails = isset($this->requestData['work_details']) ? $this->requestData['work_details'] : null;
        $boatLocation = isset($this->requestData['boat_location']) ? $this->requestData['boat_location'] : null;
        $collectionDelivery = isset($this->requestData['collection_delivery']) ? $this->requestData['collection_delivery'] : null;
        $newsletter = isset($this->requestData['newsletter']) ? $this->requestData['newsletter'] : '0';

        $data = (object) array(
            'action' => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'phone' => $phone,
            'address_1' => $address1,
            'address_2' => $address2,
            'city' => $city,
            'postcode' => $postcode,
            'contact_by_phone' => $contactByPhone,
            'contact_by_email' => $contactByEmail,
            'boat_type' => $boatType,
            'boat_name' => $boatName,
            'sail_type' => $sailType,
            'work_laundry' => $workLaundry,
            'work_service' => $workService,
            'work_repair' => $workRepair,
            'work_details' => $workDetails,
            'boat_location' => $boatLocation,
            'collection_delivery' => $collectionDelivery,
            'newsletter' => $newsletter
        );

        $emailSender = new EmailSender();
        $emailSent = $emailSender->sendNewRepairQuote($data);

        $this->sendEmailResult($emailSent);
    }

    private function handleNewSailQuote() {
        $firstName = isset($this->requestData['first_name']) ? $this->requestData['first_name'] : null;
        $lastName = isset($this->requestData['last_name']) ? $this->requestData['last_name'] : null;
        $email = isset($this->requestData['email']) ? $this->requestData['email'] : null;
        $phone = isset($this->requestData['phone']) ? $this->requestData['phone'] : null;
        $address1 = isset($this->requestData['address_1']) ? $this->requestData['address_1'] : null;
        $address2 = isset($this->requestData['address_2']) ? $this->requestData['address_2'] : null;
        $city = isset($this->requestData['city']) ? $this->requestData['city'] : null;
        $postcode = isset($this->requestData['postcode']) ? $this->requestData['postcode'] : null;
        $contactByPhone = isset($this->requestData['contact_by_phone']) ? $this->requestData['contact_by_phone'] : '0';
        $contactByEmail = isset($this->requestData['contact_by_email']) ? $this->requestData['contact_by_email'] : '0';
        $boatType = isset($this->requestData['boat_type']) ? $this->requestData['boat_type'] : null;
        $sailType = isset($this->requestData['sail_type']) ? $this->requestData['sail_type'] : null;
        $sailUseRacing = isset($this->requestData['sail_use_racing']) ? $this->requestData['sail_use_racing'] : '0';
        $sailUseCruising = isset($this->requestData['sail_use_cruising']) ? $this->requestData['sail_use_cruising'] : '0';
        $boatLocation = isset($this->requestData['boat_location']) ? $this->requestData['boat_location'] : null;
        $additionalInfo = isset($this->requestData['additional_info']) ? $this->requestData['additional_info'] : null;
        $newsletter = isset($this->requestData['newsletter']) ? $this->requestData['newsletter'] : '0';

        $data = (object) array(
            'action' => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'phone' => $phone,
            'address_1' => $address1,
            'address_2' => $address2,
            'city' => $city,
            'postcode' => $postcode,
            'contact_by_phone' => $contactByPhone,
            'contact_by_email' => $contactByEmail,
            'boat_type' => $boatType,
            'sail_type' => $sailType,
            'sail_use_racing' => $sailUseRacing,
            'sail_use_cruising' => $sailUseCruising,
            'boat_location' => $boatLocation,
            'additional_info' => $additionalInfo,
            'newsletter' => $newsletter
        );

        $emailSender = new EmailSender();
        $emailSent = $emailSender->sendNewSailQuote($data);

        $this->sendEmailResult($emailSent);
    }

    private function handleCustomizeSailForm() {
        $name = isset($this->requestData['name']) ? $this->requestData['name'] : null;
        $email = isset($this->requestData['email']) ? $this->requestData['email'] : null;
        $salespersonEmail = isset($this->requestData['salesperson_email']) ? $this->requestData['salesperson_email'] : null;
        $boatName = isset($this->requestData['boat_name']) ? $this->requestData['boat_name'] : null;
        $boatDesignLength = isset($this->requestData['boat_design_length']) ? $this->requestData['boat_design_length'] : null;
        $sailType = isset($this->requestData['sail_type']) ? $this->requestData['sail_type'] : null;
        $clothWeight = isset($this->requestData['cloth_weight']) ? $this->requestData['cloth_weight'] : null;
        $pdfBase64 = isset($this->requestData['pdf_base64']) ? $this->requestData['pdf_base64'] : null;

        if (
            empty($name) ||
            empty($email) ||
            empty($salespersonEmail) ||
            empty($boatName) ||
            empty($boatDesignLength) ||
            empty($sailType) ||
            empty($clothWeight) ||
            empty($pdfBase64)
        ) {
            ullman_send_json_response(array(
                'success' => false,
                'message' => 'Missing required fields.'
            ), 400);
            return;
        }

        $data = (object) array(
            'action' => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            'name' => $name,
            'email' => $email,
            'salesperson_email' => $salespersonEmail,
            'boat_name' => $boatName,
            'boat_design_length' => $boatDesignLength,
            'sail_type' => $sailType,
            'cloth_weight' => $clothWeight,
            'pdf_base64' => $pdfBase64
        );

        $emailSender = new EmailSender();
        $emailSent = $emailSender->sendCustomizeSailForm($data);

        $this->sendEmailResult($emailSent);
    }
}

require_once __DIR__ . '/send_emails.php';

if ($ullmanStandaloneRequest) {
    try {
        $apiHandlerSendForms = new ApiHandlerSendForms();
        $apiHandlerSendForms->handleRequest();
    } catch (Throwable $error) {
        error_log('Ullman forms endpoint error: ' . $error->getMessage());

        ullman_send_json_response(array(
            'success' => false,
            'message' => 'An internal server error occurred.'
        ), 500);
    }
}
