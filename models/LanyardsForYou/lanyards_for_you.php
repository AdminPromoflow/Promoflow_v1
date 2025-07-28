<?php
class LanyardsForYou_Model {
  // Private variables
  private $connection;
  private $email;

  // Constructor that initializes the connection
  function __construct($connection) {
    $this->connection = $connection;
  }

  // Set email (lo dejamos si lo necesitas para pasar el valor internamente)
  public function setEmail($email) {
    $this->email = $email;
  }
  public function getAllOrders() {
      try {
          $db = $this->connection->getConnection();

          // Obtener todas las órdenes
          $sqlOrders = $db->prepare("SELECT * FROM `Orders`");
          $sqlOrders->execute();
          $orders = $sqlOrders->fetchAll(PDO::FETCH_ASSOC);

          $fullData = [];

          foreach ($orders as $order) {
              $orderId = $order['idOrder'];
              $userId = $order['idUser'];

              // Datos del usuario
              $sqlUser = $db->prepare("SELECT idUser, name, email FROM `Users` WHERE idUser = :idUser");
              $sqlUser->bindParam(':idUser', $userId);
              $sqlUser->execute();
              $user = $sqlUser->fetch(PDO::FETCH_ASSOC);

              // Dirección del usuario
              $sqlAddress = $db->prepare("SELECT * FROM `Addresses` WHERE idUser = :idUser");
              $sqlAddress->bindParam(':idUser', $userId);
              $sqlAddress->execute();
              $address = $sqlAddress->fetch(PDO::FETCH_ASSOC);

              // Trabajos asociados
              $sqlJobs = $db->prepare("SELECT * FROM `Jobs` WHERE idOrder = :idOrder");
              $sqlJobs->bindParam(':idOrder', $orderId);
              $sqlJobs->execute();
              $jobs = $sqlJobs->fetchAll(PDO::FETCH_ASSOC);

              foreach ($jobs as &$job) {
                  $jobId = $job['idJobs'];

                  // Artwork
                  $stmt = $db->prepare("SELECT * FROM `Artwork` WHERE idJobs = :id");
                  $stmt->bindParam(':id', $jobId);
                  $stmt->execute();
                  $job['artwork'] = $stmt->fetch(PDO::FETCH_ASSOC);

                  // Image
                  $stmt = $db->prepare("SELECT * FROM `Image` WHERE idJobs = :id");
                  $stmt->bindParam(':id', $jobId);
                  $stmt->execute();
                  $job['image'] = $stmt->fetch(PDO::FETCH_ASSOC);

                  // Text
                  $stmt = $db->prepare("SELECT * FROM `Text` WHERE idJobs = :id");
                  $stmt->bindParam(':id', $jobId);
                  $stmt->execute();
                  $job['text'] = $stmt->fetch(PDO::FETCH_ASSOC);
              }

              $fullData[] = [
                  'order' => $order,
                  'user' => $user,
                  'address' => $address,
                  'jobs' => $jobs
              ];
          }

          $this->connection->closeConnection();
          return $fullData;

      } catch (PDOException $e) {
          echo "Error fetching orders: " . $e->getMessage();
          throw new Exception("Error retrieving orders from the database.");
      }
  }



}
?>
