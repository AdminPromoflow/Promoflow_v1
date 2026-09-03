<?php

/**
 * Promoflow webhook for Ullman Sails forms.
 *
 * Copy this file to:
 * https://www.promoflow.net/controller/ullman_sails/controller.php
 *
 * The existing send_emails.php file and its PHPMailer dependencies must remain
 * inside the same /controller/ullman_sails directory on Promoflow.
 *
 * Configure the same token used by Ullman Sails through the server environment,
 * or uncomment the line immediately below and replace its placeholder.
 */

// define('ULLMAN_PROMOFLOW_WEBHOOK_TOKEN', 'PASTE_THE_SAME_32+_CHARACTER_TOKEN_HERE');
$tokenFile = dirname(__DIR__) . '/includes/token.php';

if (is_file($tokenFile)) {
    require_once $tokenFile;
}

require_once __DIR__ . '/send_emails.php';
require_once dirname(__DIR__) . '/config/config_ullman_sails.php';
require_once dirname(__DIR__, 2) . '/model/ullman_sails/user.php';

class ApiController
{
    private $maxAttachmentBytes = 10485760; // 10 MB after base64 decoding.

    public function handleRequest()
    {
        header('Content-Type: application/json; charset=UTF-8');

        $requestMethod = isset($_SERVER['REQUEST_METHOD'])
            ? strtoupper($_SERVER['REQUEST_METHOD'])
            : '';

        if ($requestMethod !== 'POST') {
            $this->sendJson(array(
                'success' => false,
                'message' => 'Method not allowed.'
            ), 405);
            return;
        }

        if (!$this->authorizeRequest()) {
            return;
        }

        $contentType = isset($_SERVER['CONTENT_TYPE'])
            ? (string) $_SERVER['CONTENT_TYPE']
            : '';

        if (stripos($contentType, 'application/json') === false) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'Content-Type must be application/json.'
            ), 415);
            return;
        }

        $contentLength = isset($_SERVER['CONTENT_LENGTH'])
            ? (int) $_SERVER['CONTENT_LENGTH']
            : 0;

        if ($contentLength > 20971520) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'The request is too large.'
            ), 413);
            return;
        }

        $data = $this->getRequestData();

        if (!is_array($data)) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'Invalid JSON payload.'
            ), 400);
            return;
        }

        if (($data['source'] ?? '') !== 'ullman_sails') {
            $this->sendJson(array(
                'success' => false,
                'message' => 'Invalid request source.'
            ), 400);
            return;
        }

        if (!isset($data['action']) || (string) $data['action'] === '') {
            $this->sendJson(array(
                'success' => false,
                'message' => 'Missing action.'
            ), 400);
            return;
        }

        $action = (string) $data['action'];

        $this->debugBreakpoint($data, 'promoflow_received', array(
            'action' => $action,
            'source' => isset($data['source'])
                ? (string) $data['source']
                : '',
            'email' => isset($data['email'])
                ? (string) $data['email']
                : '',
            'password_present' => !empty($data['password'])
        ));

        switch ($action) {
            case 'login':
                $this->debugBreakpoint($data, 'promoflow_before_login', array(
                    'action' => $action,
                    'login_function' => 'login'
                ));
                $this->login($data);
                break;

            case 'read_users':
                $this->readUsers();
                break;

            case 'create_user':
                $this->createUser($data);
                break;

            case 'update_user':
                $this->updateUser($data);
                break;

            case 'delete_user':
                $this->deleteUser($data);
                break;

            case 'send_emal_contact_us':
                $this->sendEmailContactUs($data);
                break;

            case 'send_new_sail_quote':
                $this->sendNewSailQuote($data);
                break;

            case 'send_new_cover_quote':
                $this->sendNewCoverQuote($data);
                break;

            case 'send_new_repair_quote':
                $this->sendNewRepairQuote($data);
                break;

            case 'submit_customize_form':
                $this->submitCustomizeForm($data);
                break;

            default:
                $this->sendJson(array(
                    'success' => false,
                    'message' => 'Unknown action.'
                ), 400);
                break;
        }
    }

    private function getRequestData()
    {
        $input = file_get_contents('php://input');

        if ($input === false) {
            return null;
        }

        $data = json_decode($input, true);

        return is_array($data) ? $data : null;
    }

    private function authorizeRequest()
    {
        $expectedToken = $this->getWebhookToken();
        $providedToken = isset($_SERVER['HTTP_X_ULLMAN_WEBHOOK_TOKEN'])
            ? (string) $_SERVER['HTTP_X_ULLMAN_WEBHOOK_TOKEN']
            : '';

        if (
            strlen($expectedToken) < 32
            || $providedToken === ''
            || !hash_equals($expectedToken, $providedToken)
        ) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'Unauthorized request.'
            ), 401);
            return false;
        }

        return true;
    }

    private function getWebhookToken()
    {
        if (defined('ULLMAN_PROMOFLOW_WEBHOOK_TOKEN')) {
            return (string) constant('ULLMAN_PROMOFLOW_WEBHOOK_TOKEN');
        }

        $environmentToken = getenv('ULLMAN_PROMOFLOW_WEBHOOK_TOKEN');

        return is_string($environmentToken) ? $environmentToken : '';
    }

    private function sendJson($payload, $statusCode = 200)
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

    private function login($data)
    {
        header('Content-Type: application/json; charset=utf-8');

        $email = isset($data['email'])
            ? trim((string) $data['email'])
            : '';
        $password = isset($data['password'])
            ? (string) $data['password']
            : '';
        $debugStep = isset($data['debug_step'])
            ? (string) $data['debug_step']
            : '';

        $connection = new DatabaseUllmanSails();
        $user = new UllmanSailsUser($connection);

        $user->setEmail($email);

        $resultUser = $user->loginUserUllmanSails($password, $debugStep);

        $connection->closeConnection();

        echo json_encode(
            $resultUser,
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );
        exit;
    }

    private function readUsers()
    {
        $connection = new DatabaseUllmanSails();
        $user = new UllmanSailsUser($connection);
        $users = $user->getUsers();
        $connection->closeConnection();

        $this->sendJson(array(
            'success' => true,
            'users' => $users
        ));
    }

    private function createUser($data)
    {
        $validated = $this->validateUserData($data, true);

        if (!$validated['success']) {
            $this->sendJson($validated, 422);
            return;
        }

        $connection = new DatabaseUllmanSails();
        $user = new UllmanSailsUser($connection);

        if ($user->emailExists($validated['email'])) {
            $connection->closeConnection();
            $this->sendJson(array(
                'success' => false,
                'message' => 'That email address is already in use.'
            ), 409);
            return;
        }

        $user->setName($validated['name']);
        $user->setEmail($validated['email']);
        $user->setRole($validated['role']);
        $user->setStatus($validated['status']);

        $createdUser = $user->createUser($validated['password']);
        $connection->closeConnection();

        if (!is_array($createdUser)) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'The user could not be created.'
            ), 500);
            return;
        }

        $this->sendJson(array(
            'success' => true,
            'message' => 'User created successfully.',
            'user' => $createdUser
        ), 201);
    }

    private function updateUser($data)
    {
        $id = filter_var(isset($data['id']) ? $data['id'] : null, FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'Invalid user ID.'
            ), 422);
            return;
        }

        $validated = $this->validateUserData($data, false);

        if (!$validated['success']) {
            $this->sendJson($validated, 422);
            return;
        }

        $connection = new DatabaseUllmanSails();
        $user = new UllmanSailsUser($connection);
        $existingUser = $user->getUserById((int) $id);

        if (!is_array($existingUser)) {
            $connection->closeConnection();
            $this->sendJson(array(
                'success' => false,
                'message' => 'User not found.'
            ), 404);
            return;
        }

        $requesterEmail = isset($data['requester_email'])
            ? strtolower(trim((string) $data['requester_email']))
            : '';
        $isCurrentUser = $requesterEmail !== ''
            && strtolower((string) $existingUser['email']) === $requesterEmail;

        if (
            $isCurrentUser
            && (
                $validated['email'] !== $requesterEmail
                || $validated['status'] !== 'active'
                || $validated['role'] !== 'admin'
            )
        ) {
            $connection->closeConnection();
            $this->sendJson(array(
                'success' => false,
                'message' => 'You cannot change the email, role or active status of your own account.'
            ), 409);
            return;
        }

        if ($user->emailExists($validated['email'], (int) $id)) {
            $connection->closeConnection();
            $this->sendJson(array(
                'success' => false,
                'message' => 'That email address is already in use.'
            ), 409);
            return;
        }

        $user->setId((int) $id);
        $user->setName($validated['name']);
        $user->setEmail($validated['email']);
        $user->setRole($validated['role']);
        $user->setStatus($validated['status']);

        $updatedUser = $user->updateUser(
            $validated['password'] !== '' ? $validated['password'] : null
        );
        $connection->closeConnection();

        if (!is_array($updatedUser)) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'The user could not be updated.'
            ), 500);
            return;
        }

        $this->sendJson(array(
            'success' => true,
            'message' => 'User updated successfully.',
            'user' => $updatedUser
        ));
    }

    private function deleteUser($data)
    {
        $id = filter_var(isset($data['id']) ? $data['id'] : null, FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'Invalid user ID.'
            ), 422);
            return;
        }

        $connection = new DatabaseUllmanSails();
        $user = new UllmanSailsUser($connection);
        $existingUser = $user->getUserById((int) $id);

        if (!is_array($existingUser)) {
            $connection->closeConnection();
            $this->sendJson(array(
                'success' => false,
                'message' => 'User not found.'
            ), 404);
            return;
        }

        $requesterEmail = isset($data['requester_email'])
            ? strtolower(trim((string) $data['requester_email']))
            : '';

        if ($requesterEmail !== '' && strtolower((string) $existingUser['email']) === $requesterEmail) {
            $connection->closeConnection();
            $this->sendJson(array(
                'success' => false,
                'message' => 'You cannot delete the account you are currently using.'
            ), 409);
            return;
        }

        if ($user->hasPageActivity((int) $id)) {
            $connection->closeConnection();
            $this->sendJson(array(
                'success' => false,
                'message' => 'This user has page activity and cannot be deleted. Set the account to inactive instead.'
            ), 409);
            return;
        }

        $user->setId((int) $id);
        $deleted = $user->deleteUser();
        $connection->closeConnection();

        if (!$deleted) {
            $this->sendJson(array(
                'success' => false,
                'message' => 'The user could not be deleted.'
            ), 500);
            return;
        }

        $this->sendJson(array(
            'success' => true,
            'message' => 'User deleted successfully.'
        ));
    }

    private function validateUserData($data, $requiresPassword)
    {
        $name = isset($data['name']) ? trim((string) $data['name']) : '';
        $email = isset($data['email']) ? strtolower(trim((string) $data['email'])) : '';
        $password = isset($data['password']) ? (string) $data['password'] : '';
        $role = isset($data['role']) ? strtolower(trim((string) $data['role'])) : 'admin';
        $status = isset($data['status']) ? strtolower(trim((string) $data['status'])) : 'active';
        $nameLength = function_exists('mb_strlen') ? mb_strlen($name) : strlen($name);

        if ($nameLength < 2 || $nameLength > 150) {
            return array(
                'success' => false,
                'message' => 'Full name must contain between 2 and 150 characters.'
            );
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
            return array(
                'success' => false,
                'message' => 'Enter a valid email address.'
            );
        }

        if ($role !== 'admin') {
            return array(
                'success' => false,
                'message' => 'Ullman dashboard users must have the admin role.'
            );
        }

        if (!in_array($status, array('active', 'inactive'), true)) {
            return array(
                'success' => false,
                'message' => 'Select a valid account status.'
            );
        }

        $passwordLength = strlen($password);

        if (($requiresPassword && $passwordLength < 8) || (!$requiresPassword && $password !== '' && $passwordLength < 8)) {
            return array(
                'success' => false,
                'message' => 'Password must contain at least 8 characters.'
            );
        }

        if ($passwordLength > 72) {
            return array(
                'success' => false,
                'message' => 'Password cannot exceed 72 characters.'
            );
        }

        return array(
            'success' => true,
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $role,
            'status' => $status
        );
    }

    private function debugBreakpoint($requestData, $stage, $debugData)
    {
        if (
            !defined('ULLMAN_LOGIN_DEBUG')
            || constant('ULLMAN_LOGIN_DEBUG') !== true
        ) {
            return;
        }

        $requestedStage = isset($requestData['debug_step'])
            ? (string) $requestData['debug_step']
            : '';

        if ($requestedStage !== $stage) {
            return;
        }

        $this->sendJson(array(
            'success' => false,
            'debug' => true,
            'stage' => $stage,
            'message' => 'Login breakpoint reached.',
            'data' => $debugData
        ));
        exit;
    }

    private function value($data, $key, $default = null)
    {
        return array_key_exists($key, $data)
            ? $data[$key]
            : $default;
    }

    private function makeDataObject($requestData, $fields)
    {
        $data = array('action' => $this->value($requestData, 'action'));

        foreach ($fields as $field => $default) {
            $data[$field] = $this->value($requestData, $field, $default);
        }

        return (object) $data;
    }

    private function sendEmailResult($emailResult)
    {
        if (is_array($emailResult) || is_object($emailResult)) {
            $this->sendJson($emailResult);
            return;
        }

        if (is_bool($emailResult)) {
            $this->sendJson(array(
                'success' => $emailResult,
                'message' => $emailResult
                    ? 'Message sent successfully.'
                    : 'Unable to send your message.'
            ), $emailResult ? 200 : 500);
            return;
        }

        $this->sendJson(array(
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

    private function sendEmailContactUs($requestData)
    {
        $temporaryFile = null;

        try {
            $temporaryFile = $this->createTemporaryAttachment(
                $this->value($requestData, 'file')
            );

            $data = $this->makeDataObject($requestData, array(
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

    private function sendNewCoverQuote($requestData)
    {
        $data = $this->makeDataObject($requestData, array(
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

    private function sendNewRepairQuote($requestData)
    {
        $data = $this->makeDataObject($requestData, array(
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

    private function sendNewSailQuote($requestData)
    {
        $data = $this->makeDataObject($requestData, array(
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

    private function submitCustomizeForm($requestData)
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
            if ($this->value($requestData, $requiredField, '') === '') {
                $this->sendJson(array(
                    'success' => false,
                    'message' => 'Missing required fields.'
                ), 400);
                return;
            }
        }

        $data = $this->makeDataObject($requestData, array(
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
    $apiController = new ApiController();
    $apiController->handleRequest();
} catch (Throwable $error) {
    error_log('Promoflow Ullman webhook error: ' . $error->getMessage());

    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array(
        'success' => false,
        'message' => 'An internal server error occurred.'
    ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
