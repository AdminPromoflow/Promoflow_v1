<?php
    class Orders {
      private $conn;
      private $id;
      private $created_date;
      private $name;
      private $runtype;
      private $description;
      private $finished_date;
      private $workgroup;


      function __construct($conn) {
          $this->conn = $conn;
      }
      function setId($id ){
        $this->id = $id;
      }
      function setCreatedDate($created_date){
        $this->created_date = $created_date ;
      }
      function setName($name){
        $this->name = $name;
      }
      function setRuntype($runtype){
        $this->runtype = $runtype;
      }
      function setDescription($description){
        $this->description = $description;
      }
      function setFinishedDate($finished_date){
        $this->finished_date = $finished_date;
      }
      function setWorkgroup($workgroup){
        $this->workgroup = $workgroup;
      }


       function createUser(){
         try{
           $sql = "INSERT INTO `Order`(`id`, `created_date`, `name`, `runtype`, `description`, `finished_date`, `workgroup`)
            VALUES (
              '$this->id',
              '$this->created_date',
              '$this->name',
              '$this->runtype',
              '$this->description',
              '$this->finished_date',
              '$this->workgroup'
            )";
           $this->conn->conn()->exec($sql);//echo "hola2"; exit;
           $this->conn->close();
           return "The order has been created";
             }
         catch(PDOException $e){
             return $query . "<br>" . $e->getMessage();
           }
       }
       function verifyRepeatOrder(){
         try{ //SELECT COUNT(*) FROM `Order` WHERE `id` = ''
          $sql = $this->conn->conn()->query("SELECT COUNT(*) FROM `Order` WHERE `id` = '$this->id'");
          $data = $sql->fetch(PDO::FETCH_ASSOC);
          $this->conn->close();
          return $data;
              }
          catch(PDOException $e){
              echo $query . "<br>" . $e->getMessage();
            }
       }
       function getToSendPOOrders(){
         try{
           $sql = $this->conn->conn()->query("SELECT * FROM `Order` ");
          $data = $sql->fetchAll(PDO::FETCH_ASSOC);
          $this->conn->close();
          return $data;
              }
          catch(PDOException $e){
              echo $query . "<br>" . $e->getMessage();
            }
        }
       //
     }
?>
