<?php
if (PHP_SAPI !== 'cli') exit;
require __DIR__ . '/../controller/dot63/message_session.php';
$headers = ['HTTP_X_DOT63_SESSION' => str_repeat('a', 26), 'HTTP_X_DOT63_CSRF_TOKEN' => str_repeat('b', 64)];
function rejected(callable $request, int $status): void {
    try { $request(); } catch (RuntimeException $e) {
        if ($e->getCode() !== $status) throw new RuntimeException('Unexpected status.');
        return;
    }
    throw new RuntimeException('Unauthorized session accepted.');
}
$never = static function () { throw new LogicException('Invalid credentials reached transport.'); };
rejected(fn() => messageSupplierSession([], $never), 401);
rejected(fn() => messageSupplierSession(array_merge($headers, ['HTTP_X_DOT63_SESSION' => "bad\r\nCookie: fake"]), $never), 401);
rejected(fn() => messageSupplierSession(array_merge($headers, ['HTTP_X_DOT63_CSRF_TOKEN' => '']), $never), 401);
foreach ([401,403,419] as $status) rejected(fn() => messageSupplierSession($headers, fn() => [$status, '{}']), 401);
foreach ([[0,''],[404,'not found'],[500,'{}'],[200,'<html>login</html>'],[200,'{"response":true,"supplier_id":0}'],[200,'{"response":false,"supplier_id":7}']] as $reply) {
    rejected(fn() => messageSupplierSession($headers, fn() => $reply), 502);
}
$identity = messageSupplierSession($headers, function ($session, $csrf) use ($headers) {
    if ($session !== $headers['HTTP_X_DOT63_SESSION'] || $csrf !== $headers['HTTP_X_DOT63_CSRF_TOKEN']) throw new RuntimeException('Credentials altered.');
    return [200, '{"response":true,"supplier_id":7}'];
});
if ($identity !== 7) throw new RuntimeException('Wrong supplier identity.');
echo "PASS session identity, missing/invalid credentials, expired session and upstream failures\n";
