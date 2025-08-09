<?php

require_once '../config/database.php';
require_once '../../model/lanyards4you/addresses.php';
require_once '../../model/lanyards4you/artwork.php';
require_once '../../model/lanyards4you/image.php';
require_once '../../model/lanyards4you/job.php';
require_once '../../model/lanyards4you/order.php';
require_once '../../model/lanyards4you/text.php';
require_once '../../model/lanyards4you/user.php';

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


        $connection = new Database();
        $modelJob = new Job_Model($connection);


        if (!empty($this->orderData['job'])) {
            $modelJob->setJobs($this->orderData['job']);
        }

        $connection = new Database();
        $modelImage = new Image_Model($connection);



        if (!empty($this->orderData['image'])) {
            $modelImage->setImage($this->orderData['image']);
        }


        $connection = new Database();
        $modelText = new Text_Model($connection);



        if (!empty($this->orderData['text'])) {
            $modelText->setText($this->orderData['text']);
        }


        $connection = new Database();
        $modelArtwork = new Artwork_Model($connection);


        if (!empty($this->orderData['artwork'])) {
            $modelArtwork->setArtwork($this->orderData['artwork']);
        }

        $connection = new Database();
        $modelAddresses = new Addresses_Model($connection);

        file_put_contents('log2.txt', "Bueno3");exit;

        if (!empty($this->orderData['addresses'])) {
            if (isset($this->orderData['addresses'][0])) {
                $modelAddresses->setAddresses1($this->orderData['addresses'][0]);
            }
            if (isset($this->orderData['addresses'][1])) {
                $modelAddresses->setAddresses2($this->orderData['addresses'][1]);
            }
        }


        $connection = new Database();
        $modelUser  = new User_Model($connection);



        if (!empty($this->orderData['user'])) {
            $modelUser->setUsers($this->orderData['user']);
        }

      //  $result = $modelOrder->saveOrder();

        file_put_contents('log2.txt', "Bueno");
    }

    public function setOrder($data)
    {
        $this->orderData = $data;
    }
}
?>
