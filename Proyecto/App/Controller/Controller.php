<?php
session_start();
require_once('../Config/database.php');
require_once('../Models/Users.php');




    if ($_POST['module'] = "getUsers") {
      $db = new Database();
      $user = new Users($db);
      $result = json_encode($user->getUsers());
      echo $result;
    }
  






 ?>
