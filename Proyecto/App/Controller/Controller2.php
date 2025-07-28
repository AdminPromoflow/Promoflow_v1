<?php
session_start();

/*---------------------------------  Imports  --------------------------------*/

require_once('../Config/database.php');
require_once('../Models/Users.php');
require_once('../Models/Categories.php');
require_once('../Models/Groups.php');
require_once('../Models/Products.php');
require_once('../Models/Orders.php');
require_once('../Models/Customers.php');
require_once('../Models/Jobs.php');
require_once('../pest-master/PestJSON.php');
require_once('../Data/flapi_credentials.php');

/*--------------------------------  CRUD users  ------------------------------*/

    if ($_POST['module']=="createUser") {
      $db = new Database();
      $user = new Users($db);
      $user->setEmail($_POST['email']);
      $countUsers = ($user->verifyRepeatUser()["COUNT(*)"]);

      if ($countUsers == 0) {
        $db = new Database();
        $user = new Users($db);
        $user->setName($_POST['name']);
        $user->setEmail($_POST['email']);
        $user->setPassword($_POST['password']);
        $user->setUserType($_POST['userType']);
        $result = json_encode($user->createUser());
      }
      echo $countUsers;
    }

    elseif ($_POST['module']=="updateUsers") {
      $db = new Database();
      $user = new Users($db);
      $user->setIdUser($_POST['idUser']);
      $user->setName($_POST['name']);
      $user->setEmail($_POST['email']);
      $user->setPassword($_POST['password']);
      $user->setUserType($_POST['userType']);
      $result = json_encode($user->updateUser());
      echo $result;
    }

    elseif ($_POST['module']=="deleteUser") {
      $db = new Database();
      $user = new Users($db);
      $user->setIdUser($_POST['idUser']);
      $result = json_encode($user->deleteUser());
      echo $result;
    }


/*----------------------------------  Login  ---------------------------------*/

     elseif ($_POST['module']=="loginUser") {
      $db = new Database();
      $user = new Users($db);
      $user->setEmail($_POST['email']);
      $user->setPassword($_POST['password']);
      $result = json_encode($user->readUserExist());
      echo $result;
      $_SESSION['loginUser'] = 'active';

      $db = new Database();
      $user = new Users($db);
      $user->setEmail($_POST['email']);
      $idUser = $user->getIdUserByEmail()["idUser"];
      $_SESSION['idUser'] = $idUser;
      //echo json_encode($_SESSION['idUser']);
    }

    elseif ($_POST['module']=="verifyLogin") {
      if ($_SESSION['loginUser'] == 'active') {
        echo json_encode(1);
      }
      else {
        echo json_encode(0);
      }
    }

    elseif ($_POST['module']=="logout") {
      session_destroy();
    }


/*--------------------------------- Get Orders  ------------------------------*/

    elseif ($_POST['module']=="getOrders") {
        $apiClient = new PestJSON('https://dev-7.flyerlink.com/api.php'); // Init the library (put in your TC credentials here)
        $apiClient->setupAuth($flapi[0],$flapi[1]); //  $apiClient->setupAuth( 'username', 'password' );

        try { // Make a simple get call (this returns tag types in JSON format)
            $result = $apiClient->get('/runs?state=waiting&days=120&format=json');
        }
        catch (Exception $e) { // Handle error. In practice there are several exception types,
            die( $e->getMessage()); // which you can use to differentiate between different error conditions
        }

        echo(json_encode( $result) ); // Examine successful result
        setOrders($result);
    }



    elseif ($_POST['module']=="getOrdersContent") {
      $apiClient = new PestJSON('https://dev-7.flyerlink.com/api.php');
      $apiClient->setupAuth($flapi[0],$flapi[1]);

      try {
          $result = $apiClient->get('/runs/'.$_POST['idOrder'].'/jobs?format=json');
      }
      catch (Exception $e) {
          die( $e->getMessage());
      }

      echo(json_encode( $result) );
      setOrdersContent($result, $_POST['idOrder']);
    }


