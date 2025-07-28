<?php
require_once('../../../config/database.php');

require_once('../../../models/W3P/W3P_orders/Orders.php');

require_once('../../../models/W3P/W3P_orders/Jobs.php');

/*------------------------------  get ToSendPO  ------------------------------*/

/*-------------------------------  Customers  --------------------------------*/

    if ($_POST['module']=="getToSendPOOrders") {
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

 ?>
