<?php
    class Products {
      private $conn;
      private $idGroup;

      function __construct($conn) {
          $this->conn = $conn;
      }

      function setIdGroup($idGroup){
        $this->idGroup = $idGroup;
      }


      function getProducts(){
        try{
          $sql = $this->conn->conn()->query("SELECT `id`, `name` FROM `product` WHERE `code` = '$this->idGroup'");
         $data = $sql->fetchAll(PDO::FETCH_ASSOC);
         $this->conn->close();
         return $data;
             }
         catch(PDOException $e){
             echo $query . "<br>" . $e->getMessage();
           }
       }

}
?>
