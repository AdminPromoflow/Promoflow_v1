<?php
if (PHP_SAPI !== 'cli') exit;
require __DIR__ . '/../model/message.php';
$pdo = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$pdo->exec('CREATE TABLE Cases (id_case INTEGER, id_supplier INTEGER, updated_at TEXT); CREATE TABLE Messages (id_message INTEGER PRIMARY KEY, id_case INTEGER, sender_type TEXT, sender_id INTEGER)');
$pdo->exec("INSERT INTO Cases VALUES (10,1,'2026'),(20,2,'2026'); INSERT INTO Messages VALUES (1,10,'supplier',1),(2,10,'admin',1),(3,10,'supplier',2),(4,20,'supplier',1)");
$model = new Message(new class($pdo) { private $pdo; function __construct($pdo) {$this->pdo=$pdo;} function getConnection(){return $this->pdo;} });
foreach ([[2,10,1],[3,10,1],[4,20,1],[1,20,1],[1,10,2],[1,10,999]] as $input) {
    if ($model->deleteSupplierMessage(...$input)['response']) throw new RuntimeException('Unauthorized deletion.');
}
if (count($model->supplierCases(1)) !== 1 || $model->supplierOwnsCase(20,1)) throw new RuntimeException('Case isolation failed.');
if (!$model->deleteSupplierMessage(1,10,1)['response']) throw new RuntimeException('Own deletion failed.');
if ($model->deleteSupplierMessage(1,10,1)['response']) throw new RuntimeException('Repeated deletion succeeded.');
if ((int)$pdo->query('SELECT COUNT(*) FROM Messages')->fetchColumn() !== 3) throw new RuntimeException('Other messages changed.');
echo "PASS supplier ownership, case isolation, admin protection, own deletion and repeated deletion\n";
