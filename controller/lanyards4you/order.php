<?php

require_once '../config/database.php';
require_once '../../model/lanyards4you/order.php';

class Order

{
    private $orderData = [];

    public function saveLanyardForYou()
    {
  file_put_contents('log2.txt', "Día 2 pueba 2");exit;
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
            if (isset($this->orderData['addresses'][0])) {
                $modelOrder->setAddresses1($this->orderData['addresses'][0]);
            }
            if (isset($this->orderData['addresses'][1])) {
                $modelOrder->setAddresses2($this->orderData['addresses'][1]);
            }
        }


        if (!empty($this->orderData['user'])) {
            $modelOrder->setUsers($this->orderData['user']);
        }

        $result = $modelOrder->saveOrder();

        file_put_contents('log2.txt', $result ? "status: success" : "status: error");
    }

    public function setOrder($data)
    {
        $this->orderData = $data;
    }
}
?>
