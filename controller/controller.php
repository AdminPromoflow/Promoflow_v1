<?php

class ApiHandlerSendForms {

    private $requestData = array();

    public function handleRequest() {
        header('Content-Type: application/json');

        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            $this->requestData = $this->getRequestData();

            $action = isset($this->requestData['action']) ? $this->requestData['action'] : null;

            if ($action === null) {
                http_response_code(400);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Missing action"
                ));
                return;
            }

            switch ($action) {
                case "send_emal_contact_us":
                    $this->handleContactUs();
                    break;

                case "send_new_sail_quote":
                    $this->handleNewSailQuote();
                    break;

                case "send_new_cover_quote":
                    $this->handleNewCoverQuote();
                    break;

                case "send_new_repair_quote":
                    $this->handleNewRepairQuote();
                    break;

                case "submit_customize_form":
                    $this->handleCustomizeSailForm();
                    break;

                default:
                    http_response_code(400);
                    echo json_encode(array(
                        "success" => false,
                        "message" => "Unknown action"
                    ));
                    break;
            }

        } else {
            http_response_code(405);
            echo json_encode(array(
                "success" => false,
                "message" => "Method not allowed"
            ));
        }
    }

    private function getRequestData() {
        $contentType = isset($_SERVER["CONTENT_TYPE"]) ? $_SERVER["CONTENT_TYPE"] : "";

        if (strpos($contentType, "application/json") !== false) {
            $input = file_get_contents("php://input");
            $jsonData = json_decode($input, true);

            if (is_array($jsonData)) {
                return $jsonData;
            }

            return array();
        }

        return $_POST;
    }

    private function handleContactUs() {
      echo json_encode("Hola lo logramos");exit;
        $contactName = isset($this->requestData['contactName']) ? $this->requestData['contactName'] : null;
        $contactNumber = isset($this->requestData['contactNumber']) ? $this->requestData['contactNumber'] : null;
        $contactLocation = isset($this->requestData['contactLocation']) ? $this->requestData['contactLocation'] : null;
        $contactEmail = isset($this->requestData['contactEmail']) ? $this->requestData['contactEmail'] : null;
        $contactMessage = isset($this->requestData['contactMessage']) ? $this->requestData['contactMessage'] : null;

        $file = isset($_FILES['file']) ? $_FILES['file'] : null;

        $data = (object) array(
            "action" => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            "contactName" => $contactName,
            "contactNumber" => $contactNumber,
            "contactLocation" => $contactLocation,
            "contactEmail" => $contactEmail,
            "contactMessage" => $contactMessage,
            "file" => $file
        );

        $emailSender = new EmailSender();

        $emailSent = $emailSender->sendEmailContactUs($data);

        echo json_encode($emailSent);
    }

    private function handleNewCoverQuote() {
        $firstName = isset($this->requestData['first_name']) ? $this->requestData['first_name'] : null;
        $lastName = isset($this->requestData['last_name']) ? $this->requestData['last_name'] : null;
        $email = isset($this->requestData['email']) ? $this->requestData['email'] : null;
        $phone = isset($this->requestData['phone']) ? $this->requestData['phone'] : null;
        $address1 = isset($this->requestData['address_1']) ? $this->requestData['address_1'] : null;
        $address2 = isset($this->requestData['address_2']) ? $this->requestData['address_2'] : null;
        $city = isset($this->requestData['city']) ? $this->requestData['city'] : null;
        $postcode = isset($this->requestData['postcode']) ? $this->requestData['postcode'] : null;
        $contactByPhone = isset($this->requestData['contact_by_phone']) ? $this->requestData['contact_by_phone'] : "0";
        $contactByEmail = isset($this->requestData['contact_by_email']) ? $this->requestData['contact_by_email'] : "0";
        $boatType = isset($this->requestData['boat_type']) ? $this->requestData['boat_type'] : null;
        $sailType = isset($this->requestData['sail_type']) ? $this->requestData['sail_type'] : null;
        $boatLocation = isset($this->requestData['boat_location']) ? $this->requestData['boat_location'] : null;
        $additionalInfo = isset($this->requestData['additional_info']) ? $this->requestData['additional_info'] : null;
        $newsletter = isset($this->requestData['newsletter']) ? $this->requestData['newsletter'] : "0";

        $data = (object) array(
            "action" => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            "first_name" => $firstName,
            "last_name" => $lastName,
            "email" => $email,
            "phone" => $phone,
            "address_1" => $address1,
            "address_2" => $address2,
            "city" => $city,
            "postcode" => $postcode,
            "contact_by_phone" => $contactByPhone,
            "contact_by_email" => $contactByEmail,
            "boat_type" => $boatType,
            "sail_type" => $sailType,
            "boat_location" => $boatLocation,
            "additional_info" => $additionalInfo,
            "newsletter" => $newsletter
        );

        $emailSender = new EmailSender();
        $emailSent = $emailSender->sendNewCoverQuote($data);
        echo json_encode($emailSent);
    }

    private function handleNewRepairQuote() {
        $firstName = isset($this->requestData['first_name']) ? $this->requestData['first_name'] : null;
        $lastName = isset($this->requestData['last_name']) ? $this->requestData['last_name'] : null;
        $email = isset($this->requestData['email']) ? $this->requestData['email'] : null;
        $phone = isset($this->requestData['phone']) ? $this->requestData['phone'] : null;
        $address1 = isset($this->requestData['address_1']) ? $this->requestData['address_1'] : null;
        $address2 = isset($this->requestData['address_2']) ? $this->requestData['address_2'] : null;
        $city = isset($this->requestData['city']) ? $this->requestData['city'] : null;
        $postcode = isset($this->requestData['postcode']) ? $this->requestData['postcode'] : null;
        $contactByPhone = isset($this->requestData['contact_by_phone']) ? $this->requestData['contact_by_phone'] : "0";
        $contactByEmail = isset($this->requestData['contact_by_email']) ? $this->requestData['contact_by_email'] : "0";
        $boatType = isset($this->requestData['boat_type']) ? $this->requestData['boat_type'] : null;
        $boatName = isset($this->requestData['boat_name']) ? $this->requestData['boat_name'] : null;
        $sailType = isset($this->requestData['sail_type']) ? $this->requestData['sail_type'] : null;
        $workLaundry = isset($this->requestData['work_laundry']) ? $this->requestData['work_laundry'] : "0";
        $workService = isset($this->requestData['work_service']) ? $this->requestData['work_service'] : "0";
        $workRepair = isset($this->requestData['work_repair']) ? $this->requestData['work_repair'] : "0";
        $workDetails = isset($this->requestData['work_details']) ? $this->requestData['work_details'] : null;
        $boatLocation = isset($this->requestData['boat_location']) ? $this->requestData['boat_location'] : null;
        $collectionDelivery = isset($this->requestData['collection_delivery']) ? $this->requestData['collection_delivery'] : null;
        $newsletter = isset($this->requestData['newsletter']) ? $this->requestData['newsletter'] : "0";

        $data = (object) array(
            "action" => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            "first_name" => $firstName,
            "last_name" => $lastName,
            "email" => $email,
            "phone" => $phone,
            "address_1" => $address1,
            "address_2" => $address2,
            "city" => $city,
            "postcode" => $postcode,
            "contact_by_phone" => $contactByPhone,
            "contact_by_email" => $contactByEmail,
            "boat_type" => $boatType,
            "boat_name" => $boatName,
            "sail_type" => $sailType,
            "work_laundry" => $workLaundry,
            "work_service" => $workService,
            "work_repair" => $workRepair,
            "work_details" => $workDetails,
            "boat_location" => $boatLocation,
            "collection_delivery" => $collectionDelivery,
            "newsletter" => $newsletter
        );

        $emailSender = new EmailSender();
        $emailSent = $emailSender->sendNewRepairQuote($data);
        echo json_encode($emailSent);
    }

    private function handleNewSailQuote() {

        $firstName = isset($this->requestData['first_name']) ? $this->requestData['first_name'] : null;
        $lastName = isset($this->requestData['last_name']) ? $this->requestData['last_name'] : null;
        $email = isset($this->requestData['email']) ? $this->requestData['email'] : null;
        $phone = isset($this->requestData['phone']) ? $this->requestData['phone'] : null;
        $address1 = isset($this->requestData['address_1']) ? $this->requestData['address_1'] : null;
        $address2 = isset($this->requestData['address_2']) ? $this->requestData['address_2'] : null;
        $city = isset($this->requestData['city']) ? $this->requestData['city'] : null;
        $postcode = isset($this->requestData['postcode']) ? $this->requestData['postcode'] : null;
        $contactByPhone = isset($this->requestData['contact_by_phone']) ? $this->requestData['contact_by_phone'] : "0";
        $contactByEmail = isset($this->requestData['contact_by_email']) ? $this->requestData['contact_by_email'] : "0";
        $boatType = isset($this->requestData['boat_type']) ? $this->requestData['boat_type'] : null;
        $sailType = isset($this->requestData['sail_type']) ? $this->requestData['sail_type'] : null;
        $sailUseRacing = isset($this->requestData['sail_use_racing']) ? $this->requestData['sail_use_racing'] : "0";
        $sailUseCruising = isset($this->requestData['sail_use_cruising']) ? $this->requestData['sail_use_cruising'] : "0";
        $boatLocation = isset($this->requestData['boat_location']) ? $this->requestData['boat_location'] : null;
        $additionalInfo = isset($this->requestData['additional_info']) ? $this->requestData['additional_info'] : null;
        $newsletter = isset($this->requestData['newsletter']) ? $this->requestData['newsletter'] : "0";

        $data = (object) array(
            "action" => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            "first_name" => $firstName,
            "last_name" => $lastName,
            "email" => $email,
            "phone" => $phone,
            "address_1" => $address1,
            "address_2" => $address2,
            "city" => $city,
            "postcode" => $postcode,
            "contact_by_phone" => $contactByPhone,
            "contact_by_email" => $contactByEmail,
            "boat_type" => $boatType,
            "sail_type" => $sailType,
            "sail_use_racing" => $sailUseRacing,
            "sail_use_cruising" => $sailUseCruising,
            "boat_location" => $boatLocation,
            "additional_info" => $additionalInfo,
            "newsletter" => $newsletter
        );

        $emailSender = new EmailSender();

        $emailSent = $emailSender->sendNewSailQuote($data);
        echo json_encode($emailSent);
    }

    private function handleCustomizeSailForm() {
        $name = isset($this->requestData['name']) ? $this->requestData['name'] : null;
        $email = isset($this->requestData['email']) ? $this->requestData['email'] : null;
        $salespersonEmail = isset($this->requestData['salesperson_email']) ? $this->requestData['salesperson_email'] : null;
        $boatName = isset($this->requestData['boat_name']) ? $this->requestData['boat_name'] : null;
        $boatDesignLength = isset($this->requestData['boat_design_length']) ? $this->requestData['boat_design_length'] : null;
        $sailType = isset($this->requestData['sail_type']) ? $this->requestData['sail_type'] : null;
        $clothWeight = isset($this->requestData['cloth_weight']) ? $this->requestData['cloth_weight'] : null;
        $pdfBase64 = isset($this->requestData['pdf_base64']) ? $this->requestData['pdf_base64'] : null;

        if (
            empty($name) ||
            empty($email) ||
            empty($salespersonEmail) ||
            empty($boatName) ||
            empty($boatDesignLength) ||
            empty($sailType) ||
            empty($clothWeight) ||
            empty($pdfBase64)
        ) {
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "message" => "Missing required fields"
            ));
            return;
        }

        $data = (object) array(
            "action" => isset($this->requestData['action']) ? $this->requestData['action'] : null,
            "name" => $name,
            "email" => $email,
            "salesperson_email" => $salespersonEmail,
            "boat_name" => $boatName,
            "boat_design_length" => $boatDesignLength,
            "sail_type" => $sailType,
            "cloth_weight" => $clothWeight,
            "pdf_base64" => $pdfBase64
        );

        $emailSender = new EmailSender();

        $emailSent = $emailSender->sendCustomizeSailForm($data);
        echo json_encode($emailSent);
    }
}

require_once __DIR__ . '/send_emails.php';

if (!defined('ABSPATH')) {
    $apiHandlerSendForms = new ApiHandlerSendForms();
    $apiHandlerSendForms->handleRequest();
}

?>
