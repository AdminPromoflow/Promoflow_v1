<?php
require_once "../../controller/lanyards4you/order.php"; // <-- Solo clase, sin efectos colaterales

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST allowed']);
    exit;
}

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

$expectedApiKey = 'pk_live_9hD73gTzWxA7yUjLqmKfPz1oCcXvLbQs';

if (strpos($authHeader, 'Bearer ') !== 0 || substr($authHeader, 7) !== $expectedApiKey) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid or missing API key']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

file_put_contents('log.txt', json_encode($data, JSON_PRETTY_PRINT));

$order = new Order();     // <- OK
$order->setOrder($data);  // <- OK
$order->saveLanyardForYou(); // <- OK

http_response_code(200);
echo json_encode(['status' => 'OK', 'message' => 'Order processed']);
