<?php
if (PHP_SAPI !== 'cli') exit;
require __DIR__ . '/../model/message.php';
$pdo = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$pdo->exec('PRAGMA foreign_keys = ON; CREATE TABLE Users (idUser INTEGER, email TEXT); CREATE TABLE Cases (id_case INTEGER PRIMARY KEY, id_admin INTEGER, id_supplier INTEGER, name TEXT, updated_at TEXT); CREATE TABLE Messages (id_message INTEGER PRIMARY KEY, id_case INTEGER REFERENCES Cases(id_case), message TEXT)');
$pdo->exec("INSERT INTO Users VALUES(1,'owner@example.test'),(2,'other@example.test'); INSERT INTO Cases VALUES(10,1,7,'Original','2026'),(20,2,8,'Other','2026'),(30,1,7,'Rollback','2026'); INSERT INTO Messages VALUES(1,10,'One'),(2,20,'Other'),(3,30,'Keep')");
$model = new Message(new class($pdo) { private $pdo; function __construct($pdo) {$this->pdo=$pdo;} function getConnection(){return $this->pdo;} });
function check($value, $message) { if (!$value) throw new RuntimeException($message); }
foreach ([[10,'delete_case','supplier',8],[10,'rename_case','admin','other@example.test','Wrong'],[20,'delete_case','admin','owner@example.test'],[10,'delete_case','invalid',7],[99,'delete_case','supplier',7]] as $input) check(!$model->manageCase(...$input)['response'], 'Unauthorized case change');
foreach (['', '   ', str_repeat('x',101), ['invalid']] as $name) check(!$model->manageCase(10,'rename_case','supplier',7,$name)['response'], 'Invalid name accepted');
check($model->manageCase(10,'rename_case','supplier',7,'  New “case”  ')['response'], 'Supplier rename failed');
check($pdo->query('SELECT name FROM Cases WHERE id_case=10')->fetchColumn()==='New “case”', 'Name not saved');
check($model->manageCase(10,'rename_case','admin','owner@example.test','Admin name')['response'], 'Admin rename failed');
check($model->manageCase(10,'rename_case','admin','owner@example.test','Admin name')['response'], 'Unchanged rename failed');
check($model->manageCase(10,'delete_case','supplier',7)['response'], 'Supplier deletion failed');
check(!$model->manageCase(10,'delete_case','supplier',7)['response'], 'Repeated deletion accepted');
check((int)$pdo->query('SELECT COUNT(*) FROM Messages WHERE id_case=10')->fetchColumn()===0, 'Orphan messages');
// Simulate a database failure after messages are deleted; the transaction must restore them.
$pdo->exec("CREATE TRIGGER prevent_case_delete BEFORE DELETE ON Cases WHEN OLD.id_case = 30 BEGIN SELECT RAISE(ABORT,'test'); END");
check(!$model->manageCase(30,'delete_case','supplier',7)['response'], 'DB failure accepted');
check((int)$pdo->query('SELECT COUNT(*) FROM Messages WHERE id_case=30')->fetchColumn()===1, 'Rollback lost messages');
check($model->manageCase(20,'delete_case','admin','other@example.test')['response'], 'Admin deletion failed');
check((int)$pdo->query('SELECT COUNT(*) FROM Cases')->fetchColumn()===1, 'Unrelated case changed');
echo "PASS admin/supplier rename and deletion, ownership, validation, repeat deletion and atomic rollback\n";
