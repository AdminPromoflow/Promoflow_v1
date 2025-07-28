<?php
    class Groups {
      private $conn;
      private $idCategory;

      function __construct($conn) {
          $this->conn = $conn;
      }

      function setIdCategory($idCategory){
        $this->idCategory = $idCategory;
      }


      function getGroups(){
        try{
          $sql = $this->conn->getConnection()->query("SELECT `code`, `name` FROM `product_group` WHERE `prodcat` = '$this->idCategory'");
         $data = $sql->fetchAll(PDO::FETCH_ASSOC);
         $this->conn->closeConnection();
         return $data;
             }
         catch(PDOException $e){
             echo $query . "<br>" . $e->getMessage();
           }
       }





















}
?>
