<?php
    class Customers {
      private $conn;
      private $name;
      private $addr1;
      private $addr2;
      private $addr3;
      private $addr4;
      private $addr5;
      private $addr6;
      private $postcode;
      private $countrycode;
      private $contact;
      private $telephone;
      private $email;
      private $best_name;
      private $country;
      private $quantity;
      private $despatch_method;
      private $despatch_method_name;
      private $despatch_customer_code;
      private $despatch_customer_address_id;
      private $line;
      function __construct($conn) {
          $this->conn = $conn;
      }
      function setName($name){
        $this->name = $name;
      }
      function setAddr1($addr1 ){
        $this->addr1 = $addr1;
      }
      function setAddr2($addr2 ){
        $this->addr2 = $addr2;
      }
      function setAddr3($addr3 ){
        $this->addr3 = $addr3;
      }
      function setAddr4($addr4 ){
        $this->addr4 = $addr4;
      }
      function setAddr5($addr5 ){
        $this->addr5 = $addr5;
      }
      function setAddr6($addr6 ){
        $this->addr6 = $addr6;
      }
      function setPostcode($postcode ){
        $this->postcode = $postcode;
      }
      function setCountrycode($countrycode ){
        $this->countrycode = $countrycode;
      }
      function setContact($contact ){
        $this->contact = $contact;
      }
      function setTelephone($telephone ){
        $this->telephone = $telephone;
      }
      function setEmail($email ){
        $this->email = $email;
      }
      function setBestName($best_name ){
        $this->best_name = $best_name;
      }
      function setCountry($country ){
        $this->country = $country;
      }
      function setQuantity($quantity ){
        $this->quantity = $quantity;
      }
      function setDespatchMethod($despatch_method ){
        $this->despatch_method= $despatch_method;
      }
      function setDespatchMethodName($despatch_method_name ){
        $this->despatch_method_name = $despatch_method_name;
      }
      function setDespatchCustomerCode($despatch_customer_code ){
        $this->despatch_customer_code = $despatch_customer_code;
      }
      function setDespatchCustomerAddressId($despatch_customer_address_id ){
        $this->despatch_customer_address_id = $despatch_customer_address_id;
      }
      function setLine($line){
        $this->line = $line;
      }

       function createCustomer(){
         try{
           $sql = "INSERT INTO `Customer`(`code`, `name`, `address1`, `address2`,
              `address3`, `address4`, `address5`, `address6`, `postcode`, `countrycode`,
              `contact`, `telephone`, `email`, `best_name`, `country`, `despatch_method`,
              `despatch_method_name`, `despatch_customer_code`, `despatch_customer_address_id`,
              `line`) VALUES (
                '$this->despatch_customer_code',
                '$this->name',
                '$this->addr1',
                '$this->addr2',
                '$this->addr3',
                '$this->addr4',
                '$this->addr5',
                '$this->addr6',
                '$this->postcode',
                '$this->countrycode',
                '$this->contact',
                '$this->telephone',
                '$this->email',
                '$this->best_name',
                '$this->country',
                '$this->despatch_method',
                '$this->despatch_method_name',
                '$this->despatch_customer_code',
                '$this->despatch_customer_address_id',
                '$this->line'
                  )";
           $this->conn->conn()->exec($sql);//echo "hola2"; exit;
           $this->conn->close();
           return "The order has been created";
             }
         catch(PDOException $e){
             return $query . "<br>" . $e->getMessage();
           }
       }
       function verifyRepeatCustomer(){
         try{ //SELECT COUNT(*) FROM `Order` WHERE `id` = ''
          $sql = $this->conn->conn()->query("SELECT COUNT(*) FROM `Customer` WHERE `code` = '$this->despatch_customer_code'");
          $data = $sql->fetch(PDO::FETCH_ASSOC);
          $this->conn->close();
          return $data;
              }
          catch(PDOException $e){
              echo $query . "<br>" . $e->getMessage();
            }
       }
     }
?>
