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
                 echo json_encode(["success" => true, "orders" => []]);
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
        // Create a single DB connection for the whole operation.
        $db = new Database();

        // ---- USER -----------------------------------------------------------------
        // We require user data to proceed. Create if not present in the DB.
        if (!empty($this->orderData['user'])) {
            $userModel = new User_Model($db);
            $userModel->setUser($this->orderData['user']);

            if (!$userModel->userExist(false)) {
                $userModel->createUser();
            }
        } else {
            // No user data – nothing sensible to do.
            $db->closeConnection();
            return;
        }

        // ---- ADDRESSES ------------------------------------------------------------
        // Upsert up to two addresses (index 0 and 1) if provided.
        if (!empty($this->orderData['addresses']) && is_array($this->orderData['addresses'])) {
            $addressesModel = new Addresses_Model($db);

            // Billing / primary address at index 0
            if (isset($this->orderData['addresses'][0]) && is_array($this->orderData['addresses'][0])) {
                $addressesModel->setAddress($this->orderData['addresses'][0]);
                if (!$addressesModel->addressExist(false)) {
                    $addressesModel->createAddress(false);  // false -> first address slot
                } else {
                    $addressesModel->updateAddress(false);
                }
            }

            // Delivery / secondary address at index 1
            if (isset($this->orderData['addresses'][1]) && is_array($this->orderData['addresses'][1])) {
                $addressesModel->setAddress($this->orderData['addresses'][1]);
                if (!$addressesModel->addressExist(true)) {
                    $addressesModel->createAddress(true);   // true -> second address slot
                } else {
                    $addressesModel->updateAddress(true);
                }
            }
        }

        // ---- ORDER HEADER ---------------------------------------------------------
        // The order header is essential; without it, jobs have nowhere to attach.
        if (!empty($this->orderData['order'])) {
            $orderModel = new Model_Order($db);
            $orderModel->setOrders($this->orderData['order']);
            // The original code called createOrder(false). Keep the same flag.
            $orderModel->createOrder(false);
        } else {
            // No order header – abort politely.
            $db->closeConnection();
            return;
        }

        // ---- JOBS & ASSETS --------------------------------------------------------
        // Each entry in 'jobs' is a bundle containing a job and optional assets.
        if (!empty($this->orderData['jobs']) && is_array($this->orderData['jobs'])) {
            foreach ($this->orderData['jobs'] as $bundle) {
                if (!is_array($bundle)) {
                    continue; // Be defensive: skip anything malformed.
                }

                // JOB (required per bundle to create assets meaningfully)
                if (isset($bundle['job'], $bundle['job']['idJobs']) && is_array($bundle['job'])) {
                    $jobModel = new Job_Model($db);
                    $jobModel->setJobs($bundle['job']);
                    $jobModel->createJob(false); // do not close/commit yet – mirrors original behaviour
                }

                // IMAGE
                if (isset($bundle['image'], $bundle['image']['idJobs']) && is_array($bundle['image'])) {
                    $imageModel = new Image_Model($db);
                    $imageModel->setImage($bundle['image']);
                    $imageModel->createImage(false);
                }

                // TEXT
                if (isset($bundle['text'], $bundle['text']['idJobs']) && is_array($bundle['text'])) {
                    $textModel = new Text_Model($db);
                    $textModel->setText($bundle['text']);
                    $textModel->createText(false);
                }

                // ARTWORK
                if (isset($bundle['artwork'], $bundle['artwork']['idJobs']) && is_array($bundle['artwork'])) {
                    $artworkModel = new Artwork_Model($db);
                    $artworkModel->setArtwork($bundle['artwork']);
                    $artworkModel->createArtwork(false);
                }
            }
        }

        // Always tidy up the connection at the end.
        $db->closeConnection();
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
}
$order = new Order();

if ($order->verifyAjaxRequest()) {
    $order->handleAjaxRequest();
}
