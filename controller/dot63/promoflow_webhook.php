<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../../model/message.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function messagesReply(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    messagesReply(405, ['response' => false, 'message' => 'Use POST.']);
}
$tokenFile = __DIR__ . '/../config/messages_bridge.php';
$expected = is_file($tokenFile) ? require $tokenFile : '';
$provided = $_SERVER['HTTP_X_MESSAGES_TOKEN'] ?? '';
if (!is_string($expected) || strlen($expected) < 32 || !hash_equals($expected, $provided)) {
    messagesReply(401, ['response' => false, 'message' => 'Messaging connection is not authorized.']);
}
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) messagesReply(400, ['response' => false, 'message' => 'Invalid payload.']);
$supplierId = filter_var($data['user_id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if (!$supplierId) messagesReply(403, ['response' => false, 'message' => 'Supplier not found.']);
try {
    $message = new Message(new Database());
    $action = $data['action'] ?? '';
    if ($action === 'get_cases') {
        messagesReply(200, ['response' => true, 'result' => $message->supplierCases($supplierId)]);
    }
    if (!in_array($action, ['get_cases_and_messages', 'send_message', 'delete_message'], true)) {
        messagesReply(400, ['response' => false, 'message' => 'Unsupported action.']);
    }
    $caseId = filter_var($data['caseId'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if (!$caseId || !$message->supplierOwnsCase($caseId, $supplierId)) {
        messagesReply(403, ['response' => false, 'message' => 'Case is unavailable.']);
    }
    $message->setIdCase($caseId);
    if ($action === 'get_cases_and_messages') {
        $result = $message->getMessagesByCase();
        if (!$result['response']) messagesReply(500, ['response' => false, 'message' => 'Unable to load messages.']);
        $messages = $result['result'];
        foreach ($messages as &$item) {
            $item['can_delete'] = $item['sender_type'] === 'supplier' && (int)$item['sender_id'] === $supplierId;
        }
        unset($item);
        messagesReply(200, ['response' => true, 'cases' => $message->supplierCases($supplierId), 'messages' => $messages]);
    }
    if ($action === 'delete_message') {
        $id = filter_var($data['messageId'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if (!$id) messagesReply(400, ['response' => false, 'message' => 'Invalid message.']);
        $result = $message->deleteSupplierMessage($id, $caseId, $supplierId);
        messagesReply($result['response'] ? 200 : 403, $result);
    }
    $text = $data['message'] ?? null;
    if (!is_string($text) || trim($text) === '') messagesReply(400, ['response' => false, 'message' => 'Write a message first.']);
    $message->setSenderType('supplier');
    $message->setSenderId($supplierId);
    $message->setMessage(trim($text));
    $result = $message->sendMessage();
    unset($result['error']);
    messagesReply($result['response'] ? 200 : 500, $result);
} catch (Throwable $error) {
    error_log('Supplier messaging failed: ' . get_class($error));
    messagesReply(500, ['response' => false, 'message' => 'Unable to complete the request. Please try again.']);
}
