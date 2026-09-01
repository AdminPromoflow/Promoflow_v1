<?php

/**
 * Promoflow webhook for Ullman Sails forms.
 *
 * Copy this file to:
 * https://www.promoflow.net/controller/controller.php
 *
 * The existing send_emails.php file and its PHPMailer dependencies must remain
 * inside the same /controller directory on Promoflow.
 *
 * Configure the same token used by Ullman Sails through the server environment,
 * or uncomment the line immediately below and replace its placeholder.
 */

// define('ULLMAN_PROMOFLOW_WEBHOOK_TOKEN', 'PASTE_THE_SAME_32+_CHARACTER_TOKEN_HERE');
require_once __DIR__ . '/includes/emails-config.php';
require_once __DIR__ . '/send_emails.php';
require_once __DIR__ . '/config/config_ullman_sails.php';
require_once dirname(__DIR__) . '/model/ullman_sails/user.php';

function ullman_webhook_send_json($payload, $statusCode = 200)
{
    http_response_code((int) $statusCode);
    header('Content-Type: application/json; charset=UTF-8');

    $json = json_encode(
        $payload,
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );

    echo $json !== false
        ? $json
        : '{"success":false,"message":"Unable to create the server response."}';
}

function ullman_webhook_get_token()
{
    if (defined('ULLMAN_PROMOFLOW_WEBHOOK_TOKEN')) {
        return (string) constant('ULLMAN_PROMOFLOW_WEBHOOK_TOKEN');
    }

    $environmentToken = getenv('ULLMAN_PROMOFLOW_WEBHOOK_TOKEN');

    return is_string($environmentToken) ? $environmentToken : '';
}

function ullman_webhook_authorize_request()
{
    $expectedToken = ullman_webhook_get_token();
    $receivedToken = isset($_SERVER['HTTP_X_ULLMAN_WEBHOOK_TOKEN'])
        ? (string) $_SERVER['HTTP_X_ULLMAN_WEBHOOK_TOKEN']
        : '';

    if (
        strlen($expectedToken) < 32
        || $receivedToken === ''
        || !hash_equals($expectedToken, $receivedToken)
    ) {
        ullman_webhook_send_json(array(
            'success' => false,
            'message' => 'Unauthorized request.'
        ), 401);
        exit;
    }
}

class PromoflowUllmanFormsWebhook
{
    private $requestData = array();
    private $maxAttachmentBytes = 10485760; // 10 MB after base64 decoding.
    private $responseStatusCode = 200;

    public function handleRequest()
    {
        $requestMethod = isset($_SERVER['REQUEST_METHOD'])
            ? strtoupper($_SERVER['REQUEST_METHOD'])
            : '';

        if ($requestMethod !== 'POST') {
            ullman_webhook_send_json(array(
                'success' => false,
                'message' => 'Method not allowed.'
            ), 405);
            return;
        }

        ullman_webhook_authorize_request();

        $contentType = isset($_SERVER['CONTENT_TYPE'])
            ? (string) $_SERVER['CONTENT_TYPE']
            : '';

        if (stripos($contentType, 'application/json') === false) {
            ullman_webhook_send_json(array(
                'success' => false,
                'message' => 'Content-Type must be application/json.'
            ), 415);
            return;
        }

        $contentLength = isset($_SERVER['CONTENT_LENGTH'])
            ? (int) $_SERVER['CONTENT_LENGTH']
            : 0;

        if ($contentLength > 20971520) {
            ullman_webhook_send_json(array(
                'success' => false,
                'message' => 'The request is too large.'
            ), 413);
            return;
        }

        $input = file_get_contents('php://input');
        $this->requestData = json_decode($input, true);

        if (!is_array($this->requestData)) {
            ullman_webhook_send_json(array(
                'success' => false,
                'message' => 'Invalid JSON payload.'
            ), 400);
            return;
        }

        if (($this->requestData['source'] ?? '') !== 'ullman_sails') {
            ullman_webhook_send_json(array(
                'success' => false,
                'message' => 'Invalid request source.'
            ), 400);
            return;
        }

        $action = isset($this->requestData['action'])
            ? (string) $this->requestData['action']
            : '';

        $this->debugBreakpoint('promoflow_received', array(
            'action' => $action,
            'source' => isset($this->requestData['source'])
                ? (string) $this->requestData['source']
                : '',
            'email' => isset($this->requestData['email'])
                ? (string) $this->requestData['email']
                : '',
            'password_present' => !empty($this->requestData['password'])
        ));

        switch ($action) {
            case 'login':
                $this->debugBreakpoint('promoflow_before_login', array(
                    'action' => $action,
                    'login_function' => 'login'
                ));
                $response = $this->login();
                ullman_webhook_send_json($response, $this->responseStatusCode);
                break;

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
                ullman_webhook_send_json(array(
                    'success' => false,
                    'message' => $action === '' ? 'Missing action.' : 'Unknown action.'
                ), 400);
                break;
        }
    }

