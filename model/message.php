<?php

class Message {
  private $connection;

  private $name_case;
  private $user_1;
  private $user_2;
  private $date;
  private $message;

  public function __construct($connection) {
    $this->connection = $connection;
  }

  public function setNameCase($name_case) {
    $this->name_case = $name_case;
  }

  public function setUser1($user_1) {
    $this->user_1 = $user_1;
  }

  public function setUser2($user_2) {
    $this->user_2 = $user_2;
  }

  public function setDate($date) {
    $this->date = $date;
  }

  public function setMessage($message) {
    $this->message = $message;
  }

  public function saveMessages() {
    try {
      $pdo = $this->connection->getConnection();

      $currentDate = !empty($this->date) ? $this->date : date('Y-m-d H:i:s');

      $sql = $pdo->prepare("
        INSERT INTO `Messages_Ex`
          (`name_case`, `user_1`, `user_2`, `date`, `message`)
        VALUES
          (:name_case, :user_1, :user_2, :date, :message)
      ");

      $sql->bindParam(':name_case', $this->name_case, PDO::PARAM_STR);
      $sql->bindParam(':user_1', $this->user_1, PDO::PARAM_STR);
      $sql->bindParam(':user_2', $this->user_2, PDO::PARAM_STR);
      $sql->bindParam(':date', $currentDate, PDO::PARAM_STR);
      $sql->bindParam(':message', $this->message, PDO::PARAM_STR);

      $sql->execute();

      $this->connection->closeConnection();

      return [
        'status'  => 'success',
        'message' => 'Message saved successfully'
      ];
    } catch (PDOException $e) {
      return [
        'status'  => 'error',
        'message' => 'Unable to save the message',
        'error'   => $e->getMessage()
      ];
    }
  }



  public function getMessages() {
    try {
      $pdo = $this->connection->getConnection();

      $sql = $pdo->prepare("
        SELECT
          message_id,
          name_case,
          user_1,
          user_2,
          `date`,
          `message`
        FROM `Messages_Ex`
        ORDER BY `date` ASC
      ");

      $sql->execute();
      $result = $sql->fetchAll(PDO::FETCH_ASSOC);

      $this->connection->closeConnection();

      return [
        'status' => 'success',
        'result' => $result
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => 'Unable to get messages',
        'error' => $e->getMessage()
      ];
    }
  }
}
?>
