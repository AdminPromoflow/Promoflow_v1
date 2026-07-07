<?php

class Message {
  private $connection;

  // Cases
  private $id_case;
  private $id_admin;
  private $id_supplier;
  private $name;
  private $status;
  private $created_at;
  private $updated_at;

  // Messages
  private $id_message;
  private $sender_type;
  private $sender_id;
  private $message;
  private $is_read;
  private $message_created_at;

  public function __construct($connection) {
    $this->connection = $connection;
  }

  // Setters para Cases

  public function setIdCase($id_case) {
    $this->id_case = $id_case;
  }

  public function setIdAdmin($id_admin) {
    $this->id_admin = $id_admin;
  }

  public function setIdSupplier($id_supplier) {
    $this->id_supplier = $id_supplier;
  }

  public function setName($name) {
    $this->name = $name;
  }

  public function setStatus($status) {
    $this->status = $status;
  }

  public function setCreatedAt($created_at) {
    $this->created_at = $created_at;
  }

  public function setUpdatedAt($updated_at) {
    $this->updated_at = $updated_at;
  }

  // Setters para Messages

  public function setIdMessage($id_message) {
    $this->id_message = $id_message;
  }

  public function setSenderType($sender_type) {
    $this->sender_type = $sender_type;
  }

  public function setSenderId($sender_id) {
    $this->sender_id = $sender_id;
  }

  public function setMessage($message) {
    $this->message = $message;
  }

  public function setIsRead($is_read) {
    $this->is_read = $is_read;
  }

  public function setMessageCreatedAt($created_at) {
    $this->message_created_at = $created_at;
  }