    private function login()
    {
        $email = trim((string) $this->value('email', ''));
        $password = (string) $this->value('password', '');

        if ($email === '' || $password === '') {
            $this->responseStatusCode = 400;

            return array(
                'success' => false,
                'message' => 'Invalid credentials'
            );
        }

        $connection = null;
        $debugStep = (string) $this->value('debug_step', '');

        try {
            $this->debugBreakpoint('promoflow_before_database', array(
                'email' => $email,
                'connection_class' => 'DatabaseUllmanSails',
                'model_class' => 'UllmanSailsUser'
            ));

            $connection = new DatabaseUllmanSails();
            $user = new UllmanSailsUser($connection);
            $user->setEmail($email);

            $response = $user->loginUserUllmanSails($password, $debugStep);

            $this->debugBreakpoint('promoflow_after_model', array(
                'response' => $response
            ));

            $this->responseStatusCode = !empty($response['success']) ? 200 : 401;

            return $response;
        } catch (Throwable $error) {
            error_log('Ullman Sails authentication error: ' . $error->getMessage());
            $this->responseStatusCode = 500;

            return array(
                'success' => false,
                'message' => 'Unable to authenticate at this time.'
            );
        } finally {
            if ($connection instanceof DatabaseUllmanSails) {
                $connection->closeConnection();
            }
        }
    }

    private function debugBreakpoint($stage, $data)
    {
        if (
            !defined('ULLMAN_LOGIN_DEBUG')
            || constant('ULLMAN_LOGIN_DEBUG') !== true
        ) {
            return;
        }

        $requestedStage = isset($this->requestData['debug_step'])
            ? (string) $this->requestData['debug_step']
            : '';

        if ($requestedStage !== $stage) {
            return;
        }

        ullman_webhook_send_json(array(
            'success' => false,
            'debug' => true,
            'stage' => $stage,
            'message' => 'Login breakpoint reached.',
            'data' => $data
        ));
        exit;
    }

    private function value($key, $default = null)
    {
        return array_key_exists($key, $this->requestData)
            ? $this->requestData[$key]
            : $default;
    }

    private function makeDataObject($fields)
    {
        $data = array('action' => $this->value('action'));

        foreach ($fields as $field => $default) {
            $data[$field] = $this->value($field, $default);
        }

        return (object) $data;
    }

    private function sendEmailResult($emailResult)
    {
        if (is_array($emailResult) || is_object($emailResult)) {
            ullman_webhook_send_json($emailResult);
            return;
        }

        if (is_bool($emailResult)) {
            ullman_webhook_send_json(array(
                'success' => $emailResult,
                'message' => $emailResult
                    ? 'Message sent successfully.'
                    : 'Unable to send your message.'
            ), $emailResult ? 200 : 500);
            return;
        }

        ullman_webhook_send_json(array(
            'success' => false,
            'message' => 'Unable to send your message.'
        ), 500);
    }

    private function createTemporaryAttachment($filePayload)
    {
        if (!is_array($filePayload) || empty($filePayload['content_base64'])) {
            return null;
        }

        $decodedFile = base64_decode((string) $filePayload['content_base64'], true);

        if (
            $decodedFile === false
            || strlen($decodedFile) === 0
            || strlen($decodedFile) > $this->maxAttachmentBytes
        ) {
            throw new RuntimeException('The attachment is invalid or too large.');
        }

        $temporaryPath = tempnam(sys_get_temp_dir(), 'ullman_');

        if ($temporaryPath === false) {
            throw new RuntimeException('The attachment could not be prepared.');
        }

        if (file_put_contents($temporaryPath, $decodedFile) === false) {
            @unlink($temporaryPath);
            throw new RuntimeException('The attachment could not be stored.');
        }

        return array(
            'name' => !empty($filePayload['name'])
                ? basename((string) $filePayload['name'])
                : 'attachment',
            'type' => !empty($filePayload['type'])
                ? (string) $filePayload['type']
                : 'application/octet-stream',
            'tmp_name' => $temporaryPath,
            'error' => UPLOAD_ERR_OK,
            'size' => strlen($decodedFile)
        );
    }

