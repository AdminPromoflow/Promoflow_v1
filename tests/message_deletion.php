<?php
if (PHP_SAPI !== 'cli') exit;
require __DIR__ . '/../model/message.php';
$pdo = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$pdo->exec('CREATE TABLE Users (idUser INTEGER, email TEXT); CREATE TABLE Messages (id_message INTEGER PRIMARY KEY, id_case INTEGER, sender_type TEXT, sender_id INTEGER, message TEXT)');
$pdo->exec("INSERT INTO Users VALUES (1,'owner@example.test'),(2,'other@example.test'); INSERT INTO Messages VALUES (1,10,'admin',1,'own'),(2,10,'admin',2,'other'),(3,10,'supplier',1,'supplier')");
$connection = new class($pdo) { private $pdo; function __construct($pdo){$this->pdo=$pdo;} function getConnection(){return $this->pdo;} };
$model = new Message($connection);
foreach ([[2,10,'owner@example.test'],[3,10,'owner@example.test'],[1,11,'owner@example.test'],[1,10,'missing@example.test']] as $input) {
    if ($model->deleteOwnMessage(...$input)['response']) throw new RuntimeException('Unauthorized deletion succeeded.');
}
if ((int)$pdo->query('SELECT COUNT(*) FROM Messages')->fetchColumn() !== 3) throw new RuntimeException('Rows changed on rejected deletion.');
if (!$model->deleteOwnMessage(1,10,'owner@example.test')['response']) throw new RuntimeException('Own deletion failed.');
if ($model->deleteOwnMessage(1,10,'owner@example.test')['response']) throw new RuntimeException('Repeated deletion succeeded.');
if ((int)$pdo->query('SELECT COUNT(*) FROM Messages')->fetchColumn() !== 2) throw new RuntimeException('Wrong deletion count.');
echo "PASS own deletion, other author, supplier, wrong case, unknown user and repeated deletion\n";
