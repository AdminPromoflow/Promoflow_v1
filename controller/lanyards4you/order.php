<?php
require_once '../config/database.php';
require_once '../../models/orders.php';

class Order
{
    private $orderData = [];

    public function saveLanyardForYou()
    {
        $connection = new Database();
        $modelOrder = new Model_Order($connection);

        if (!empty($this->orderData['orders'])) {
            $modelOrder->setOrders($this->orderData['orders']);
        }

        if (!empty($this->orderData['jobs'])) {
            $modelOrder->setJobs($this->orderData['jobs']);
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

        if (!empty($this->orderData['users'])) {
            $modelOrder->setUsers($this->orderData['users']);
        }

        $result = $modelOrder->createOrder();

        file_put_contents('log.txt', $result ? "status: success" : "status: error");
    }

    public function setOrder($data)
    {
        $this->orderData = $data;
    }
}
?>