/*---------------------------------  Products  -------------------------------*/

    elseif ($_POST['module']=="getCategories") {
      $db = new Database();
      $category = new Categories($db);
      $result = json_encode($category->getCategories());
      echo $result;
    }

    elseif ($_POST['module']=="getGroups") {
      $db = new Database();
      $group = new Groups($db);
      $group->setIdCategory($_POST['id']);
      $result = json_encode($group->getGroups());
      echo $result;
    }

    elseif ($_POST['module']=="getProducts") {
      $db = new Database();
      $product = new Products($db);
      $product->setIdGroup($_POST['id']);
      $result = json_encode($product->getProducts());
      echo $result;
    }

/*------------------------------  get ToSendPO  ------------------------------*/

/*-------------------------------  Customers  --------------------------------*/

    elseif ($_POST['module']=="getToSendPOOrders") {
      $db = new Database();
      $order = new Orders($db);
      echo json_encode($order->getToSendPOOrders());
    }
    elseif ($_POST['module']=="getToSendPOContent") {
      $db = new Database();
      $job = new Jobs($db);
      $job->setId($_POST['idOrder']);
      echo json_encode($job->getToSendPO());
    }


/*---------------------------------  Functions  ------------------------------*/

     function setOrders($result){
      //echo "Hola";

      foreach ($result["runs"] as $item => $value) {
        $db = new Database();
        $order = new Orders($db);
        $order->setId($value["id"]);
        $result2 =  ($order->verifyRepeatOrder()["COUNT(*)"]);


        if ($result2 == '0') {
          $db = new Database();
          $order = new Orders($db);
          $order->setId($value["id"]);
          $order->setCreatedDate($value["created_date"]);
          $order->setName($value["name"]);
          $order->setRuntype($value["runtype"]);
          $order->setDescription($value["description"]);
          $order->setFinishedDate($value["finished_date"]);
          $order->setWorkgroup($value["workgroup"]);
          json_encode($order->createUser());
        }
        elseif ($result2 == '1') {
        }
      }
     }
     function setOrdersContent($result, $idOrder){
       $searchedCharacter = "'";
       $neewCharacter = "''";
       $customerInfo = array();
       $customerInfoReturn = array();


       $varDataNo = 50224;

        foreach ($result["jobs"] as $item => $value) {
           $db = new Database();
           $job = new Jobs($db);
           $job->setId(str_replace($searchedCharacter, $neewCharacter, $value["id"]));
           $result2 =  ($job->verifyRepeatJob()["COUNT(*)"]);

           //echo $value["despatch_customer_code"]."  ";
           if ($result2 == '0'){

           $customerInfo[] = $value["addresses"];
           $customerInfo[] = $value["reseller_details"];

           $customerInfoReturn = saveCustomer($customerInfo);
           $idCustomer = $customerInfoReturn[0];
           $nameCustomer = $customerInfoReturn[1];


           $db = new Database();
           $job = new Jobs($db);
           $dataNo = $job->getLastDataNo()["data_no"];

           if ($dataNo == NULL || $dataNo == "" || $dataNo == false) {
             $dataNo = 50224;
           }

           else {
             $dataNo = intval($dataNo)  + 1;
           }

           $db = new Database();
           $job = new Jobs($db);

           $job->setId(str_replace($searchedCharacter, $neewCharacter, $value["id"]));
           $job->setStatus(str_replace($searchedCharacter, $neewCharacter, $value["status"]));
           $job->setCustomer(str_replace($searchedCharacter, $neewCharacter, $nameCustomer));
           $job->setContact(str_replace($searchedCharacter, $neewCharacter, $value["contact"]) );
           $job->setQuantityAllocated(  str_replace($searchedCharacter, $neewCharacter, $value["quantity_allocated"])  );
           $job->setQuantityPrinted(  str_replace($searchedCharacter, $neewCharacter, $value["quantity_printed"])  );
           $job->setQuantityDespatched(  str_replace($searchedCharacter, $neewCharacter, $value["quantity_despatched"])  );
           $job->setTotalTransfer(  str_replace($searchedCharacter, $neewCharacter, $value["total_transfer"])  );
           $job->setTotalSelling(  str_replace($searchedCharacter, $neewCharacter, $value["total_selling"])  );
           $job->setTotal(  str_replace($searchedCharacter, $neewCharacter, $value["total"])  );
           $job->setProductCode(  str_replace($searchedCharacter, $neewCharacter, $value["product_code"])  );
           $job->setClientReference(  str_replace($searchedCharacter, $neewCharacter, $value["client_reference"])  );
           $job->setTotalPrcost(  str_replace($searchedCharacter, $neewCharacter, $value["setTotalPrcost"])  );
           $job->setTitle(  str_replace($searchedCharacter, $neewCharacter, $value["title"])  );
           $job->setCategory(  str_replace($searchedCharacter, $neewCharacter, $value["category"])  );
           $job->setQuantity(  str_replace($searchedCharacter, $neewCharacter, $value["quantity"])  );
           $job->setAuto081(  str_replace($searchedCharacter, $neewCharacter, $value["auto081"])  );
           $job->setService(  str_replace($searchedCharacter, $neewCharacter, $value["service"])  );
           $job->setSupplierReference(  str_replace($searchedCharacter, $neewCharacter, $value["supplier_reference"])  );
           $job->setReprintof(  str_replace($searchedCharacter, $neewCharacter, $value["reprintof"])  );
           $job->setReprintas(  str_replace($searchedCharacter, $neewCharacter, $value["reprintas"])  );
           $job->setReorderof(  str_replace($searchedCharacter, $neewCharacter, $value["reorderof"])  );
           $job->setReorderas(  str_replace($searchedCharacter, $neewCharacter, $value["reorderas"])  );
           $job->setProductName(  str_replace($searchedCharacter, $neewCharacter, $value["product_name"])  );
           $job->setSpec(  str_replace($searchedCharacter, $neewCharacter, $value["spec"])  );
           $job->setTurnaround(  str_replace($searchedCharacter, $neewCharacter, $value["turnaround"])  );
           $job->setSchedule(  str_replace($searchedCharacter, $neewCharacter, $value["schedule"])  );
           $job->setWeight(  str_replace($searchedCharacter, $neewCharacter, $value["weight"])  );
           $job->setStatusText(  str_replace($searchedCharacter, $neewCharacter, $value["status_text"])  );
           $job->setStatusNote(  str_replace($searchedCharacter, $neewCharacter, $value["status_note"])  );
           $job->setHeight(  str_replace($searchedCharacter, $neewCharacter, $value["height"])  );
           $job->setWidth(  str_replace($searchedCharacter, $neewCharacter, $value["width"])  );
           $job->setBleed(  str_replace($searchedCharacter, $neewCharacter, $value["bleed"])  );
           $job->setResellerWorkgroup(  str_replace($searchedCharacter, $neewCharacter, $value["reseller_workgroup"])  );

           //$job->setResellerDetails(  str_replace($searchedCharacter, $neewCharacter, $value["reseller_details"])  );

           $job->setProductSpec(  str_replace($searchedCharacter, $neewCharacter, $value["product_spec"])  );
           $job->setProductDesign(  str_replace($searchedCharacter, $neewCharacter, $value["product_design"])  );
           $job->setProductSpecial(  str_replace($searchedCharacter, $neewCharacter, $value["product_special"])  );
           $job->setProductPartnerCode(  str_replace($searchedCharacter, $neewCharacter, $value["product_partner_code"])  );
           $job->setProdWorkgroup(  str_replace($searchedCharacter, $neewCharacter, $value["prod_workgroup"])  );
           $job->setMultifile(  str_replace($searchedCharacter, $neewCharacter, $value["multifile"])  );
           $job->setExpectedDespatchDate(  str_replace($searchedCharacter, $neewCharacter, $value["expected_despatch_date"])  );
           $job->setFrontFilename(  str_replace($searchedCharacter, $neewCharacter, $value["front_filename"])  );
           $job->setReverseFilename(  str_replace($searchedCharacter, $neewCharacter, $value["reverse_filename"])  );
           $job->setFeeChargedOnJob(  str_replace($searchedCharacter, $neewCharacter, $value["fee_charged_on_job"])  );
           $job->setPages(  str_replace($searchedCharacter, $neewCharacter, $value["pages"])  );
           $job->setDespatches(  str_replace($searchedCharacter, $neewCharacter, $value["despatches"])  );

           $job->setAddresses($idCustomer);
           $job->setDataNo($dataNo);



           $job->setRevenue(  str_replace($searchedCharacter, $neewCharacter, $value["revenue"])  );
           $job->setNotes(  str_replace($searchedCharacter, $neewCharacter, $value["notes"])  );
           $job->setFinishes(  str_replace($searchedCharacter, $neewCharacter, $value["finishes"])  );
           $job->setOrientation(  str_replace($searchedCharacter, $neewCharacter, $value["orientation"])  );
           $job->setOrderCode(  str_replace($searchedCharacter, $neewCharacter, $value["order_code"])  );
           $job->setPackageCode(  str_replace($searchedCharacter, $neewCharacter, $value["package_code"])  );
           $job->setJobmakerPack(  str_replace($searchedCharacter, $neewCharacter, $value["jobmaker_pack"])  );
           $job->setFilePaths(  str_replace($searchedCharacter, $neewCharacter, $value["file_paths"])  );
           $job->setReverse(  str_replace($searchedCharacter, $neewCharacter, $value["reverse"])  );
           $job->setIdOrder( $idOrder );
           $job->setIdSupplier(1);
           $job->setIdUser($_SESSION['idUser']);



            json_encode($job->createJob() );
         }
        }
      //echo json_encode($result);
     }
     function saveCustomer($customerInfo){
      //   echo json_encode($customerInfo);
      $idCustomer;
      $customerInfoReturn = array();

      foreach ( $customerInfo[0] as $item => $value) {
        $db = new Database();
        $customer = new Customers($db);
        $customer->setDespatchCustomerCode($value["despatch_customer_code"]);
        $result2 =  ($customer->verifyRepeatCustomer()["COUNT(*)"]);

        //echo $value["despatch_customer_code"]."  ";
        if ($result2 == '0'){
        $db = new Database();
        $customer = new Customers($db);
        $customer->setName($value["name"]);
        $customer->setAddr1($value["addr1"]);
        $customer->setAddr2($value["addr2"]);
        $customer->setAddr3($value["addr3"]);
        $customer->setAddr4($value["addr4"]);
        $customer->setAddr5($value["addr5"]);
        $customer->setAddr6($value["addr6"]);
        $customer->setPostcode($value["postcode"]);
        $customer->setCountrycode($value["countrycode"]);
        $customer->setContact($value["contact"]);
        $customer->setTelephone($value["telephone"]);
        $customer->setEmail($value["email"]);
        $customer->setBestName($value["best_name"]);
        $customer->setCountry($value["country"]);
        $customer->setQuantity($value["quantity"]);
        $customer->setDespatchMethod($value["despatch_method"]);
        $customer->setDespatchMethodName($value["despatch_method_name"]);
        $customer->setDespatchCustomerCode($value["despatch_customer_code"]);
        $customer->setDespatchCustomerAddressId($value["despatch_customer_address_id"]);
        $customer->setLine($value["line"]);
        $customer->createCustomer();

      }
      $customerInfoReturn[] = $value["despatch_customer_code"];
      $customerInfoReturn[] = $value["name"];

        //$idCustomer = $value["despatch_customer_code"];
      }


      return $customerInfoReturn;
     }

 ?>
