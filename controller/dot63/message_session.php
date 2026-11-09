<?php
/** Validates the supplier session with Dot63, without trusting payload user_id. */
function messageSupplierSession(array $headers, ?callable $transport = null): int {
    $sessionId = $headers['HTTP_X_DOT63_SESSION'] ?? '';
    $csrf = $headers['HTTP_X_DOT63_CSRF_TOKEN'] ?? '';
    if (!is_string($sessionId) || !preg_match('/\A[a-zA-Z0-9,-]{16,128}\z/', $sessionId)
        || !is_string($csrf) || !preg_match('/\A[a-f0-9]{64}\z/', $csrf)) {
        throw new RuntimeException('Please sign in to Dot63 again.', 401);
    }
    if ($transport === null) {
        $transport = static function (string $sessionId, string $csrf): array {
            // Fixed trusted destination: never accept a callback URL from the caller.
            $curl = curl_init('https://promoflow.net/dot63/controller/promoflow/verify_message_session.php');
            curl_setopt_array($curl, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => '{}',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => 5,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Cookie: PHPSESSID=' . $sessionId,
                    'X-Dot63-CSRF-Token: ' . $csrf,
                ],
            ]);
            $body = curl_exec($curl);
            $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);
            return [$status, $body === false ? '' : $body];
        };
    }
    [$status, $body] = $transport($sessionId, $csrf);
    if (in_array($status, [401, 403, 419], true)) {
        throw new RuntimeException('Your supplier session expired. Sign in to Dot63 again.', 401);
    }
    $result = json_decode($body, true);
    $supplierId = is_array($result) ? filter_var($result['supplier_id'] ?? null, FILTER_VALIDATE_INT,
        ['options' => ['min_range' => 1]]) : false;
    if ($status !== 200 || !is_array($result) || ($result['response'] ?? false) !== true || !$supplierId) {
        throw new RuntimeException('Unable to verify the supplier session. Please try again later.', 502);
    }
    return $supplierId;
}
