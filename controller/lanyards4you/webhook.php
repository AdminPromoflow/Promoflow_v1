<?php
// 1. Verificar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST allowed']);
    exit;
}

// 2. Verificar el header Authorization (Bearer token)
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

$expectedApiKey = 'pk_live_9hD73gTzWxA7yUjLqmKfPz1oCcXvLbQs'; // Clave esperada

if (strpos($authHeader, 'Bearer ') !== 0 || substr($authHeader, 7) !== $expectedApiKey) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Invalid or missing API key']);
    exit;
}

// 3. Leer y decodificar el cuerpo JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// 4. Procesar los datos (ejemplo: mostrar orden)
$order = $data['order'] ?? null;
$user = $data['user'] ?? null;

// Aquí puedes guardar los datos en base de datos, procesarlos, etc.
file_put_contents('log.txt', json_encode($data, JSON_PRETTY_PRINT)); // Ejemplo: guardar en un archivo

// 5. Responder
http_response_code(200);
//echo json_encode(['status' => 'OK', 'received' => $data]);

?>
