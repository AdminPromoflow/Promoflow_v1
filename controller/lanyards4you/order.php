<?php

require_once '../config/database.php';
require_once '../../models/orders.php';

file_put_contents('log.txt',"funciona2");
exit;
class Order

{
    private $orderData = [];

    public function saveLanyardForYou()
    {
        $connection = new Database();
        $modelOrder = new Model_Order($connection);

        if (!empty($this->orderData['order'])) {
            $modelOrder->setOrders($this->orderData['order']);
        }

        if (!empty($this->orderData['job'])) {
            $modelOrder->setJobs($this->orderData['job']);
        }

        if (!empty($this->orderData['image'])) {
            $modelOrder->setImage($this->orderData['image']);
        }

        if (!empty($this->orderData['text'])) {
            $modelOrder->setText($this->orderData['text']);
        }

        if (!empty($this->orderData['artwork'])) {
            $modelOrder->setArtwork($this->orderData['artwork']);
        }

        if (!empty($this->orderData['addresses'])) {
            $modelOrder->setAddresses($this->orderData['addresses']);
        }

        if (!empty($this->orderData['user'])) {
            $modelOrder->setUsers($this->orderData['user']);
        }

        $result = $modelOrder->createOrder();

        file_put_contents('log2.txt', $result ? "status: success" : "status: error");
    }

    public function setOrder($data)
    {
        $this->orderData = $data;
    }
}
?>