  public function sendMessage() {
    try {
      $pdo = $this->connection->getConnection();

      $createdAt = !empty($this->message_created_at)
        ? $this->message_created_at
        : date('Y-m-d H:i:s');

      $isRead = isset($this->is_read) ? (int)$this->is_read : 0;

      $sql = $pdo->prepare("
        INSERT INTO `Messages`
          (`id_case`, `sender_type`, `sender_id`, `message`, `is_read`, `created_at`)
        VALUES
          (:id_case, :sender_type, :sender_id, :message, :is_read, :created_at)
      ");

      $sql->bindParam(':id_case', $this->id_case, PDO::PARAM_INT);
      $sql->bindParam(':sender_type', $this->sender_type, PDO::PARAM_STR);
      $sql->bindParam(':sender_id', $this->sender_id, PDO::PARAM_INT);
      $sql->bindParam(':message', $this->message, PDO::PARAM_STR);
      $sql->bindParam(':is_read', $isRead, PDO::PARAM_INT);
      $sql->bindParam(':created_at', $createdAt, PDO::PARAM_STR);

      $sql->execute();

      $idMessage = $pdo->lastInsertId();

      return [
        'response' => true,
        'message' => 'Message sent successfully',
        'id_message' => $idMessage,
        'id_case' => $this->id_case,
        'sender_type' => $this->sender_type,
        'sender_id' => $this->sender_id,
        'created_at' => $createdAt
      ];

    } catch (PDOException $e) {
      return [
        'response' => false,
        'message' => 'Unable to send message',
        'error' => $e->getMessage()
      ];
    }
  }
  // Crear un case

  public function saveCase() {
    try {
      $pdo = $this->connection->getConnection();

      $createdAt = !empty($this->created_at) ? $this->created_at : date('Y-m-d H:i:s');
      $updatedAt = !empty($this->updated_at) ? $this->updated_at : date('Y-m-d H:i:s');
      $status = !empty($this->status) ? $this->status : 'open';

      $sql = $pdo->prepare("
        INSERT INTO `Cases`
          (`id_admin`, `id_supplier`, `name`, `status`, `created_at`, `updated_at`)
        VALUES
          (:id_admin, :id_supplier, :name, :status, :created_at, :updated_at)
      ");

      $sql->bindParam(':id_admin', $this->id_admin, PDO::PARAM_INT);
      $sql->bindParam(':id_supplier', $this->id_supplier, PDO::PARAM_INT);
      $sql->bindParam(':name', $this->name, PDO::PARAM_STR);
      $sql->bindParam(':status', $status, PDO::PARAM_STR);
      $sql->bindParam(':created_at', $createdAt, PDO::PARAM_STR);
      $sql->bindParam(':updated_at', $updatedAt, PDO::PARAM_STR);

      $sql->execute();

      $idCase = $pdo->lastInsertId();

      return [
        'response' => true,
        'message' => 'Case created successfully',
        'id_case' => $idCase,
        'created_at' => $createdAt,
        'updated_at' => $updatedAt
      ];

    } catch (PDOException $e) {
      return [
        'response' => false,
        'message' => 'Unable to create case',
        'error' => $e->getMessage()
      ];
    }
  }

  // Guardar un mensaje

  public function saveMessage() {
    try {
      $pdo = $this->connection->getConnection();

      $isRead = isset($this->is_read) ? (int)$this->is_read : 0;
      $createdAt = !empty($this->message_created_at) ? $this->message_created_at : date('Y-m-d H:i:s');

      $sql = $pdo->prepare("
        INSERT INTO `Messages`
          (`id_case`, `sender_type`, `sender_id`, `message`, `is_read`, `created_at`)
        VALUES
          (:id_case, :sender_type, :sender_id, :message, :is_read, :created_at)
      ");

      $sql->bindParam(':id_case', $this->id_case, PDO::PARAM_INT);
      $sql->bindParam(':sender_type', $this->sender_type, PDO::PARAM_STR);
      $sql->bindParam(':sender_id', $this->sender_id, PDO::PARAM_INT);
      $sql->bindParam(':message', $this->message, PDO::PARAM_STR);
      $sql->bindParam(':is_read', $isRead, PDO::PARAM_INT);
      $sql->bindParam(':created_at', $createdAt, PDO::PARAM_STR);

      $sql->execute();

      $idMessage = $pdo->lastInsertId();

      return [
        'response' => true,
        'message' => 'Message saved successfully',
        'id_message' => $idMessage,
        'created_at' => $createdAt
      ];

    } catch (PDOException $e) {
      return [
        'response' => false,
        'message' => 'Unable to save the message',
        'error' => $e->getMessage()
      ];
    }
  }

  // Obtener mensajes de un case específico

  public function getMessagesByCase() {
    try {
      $pdo = $this->connection->getConnection();

      $sql = $pdo->prepare("
        SELECT
          `id_message`,
          `id_case`,
          `sender_type`,
          `sender_id`,
          `message`,
          `is_read`,
          `created_at`
        FROM `Messages`
        WHERE `id_case` = :id_case
        ORDER BY `created_at` ASC
      ");

      $sql->bindParam(':id_case', $this->id_case, PDO::PARAM_INT);
      $sql->execute();

      $result = $sql->fetchAll(PDO::FETCH_ASSOC);

      return [
        'response' => true,
        'result' => $result
      ];

    } catch (PDOException $e) {
      return [
        'response' => false,
        'message' => 'Unable to get messages',
        'error' => $e->getMessage()
      ];
    }
  }

  // Obtener todos los cases

  public function getCases() {
    try {
      $pdo = $this->connection->getConnection();

      $sql = $pdo->prepare("
        SELECT
          `id_case`,
          `id_admin`,
          `id_supplier`,
          `name`,
          `status`,
          `created_at`,
          `updated_at`
        FROM `Cases`
        ORDER BY `updated_at` DESC
      ");

      $sql->execute();

      $result = $sql->fetchAll(PDO::FETCH_ASSOC);

      return [
        'response' => true,
        'result' => $result
      ];

    } catch (PDOException $e) {
      return [
        'response' => false,
        'message' => 'Unable to get cases',
        'error' => $e->getMessage()
      ];
    }
  }

  public function getCasesAndMessages() {
    try {
      $pdo = $this->connection->getConnection();

      if (empty($this->id_case)) {
        return [
          'response' => false,
          'message' => 'Case ID is required'
        ];
      }

      // 1. Obtener todos los cases
      $sqlCases = $pdo->prepare("
        SELECT
          `id_case`,
          `id_admin`,
          `id_supplier`,
          `name`,
          `status`,
          `created_at`,
          `updated_at`
        FROM `Cases`
        ORDER BY `updated_at` DESC
      ");

      $sqlCases->execute();
      $cases = $sqlCases->fetchAll(PDO::FETCH_ASSOC);

      // 2. Obtener los messages correspondientes al case seleccionado
      $sqlMessages = $pdo->prepare("
        SELECT
          `id_message`,
          `id_case`,
          `sender_type`,
          `sender_id`,
          `message`,
          `is_read`,
          `created_at`
        FROM `Messages`
        WHERE `id_case` = :id_case
        ORDER BY `created_at` ASC
      ");

      $sqlMessages->bindParam(':id_case', $this->id_case, PDO::PARAM_INT);
      $sqlMessages->execute();

      $messages = $sqlMessages->fetchAll(PDO::FETCH_ASSOC);

      return [
        'response' => true,
        'message' => 'Cases and messages loaded successfully',
        'cases' => $cases,
        'messages' => $messages
      ];

    } catch (PDOException $e) {
      return [
        'response' => false,
        'message' => 'Unable to get cases and messages',
        'error' => $e->getMessage()
      ];
    }
  }


}

?>
