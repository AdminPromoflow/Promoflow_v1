<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../../model/message.php';
require_once __DIR__ . '/message_session.php';

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
try {
    $supplierId = messageSupplierSession($_SERVER);
} catch (RuntimeException $error) {
    messagesReply($error->getCode(), ['response' => false, 'message' => $error->getMessage()]);
}
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) messagesReply(400, ['response' => false, 'message' => 'Invalid payload.']);
try {
    $message = new Message(new Database());
    $action = $data['action'] ?? '';
    if ($action === 'get_cases') {
        messagesReply(200, ['response' => true, 'result' => $message->supplierCases($supplierId)]);
    }
    if (!in_array($action, ['get_cases_and_messages', 'send_message', 'delete_message', 'rename_case', 'delete_case'], true)) {
        messagesReply(400, ['response' => false, 'message' => 'Unsupported action.']);
    }
    $caseId = filter_var($data['caseId'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if (!$caseId || !$message->supplierOwnsCase($caseId, $supplierId)) {
        messagesReply(403, ['response' => false, 'message' => 'Case is unavailable.']);
    }
    if (in_array($action, ['rename_case', 'delete_case'], true)) {
        $result = $message->manageCase($caseId, $action, 'supplier', $supplierId, $data['name'] ?? null);
        messagesReply($result['response'] ? 200 : 422, $result);
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
