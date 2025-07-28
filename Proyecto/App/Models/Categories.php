<?php
    class Categories {
      private $conn;


      function __construct($conn) {
          $this->conn = $conn;
      }


      function getCategories(){
        try{
          $sql = $this->conn->conn()->query("SELECT * FROM `product_category` ");
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
