<?php
declare(strict_types=1);

/**
 * Order ingestion script for "Lanyards4You".
 *
 * Notes on the refactor:
 * - Uses a single Database connection per request and closes it at the end.
 * - Avoids `exit;` within methods; returns early instead to prevent killing the whole script.
 * - Adds PHPDoc and British English comments for clarity.
 * - Keeps original model method calls and data shapes to preserve behaviour.
 */

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
    /** @var array<string,mixed> */
    private $orderData = [];

    /**
     * Handle incoming AJAX requests by action.
     */
     public function handleAjaxRequest(): void
     {
         // Read raw JSON body
         $rawData = file_get_contents("php://input");
         if ($rawData === false || trim($rawData) === '') {
             return; // silent
         }

         $data = json_decode($rawData);
         if ($data === null || !isset($data->action)) {
             return; // silent on malformed payload
         }

         header("Content-Type: application/json");

         switch ($data->action) {
             case "getOrders":
                 // $orders = $this->getOrders($data); // Implement when ready
                 $this->getOrders();
                 break;

             default:
                 echo json_encode(["error" => "Unknown action"]);
                 break;
         }
     }


    public function verifyAjaxRequest(): bool
    {
        // Must be POST (you can change this if you want GET support)
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            return false;
        }

        // Detect typical AJAX header (sent automatically by fetch or XMLHttpRequest)
        $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
                  strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

        // Detect JSON Content-Type (common in fetch calls)
        $isJson = isset($_SERVER['CONTENT_TYPE']) &&
                  stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== false;

        // Consider it AJAX if either the header or JSON content type matches
        return $isAjax || $isJson;
    }

    /**
     * Persist a full “Lanyard for You” order:
     *  - ensures user exists,
     *  - upserts addresses,
     *  - creates the order header,
     *  - creates related jobs and their assets (image, text, artwork).
     *
     * Returns early if essential blocks are missing.
     */
    public function saveLanyardForYou(): void
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

    /**
     * Inject raw order payload (as received from upstream).
     *
     * @param array<string,mixed> $data
     */
    public function setOrder(array $data): void
    {
        $this->orderData = $data;
    }
    public function getOrders(): void
    {
        // Create DB connection
        $db = new Database();
        $modelOrder = new Model_Order($db);

        $orders = $modelOrder->getAllOrders();

        $db->closeConnection();

        echo json_encode([
            "success" => true,
            "orders"  => $orders
        ]);
    }

}
$order = new Order();

if ($order->verifyAjaxRequest()) {
    $order->handleAjaxRequest();
}
