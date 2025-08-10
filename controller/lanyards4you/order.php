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

      //  file_put_contents('log2.txt', json_encode($this->orderData['jobs'][0]['job']));


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
        $modelOrder->createOrder(false);
      }
      else {
        exit;
      }

      $connection = new Database();

      if (!empty($this->orderData['jobs']) && is_array($this->orderData['jobs'])) {
          foreach ($this->orderData['jobs'] as $i => $bundle) {

              // JOB
              if (isset($bundle['job']) && is_array($bundle['job']) && isset($bundle['job']['idJobs'])) {
                  $modelJob = new Job_Model($connection);
                  $modelJob->setJobs($bundle['job']);
                  $modelJob->createJob(false); // no cerramos aún
              }

              // IMAGE
              if (isset($bundle['image']) && is_array($bundle['image']) && isset($bundle['image']['idJobs'])) {
                  $modelImage = new Image_Model($connection);
                  $modelImage->setImage($bundle['image']);
                  $modelImage->createImage(false);
              }

              // TEXT
              if (isset($bundle['text']) && is_array($bundle['text']) && isset($bundle['text']['idJobs'])) {
                  $modelText = new Text_Model($connection);
                  $modelText->setText($bundle['text']);
                  $modelText->createText(false);
              }

              // ARTWORK
              if (isset($bundle['artwork']) && is_array($bundle['artwork']) && isset($bundle['artwork']['idJobs'])) {
                  $modelArtwork = new Artwork_Model($connection);
                  $modelArtwork->setArtwork($bundle['artwork']);
                  $modelArtwork->createArtwork(false);
              }
          }
      }
      $connection->closeConnection();
    }

    public function setOrder($data)
    {
        $this->orderData = $data;
    }
}
?>
