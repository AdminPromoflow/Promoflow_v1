<?php
require_once '../config/database.php';
require_once '../../models/orders.php';

class Order
{
    private $orderData = [];

    public function saveLanyardForYou()
    {

    }

    public function setOrder($data)
    {
        $this->orderData = $data;
    }
}
?>
