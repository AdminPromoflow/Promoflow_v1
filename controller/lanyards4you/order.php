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
      $modelUser  = new User_Model($connection);

      if (!empty($this->orderData['user'])) {
          $modelUser->setUser($this->orderData['user']);

          if (!$modelUser->userExist(false)) {
              $modelUser->createUser();
          }
      }
      else {
        exit;
      }




      if (isset($this->orderData['addresses'][0])) {
        $connection      = new Database();
        $modelAddresses  = new Addresses_Model($connection);

        $modelAddresses->setAddress($this->orderData['addresses'][0]);

          if (!$modelAddresses->addressExist(false)) {
              $modelAddresses->createAddress(false);
          } else {
              $modelAddresses->updateAddress(false);
          }
      }

      if (isset($this->orderData['addresses'][1])) {
          $modelAddresses->setAddress($this->orderData['addresses'][1]);

          if (!$modelAddresses->addressExist(false)) {
              $modelAddresses->createAddress(true);
          } else {
              $modelAddresses->updateAddress(true);
          }
      }




      if (!empty($this->orderData['order'])) {
        $connection = new Database();
        $modelOrder = new Model_Order($connection);
        $modelOrder->setOrders($this->orderData['order']);

      }
      else {
        exit;
      }












    /*    $connection = new Database();
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
        }*/








      //  $result = $modelOrder->saveOrder();

        //file_put_contents('log2.txt', "Bueno 7");
    }

    public function setOrder($data)
    {
        $this->orderData = $data;
    }
}
?>
