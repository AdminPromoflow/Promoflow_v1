<?php
require_once('../../../config/database.php');
require_once('../../../models/W3P/W3P_products/Categories.php');
require_once('../../../models/W3P/W3P_products/Groups.php');
require_once('../../../models/W3P/W3P_products/Products.php');


    if ($_POST['module']=="getCategories") {
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

 ?>