    private function handleContactUs()
    {
        $temporaryFile = null;

        try {
            $temporaryFile = $this->createTemporaryAttachment($this->value('file'));

            $data = $this->makeDataObject(array(
                'contactName' => null,
                'contactNumber' => null,
                'contactLocation' => null,
                'contactEmail' => null,
                'contactMessage' => null
            ));

            $data->file = $temporaryFile;

            $emailSender = new EmailSender();
            $this->sendEmailResult($emailSender->sendEmailContactUs($data));
        } finally {
            if (
                is_array($temporaryFile)
                && !empty($temporaryFile['tmp_name'])
                && is_file($temporaryFile['tmp_name'])
            ) {
                @unlink($temporaryFile['tmp_name']);
            }
        }
    }

    private function handleNewCoverQuote()
    {
        $data = $this->makeDataObject(array(
            'first_name' => null,
            'last_name' => null,
            'email' => null,
            'phone' => null,
            'address_1' => null,
            'address_2' => null,
            'city' => null,
            'postcode' => null,
            'contact_by_phone' => '0',
            'contact_by_email' => '0',
            'boat_type' => null,
            'sail_type' => null,
            'boat_location' => null,
            'additional_info' => null,
            'newsletter' => '0'
        ));

        $emailSender = new EmailSender();
        $this->sendEmailResult($emailSender->sendNewCoverQuote($data));
    }

    private function handleNewRepairQuote()
    {
        $data = $this->makeDataObject(array(
            'first_name' => null,
            'last_name' => null,
            'email' => null,
            'phone' => null,
            'address_1' => null,
            'address_2' => null,
            'city' => null,
            'postcode' => null,
            'contact_by_phone' => '0',
            'contact_by_email' => '0',
            'boat_type' => null,
            'boat_name' => null,
            'sail_type' => null,
            'work_laundry' => '0',
            'work_service' => '0',
            'work_repair' => '0',
            'work_details' => null,
            'boat_location' => null,
            'collection_delivery' => null,
            'newsletter' => '0'
        ));

        $emailSender = new EmailSender();
        $this->sendEmailResult($emailSender->sendNewRepairQuote($data));
    }

    private function handleNewSailQuote()
    {
        $data = $this->makeDataObject(array(
            'first_name' => null,
            'last_name' => null,
            'email' => null,
            'phone' => null,
            'address_1' => null,
            'address_2' => null,
            'city' => null,
            'postcode' => null,
            'contact_by_phone' => '0',
            'contact_by_email' => '0',
            'boat_type' => null,
            'sail_type' => null,
            'sail_use_racing' => '0',
            'sail_use_cruising' => '0',
            'boat_location' => null,
            'additional_info' => null,
            'newsletter' => '0'
        ));

        $emailSender = new EmailSender();
        $this->sendEmailResult($emailSender->sendNewSailQuote($data));
    }

    private function handleCustomizeSailForm()
    {
        $requiredFields = array(
            'name',
            'email',
            'salesperson_email',
            'boat_name',
            'boat_design_length',
            'sail_type',
            'cloth_weight',
            'pdf_base64'
        );

        foreach ($requiredFields as $requiredField) {
            if ($this->value($requiredField, '') === '') {
                ullman_webhook_send_json(array(
                    'success' => false,
                    'message' => 'Missing required fields.'
                ), 400);
                return;
            }
        }

        $data = $this->makeDataObject(array(
            'name' => null,
            'email' => null,
            'salesperson_email' => null,
            'boat_name' => null,
            'boat_design_length' => null,
            'sail_type' => null,
            'cloth_weight' => null,
            'pdf_base64' => null
        ));

        $emailSender = new EmailSender();
        $this->sendEmailResult($emailSender->sendCustomizeSailForm($data));
    }
}

ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

try {
    $emailSenderFile = __DIR__ . '/send_emails.php';

    if (!is_file($emailSenderFile)) {
        throw new RuntimeException('send_emails.php is missing.');
    }

    require_once $emailSenderFile;

    $webhook = new PromoflowUllmanFormsWebhook();
    $webhook->handleRequest();
} catch (Throwable $error) {
    error_log('Promoflow Ullman webhook error: ' . $error->getMessage());

    ullman_webhook_send_json(array(
        'success' => false,
        'message' => 'An internal server error occurred.'
    ), 500);
}
