<?php
// Include PHPMailer and its dependencies
require __DIR__ . '/assets/lib/send-email/PHPMailer/src/Exception.php';
require __DIR__ . '/assets/lib/send-email/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/assets/lib/send-email/PHPMailer/src/SMTP.php';

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailSender {

  public function sendEmailContactUs($data) {
      $contactName = isset($data->contactName) ? $data->contactName : '';
      $contactEmail = isset($data->contactEmail) ? $data->contactEmail : '';
      $contactNumber = isset($data->contactNumber) ? $data->contactNumber : '';
      $contactLocation = isset($data->contactLocation) ? $data->contactLocation : '';
      $contactMessage = isset($data->contactMessage) ? $data->contactMessage : '';
      $file = isset($data->file) ? $data->file : null;

      $mail = new PHPMailer(true);



      try {
          $mail->isSMTP();
          $mail->SMTPDebug = 0;
          $mail->Host = 'smtp.hostinger.com';
          $mail->Port = 587;
          $mail->SMTPAuth = true;
          $mail->Username = 'admin@promoflow.net';
          $mail->Password = '32skiff32CI!';
          $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

          $mail->CharSet = 'UTF-8';
          $mail->Encoding = 'base64';

          $mail->setFrom('admin@promoflow.net', 'Jon Pegg');
          $mail->addAddress('jon@ullmansails.co.uk', 'Jon Pegg');
          $mail->addAddress('aleinarossui@gmail.com', 'Aleja');
          $mail->addAddress('alerozochiquiza@gmail.com', 'Aleja');

          $mail->Subject = 'New Message from the Contact Us Form';
          $mail->isHTML(true);



          $recipientMessage = "
          <div style='margin:0; padding:40px 0; background:#f5f7fa; width:100%;'>
            <div style='width:92%; max-width:760px; margin:0 auto; background:#ffffff; border:1px solid #d9e1ea; box-shadow:0 18px 45px rgba(32,46,82,.10); overflow:hidden;'>
              <div style='background:#202E52; padding:26px 32px; text-align:left;'>
                <img src='https://lanyardsforyou.com/ullman_sails/general/menu/img/logo.png' alt='Ullman Sails' style='display:block; max-width:220px; height:auto;'>
              </div>
              <div style='padding:40px 32px 18px 32px;'>
                <p style='margin:0; font-family:Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#005598; font-weight:700;'>
                  Contact Us
                </p>
                <h1 style='margin:12px 0 10px 0; font-family:Arial, sans-serif; font-size:34px; line-height:1.15; color:#202E52; font-weight:700;'>
                  New customer enquiry
                </h1>
                <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; line-height:1.7; color:#5e6b7a; max-width:560px;'>
                  A new contact request has been submitted through the website. The customer details are below.
                </p>
              </div>
              <div style='padding:20px 32px 10px 32px;'>
                <div style='background:#ffffff; border:1px solid #dbe3ec;'>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                    <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Name</p>
                    <p style='margin:0; font-family:Arial, sans-serif; font-size:18px; color:#202E52; font-weight:600;'>$contactName</p>
                  </div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                    <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Email</p>
                    <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$contactEmail</p>
                  </div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                    <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Phone</p>
                    <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$contactNumber</p>
                  </div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                    <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Location</p>
                    <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$contactLocation</p>
                  </div>
                  <div style='padding:18px 22px;'>
                    <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Message</p>
                    <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$contactMessage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ";

          $mail->Body = $recipientMessage;
          $mail->AltBody = "New customer enquiry\nName: $contactName\nEmail: $contactEmail\nPhone: $contactNumber\nLocation: $contactLocation\nMessage: $contactMessage";

          if ($file && isset($file['tmp_name']) && $file['tmp_name'] !== '') {
              $mail->addAttachment($file['tmp_name'], $file['name']);
          }
        //   echo json_encode("Entramos5");exit;

          $mail->send();

          return array(
              "success" => true,
              "message" => "Your message has been sent successfully. One of our advisers will be in touch with you shortly."
          );
      } catch (Exception $e) {
          return array(
              "success" => false,
              "message" => $mail->ErrorInfo
          );
      }
  }




public function sendCustomizeSailForm($data) {
    $name = isset($data->name) ? $data->name : '';
    $email = isset($data->email) ? $data->email : '';
    $salespersonEmail = isset($data->salesperson_email) ? $data->salesperson_email : '';
    $boatName = isset($data->boat_name) ? $data->boat_name : '';
    $boatDesignLength = isset($data->boat_design_length) ? $data->boat_design_length : '';
    $sailType = isset($data->sail_type) ? $data->sail_type : '';
    $clothWeight = isset($data->cloth_weight) ? $data->cloth_weight : '';
    $pdfBase64 = isset($data->pdf_base64) ? $data->pdf_base64 : '';

    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safeSalespersonEmail = htmlspecialchars($salespersonEmail, ENT_QUOTES, 'UTF-8');
    $safeBoatName = htmlspecialchars($boatName, ENT_QUOTES, 'UTF-8');
    $safeBoatDesignLength = htmlspecialchars($boatDesignLength, ENT_QUOTES, 'UTF-8');
    $safeSailType = htmlspecialchars($sailType, ENT_QUOTES, 'UTF-8');
    $safeClothWeight = htmlspecialchars($clothWeight, ENT_QUOTES, 'UTF-8');

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->SMTPDebug = 0;
        $mail->Host = 'smtp.hostinger.com';
        $mail->Port = 587;
        $mail->SMTPAuth = true;
        $mail->Username = 'admin@promoflow.net';

        /*
          Usa aquí tu contraseña actual o, mejor,
          una variable de entorno.
        */
        $mail->Password = '32skiff32CI!';

        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->setFrom('admin@promoflow.net', 'Jon Pegg');

        if (!empty($email)) {
            $mail->addReplyTo($email, $name);
        } else {
            $mail->addAddress('aleinarossui@gmail.com', 'Ale Rozo');
            $mail->addAddress('jon@ullmansails.co.uk', 'Aleja');
            $mail->addAddress('alerozochiquiza@gmail.com', 'Aleja');

        }

        if (!empty($salespersonEmail)) {
            $mail->addAddress($salespersonEmail, 'Salesperson');
        }

        $mail->addAddress('aleinarossui@gmail.com', 'Aleja');
        $mail->addAddress('jon@ullmansails.co.uk', 'Aleja');
        $mail->addAddress('alerozochiquiza@gmail.com', 'Aleja');


        $mail->Subject = 'New Custom Sail Design Request';
        $mail->isHTML(true);

        $recipientMessage = "
        <div style='margin:0; padding:40px 0; background:#f5f7fa; width:100%;'>
          <div style='width:92%; max-width:760px; margin:0 auto; background:#ffffff; border:1px solid #d9e1ea; box-shadow:0 18px 45px rgba(32,46,82,.10); overflow:hidden;'>

            <div style='background:#202E52; padding:26px 32px; text-align:left;'>
              <img src='https://lanyardsforyou.com/ullman_sails/general/menu/img/logo.png' alt='Ullman Sails' style='display:block; max-width:220px; height:auto;'>
            </div>

            <div style='padding:40px 32px 18px 32px;'>
              <p style='margin:0; font-family:Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#005598; font-weight:700;'>
                Custom Sail Design
              </p>

              <h1 style='margin:12px 0 10px 0; font-family:Arial, sans-serif; font-size:34px; line-height:1.15; color:#202E52; font-weight:700;'>
                New custom sail design request
              </h1>

              <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; line-height:1.7; color:#5e6b7a; max-width:560px;'>
                A customer has submitted a custom sail design from the website. The selected sail design PDF is attached to this email.
              </p>
            </div>

            <div style='padding:20px 32px 32px 32px;'>
              <div style='background:#ffffff; border:1px solid #dbe3ec;'>

                <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                  <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Name</p>
                  <p style='margin:0; font-family:Arial, sans-serif; font-size:18px; color:#202E52; font-weight:600;'>$safeName</p>
                </div>

                <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                  <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Customer Email</p>
                  <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$safeEmail</p>
                </div>

                <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                  <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Salesperson Email</p>
                  <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$safeSalespersonEmail</p>
                </div>

                <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                  <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Boat Name</p>
                  <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$safeBoatName</p>
                </div>

                <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                  <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Boat Design / Length</p>
                  <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$safeBoatDesignLength</p>
                </div>

                <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'>
                  <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Sail Type</p>
                  <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$safeSailType</p>
                </div>

                <div style='padding:18px 22px;'>
                  <p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Cloth Weight</p>
                  <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$safeClothWeight</p>
                </div>

              </div>
            </div>

          </div>
        </div>
        ";

        $mail->Body = $recipientMessage;

        $mail->AltBody = "New custom sail design request
Name: $name
Customer Email: $email
Salesperson Email: $salespersonEmail
Boat Name: $boatName
Boat Design / Length: $boatDesignLength
Sail Type: $sailType
Cloth Weight: $clothWeight";

        if (!empty($pdfBase64)) {
            $pdfBase64 = str_replace('data:application/pdf;filename=generated.pdf;base64,', '', $pdfBase64);
            $pdfBase64 = str_replace('data:application/pdf;base64,', '', $pdfBase64);

            $pdfContent = base64_decode($pdfBase64);

            if ($pdfContent !== false) {
                $mail->addStringAttachment(
                    $pdfContent,
                    'custom-spinnaker.pdf',
                    'base64',
                    'application/pdf'
                );
            }
        }

        $mail->send();

        return array(
            "success" => true,
            "message" => "Your custom sail design request has been sent successfully. One of our advisers will be in touch with you shortly."
        );

    } catch (Exception $e) {
        return array(
            "success" => false,
            "message" => $mail->ErrorInfo
        );
    }
}


  public function sendNewCoverQuote($data) {


      $firstName = isset($data->first_name) ? $data->first_name : '';
      $lastName = isset($data->last_name) ? $data->last_name : '';
      $email = isset($data->email) ? $data->email : '';
      $phone = isset($data->phone) ? $data->phone : '';
      $address1 = isset($data->address_1) ? $data->address_1 : '';
      $address2 = isset($data->address_2) ? $data->address_2 : '';
      $city = isset($data->city) ? $data->city : '';
      $postcode = isset($data->postcode) ? $data->postcode : '';
      $contactByPhone = isset($data->contact_by_phone) ? $data->contact_by_phone : '0';
      $contactByEmail = isset($data->contact_by_email) ? $data->contact_by_email : '0';
      $boatType = isset($data->boat_type) ? $data->boat_type : '';
      $sailType = isset($data->sail_type) ? $data->sail_type : '';
      $boatLocation = isset($data->boat_location) ? $data->boat_location : '';
      $additionalInfo = isset($data->additional_info) ? $data->additional_info : '';
      $newsletter = isset($data->newsletter) ? $data->newsletter : '0';

      $contactPreference = array();
      if ($contactByPhone === '1') {
          $contactPreference[] = 'Phone';
      }
      if ($contactByEmail === '1') {
          $contactPreference[] = 'Email';
      }
      $contactPreferenceText = !empty($contactPreference) ? implode(', ', $contactPreference) : 'Not specified';
      $newsletterText = $newsletter === '1' ? 'Yes' : 'No';

      $mail = new PHPMailer(true);

      try {
          $mail->isSMTP();
          $mail->SMTPDebug = 0;
          $mail->Host = 'smtp.hostinger.com';
          $mail->Port = 587;
          $mail->SMTPAuth = true;
          $mail->Username = 'admin@promoflow.net';
          $mail->Password = '32skiff32CI!';
          $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

          $mail->CharSet = 'UTF-8';
          $mail->Encoding = 'base64';

          $mail->setFrom('admin@promoflow.net', 'Jon Pegg');
          $mail->addAddress('vicky@ullmansails.co.uk', 'Jon Pegg');
          $mail->addAddress('aleinarossui@gmail.com', 'Aleja');
          $mail->addAddress('alerozochiquiza@gmail.com', 'Aleja');


          $mail->Subject = 'New Cover Quote Request';
          $mail->isHTML(true);

          $recipientMessage = "
          <div style='margin:0; padding:40px 0; background:#f5f7fa; width:100%;'>
            <div style='width:92%; max-width:760px; margin:0 auto; background:#ffffff; border:1px solid #d9e1ea; box-shadow:0 18px 45px rgba(32,46,82,.10); overflow:hidden;'>
              <div style='background:#202E52; padding:26px 32px; text-align:left;'>
                <img src='https://lanyardsforyou.com/ullman_sails/general/menu/img/logo.png' alt='Ullman Sails' style='display:block; max-width:220px; height:auto;'>
              </div>
              <div style='padding:40px 32px 18px 32px;'>
                <p style='margin:0; font-family:Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#005598; font-weight:700;'>
                  Covers Quote
                </p>
                <h1 style='margin:12px 0 10px 0; font-family:Arial, sans-serif; font-size:34px; line-height:1.15; color:#202E52; font-weight:700;'>
                  New cover quote request
                </h1>
                <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; line-height:1.7; color:#5e6b7a; max-width:560px;'>
                  A new cover quote request has been submitted through the website.
                </p>
              </div>
              <div style='padding:20px 32px 10px 32px;'>
                <div style='background:#ffffff; border:1px solid #dbe3ec;'>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>First Name</p><p style='margin:0; font-family:Arial, sans-serif; font-size:18px; color:#202E52; font-weight:600;'>$firstName</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Last Name</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$lastName</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Email</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$email</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Phone</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$phone</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Address</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$address1</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Address line 2</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$address2</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>City</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$city</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Postcode</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$postcode</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Preferred Contact Method</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$contactPreferenceText</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Type of Boat</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$boatType</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Type of Sail</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$sailType</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Boat Location</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$boatLocation</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Newsletter</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$newsletterText</p></div>
                  <div style='padding:18px 22px;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Additional Information</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$additionalInfo</p></div>
                </div>
              </div>
            </div>
          </div>
          ";

          $mail->Body = $recipientMessage;
          $mail->AltBody = "New cover quote request
      First Name: $firstName
      Last Name: $lastName
      Email: $email
      Phone: $phone
      Address: $address1
      Address line 2: $address2
      City: $city
      Postcode: $postcode
      Preferred Contact Method: $contactPreferenceText
      Type of Boat: $boatType
      Type of Sail: $sailType
      Boat Location: $boatLocation
      Newsletter: $newsletterText
      Additional Information: $additionalInfo";

          $mail->send();

          return array(
              "success" => true,
              "message" => "Your quote request has been sent successfully. One of our advisers will be in touch with you shortly."
          );
      } catch (Exception $e) {
          return array(
              "success" => false,
              "message" => $mail->ErrorInfo
          );
      }
  }

  public function sendNewRepairQuote($data) {
      $firstName = isset($data->first_name) ? $data->first_name : '';
      $lastName = isset($data->last_name) ? $data->last_name : '';
      $email = isset($data->email) ? $data->email : '';
      $phone = isset($data->phone) ? $data->phone : '';
      $address1 = isset($data->address_1) ? $data->address_1 : '';
      $address2 = isset($data->address_2) ? $data->address_2 : '';
      $city = isset($data->city) ? $data->city : '';
      $postcode = isset($data->postcode) ? $data->postcode : '';
      $contactByPhone = isset($data->contact_by_phone) ? $data->contact_by_phone : '0';
      $contactByEmail = isset($data->contact_by_email) ? $data->contact_by_email : '0';
      $boatType = isset($data->boat_type) ? $data->boat_type : '';
      $boatName = isset($data->boat_name) ? $data->boat_name : '';
      $sailType = isset($data->sail_type) ? $data->sail_type : '';
      $workLaundry = isset($data->work_laundry) ? $data->work_laundry : '0';
      $workService = isset($data->work_service) ? $data->work_service : '0';
      $workRepair = isset($data->work_repair) ? $data->work_repair : '0';
      $workDetails = isset($data->work_details) ? $data->work_details : '';
      $boatLocation = isset($data->boat_location) ? $data->boat_location : '';
      $collectionDelivery = isset($data->collection_delivery) ? $data->collection_delivery : '';
      $newsletter = isset($data->newsletter) ? $data->newsletter : '0';

      $contactPreference = array();
      if ($contactByPhone === '1') {
          $contactPreference[] = 'Phone';
      }
      if ($contactByEmail === '1') {
          $contactPreference[] = 'Email';
      }
      $contactPreferenceText = !empty($contactPreference) ? implode(', ', $contactPreference) : 'Not specified';

      $workRequired = array();
      if ($workLaundry === '1') {
          $workRequired[] = 'Laundry';
      }
      if ($workService === '1') {
          $workRequired[] = 'Service';
      }
      if ($workRepair === '1') {
          $workRequired[] = 'Repair';
      }
      $workRequiredText = !empty($workRequired) ? implode(', ', $workRequired) : 'Not specified';

      $newsletterText = $newsletter === '1' ? 'Yes' : 'No';

      $mail = new PHPMailer(true);

      try {
          $mail->isSMTP();
          $mail->SMTPDebug = 0;
          $mail->Host = 'smtp.hostinger.com';
          $mail->Port = 587;
          $mail->SMTPAuth = true;
          $mail->Username = 'admin@promoflow.net';
          $mail->Password = '32skiff32CI!';
          $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

          $mail->CharSet = 'UTF-8';
          $mail->Encoding = 'base64';

          $mail->setFrom('admin@promoflow.net', 'Jon Pegg');
          $mail->addAddress('vicky@ullmansails.co.uk', 'Jon Pegg');
          $mail->addAddress('aleinarossui@gmail.com', 'Aleja');
          $mail->addAddress('alerozochiquiza@gmail.com', 'Aleja');


          $mail->Subject = 'New Repair Quote Request';
          $mail->isHTML(true);

          $recipientMessage = "
          <div style='margin:0; padding:40px 0; background:#f5f7fa; width:100%;'>
            <div style='width:92%; max-width:760px; margin:0 auto; background:#ffffff; border:1px solid #d9e1ea; box-shadow:0 18px 45px rgba(32,46,82,.10); overflow:hidden;'>
              <div style='background:#202E52; padding:26px 32px; text-align:left;'>
                <img src='https://lanyardsforyou.com/ullman_sails/general/menu/img/logo.png' alt='Ullman Sails' style='display:block; max-width:220px; height:auto;'>
              </div>
              <div style='padding:40px 32px 18px 32px;'>
                <p style='margin:0; font-family:Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#005598; font-weight:700;'>
                  Repair Quote
                </p>
                <h1 style='margin:12px 0 10px 0; font-family:Arial, sans-serif; font-size:34px; line-height:1.15; color:#202E52; font-weight:700;'>
                  New repair quote request
                </h1>
                <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; line-height:1.7; color:#5e6b7a; max-width:560px;'>
                  A new repair quote request has been submitted through the website.
                </p>
              </div>
              <div style='padding:20px 32px 10px 32px;'>
                <div style='background:#ffffff; border:1px solid #dbe3ec;'>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>First Name</p><p style='margin:0; font-family:Arial, sans-serif; font-size:18px; color:#202E52; font-weight:600;'>$firstName</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Last Name</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$lastName</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Email</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$email</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Phone</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$phone</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Address</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$address1</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Address line 2</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$address2</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>City</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$city</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Postcode</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$postcode</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Preferred Contact Method</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$contactPreferenceText</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Type of Boat</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$boatType</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Boat Name</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$boatName</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Type of Sail</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$sailType</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Work Required</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$workRequiredText</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Details of Work Required</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$workDetails</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Boat Location</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$boatLocation</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Collection & Delivery</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$collectionDelivery</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Newsletter</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$newsletterText</p></div>
                </div>
              </div>
            </div>
          </div>
          ";

          $mail->Body = $recipientMessage;
          $mail->AltBody = "New repair quote request
      First Name: $firstName
      Last Name: $lastName
      Email: $email
      Phone: $phone
      Address: $address1
      Address line 2: $address2
      City: $city
      Postcode: $postcode
      Preferred Contact Method: $contactPreferenceText
      Type of Boat: $boatType
      Boat Name: $boatName
      Type of Sail: $sailType
      Work Required: $workRequiredText
      Details of Work Required: $workDetails
      Boat Location: $boatLocation
      Collection & Delivery: $collectionDelivery
      Newsletter: $newsletterText";

          $mail->send();

          return array(
              "success" => true,
              "message" => "Your repair quote request has been sent successfully. One of our advisers will be in touch with you shortly."
          );
      } catch (Exception $e) {
          return array(
              "success" => false,
              "message" => $mail->ErrorInfo
          );
      }
  }

  public function sendNewSailQuote($data) {

      $firstName = isset($data->first_name) ? $data->first_name : '';
      $lastName = isset($data->last_name) ? $data->last_name : '';
      $email = isset($data->email) ? $data->email : '';
      $phone = isset($data->phone) ? $data->phone : '';
      $address1 = isset($data->address_1) ? $data->address_1 : '';
      $address2 = isset($data->address_2) ? $data->address_2 : '';
      $city = isset($data->city) ? $data->city : '';
      $postcode = isset($data->postcode) ? $data->postcode : '';
      $contactByPhone = isset($data->contact_by_phone) ? $data->contact_by_phone : '0';
      $contactByEmail = isset($data->contact_by_email) ? $data->contact_by_email : '0';
      $boatType = isset($data->boat_type) ? $data->boat_type : '';
      $sailType = isset($data->sail_type) ? $data->sail_type : '';
      $sailUseRacing = isset($data->sail_use_racing) ? $data->sail_use_racing : '0';
      $sailUseCruising = isset($data->sail_use_cruising) ? $data->sail_use_cruising : '0';
      $boatLocation = isset($data->boat_location) ? $data->boat_location : '';
      $additionalInfo = isset($data->additional_info) ? $data->additional_info : '';
      $newsletter = isset($data->newsletter) ? $data->newsletter : '0';

      $contactPreference = array();
      if ($contactByPhone === '1') {
          $contactPreference[] = 'Phone';
      }
      if ($contactByEmail === '1') {
          $contactPreference[] = 'Email';
      }
      $contactPreferenceText = !empty($contactPreference) ? implode(', ', $contactPreference) : 'Not specified';

      $sailUse = array();
      if ($sailUseRacing === '1') {
          $sailUse[] = 'Racing';
      }
      if ($sailUseCruising === '1') {
          $sailUse[] = 'Cruising';
      }
      $sailUseText = !empty($sailUse) ? implode(', ', $sailUse) : 'Not specified';

      $newsletterText = $newsletter === '1' ? 'Yes' : 'No';

      $mail = new PHPMailer(true);

      try {
          $mail->isSMTP();
          $mail->SMTPDebug = 0;
          $mail->Host = 'smtp.hostinger.com';
          $mail->Port = 587;
          $mail->SMTPAuth = true;
          $mail->Username = 'admin@promoflow.net';
          $mail->Password = '32skiff32CI!';
          $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

          $mail->CharSet = 'UTF-8';
          $mail->Encoding = 'base64';

          $mail->setFrom('admin@promoflow.net', 'Jon Pegg');
          $mail->addAddress('jon@ullmansails.co.uk', 'Jon Pegg');
          $mail->addAddress('aleinarossui@gmail.com', 'Aleja');
          $mail->addAddress('alerozochiquiza@gmail.com', 'Aleja');


          $mail->Subject = 'New Sail Quote Request';
          $mail->isHTML(true);

          $recipientMessage = "
          <div style='margin:0; padding:40px 0; background:#f5f7fa; width:100%;'>
            <div style='width:92%; max-width:760px; margin:0 auto; background:#ffffff; border:1px solid #d9e1ea; box-shadow:0 18px 45px rgba(32,46,82,.10); overflow:hidden;'>
              <div style='background:#202E52; padding:26px 32px; text-align:left;'>
                <img src='https://lanyardsforyou.com/ullman_sails/general/menu/img/logo.png' alt='Ullman Sails' style='display:block; max-width:220px; height:auto;'>
              </div>
              <div style='padding:40px 32px 18px 32px;'>
                <p style='margin:0; font-family:Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#005598; font-weight:700;'>
                  Sail Quote
                </p>
                <h1 style='margin:12px 0 10px 0; font-family:Arial, sans-serif; font-size:34px; line-height:1.15; color:#202E52; font-weight:700;'>
                  New sail quote request
                </h1>
                <p style='margin:0; font-family:Arial, sans-serif; font-size:16px; line-height:1.7; color:#5e6b7a; max-width:560px;'>
                  A new sail quote request has been submitted through the website.
                </p>
              </div>
              <div style='padding:20px 32px 10px 32px;'>
                <div style='background:#ffffff; border:1px solid #dbe3ec;'>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>First Name</p><p style='margin:0; font-family:Arial, sans-serif; font-size:18px; color:#202E52; font-weight:600;'>$firstName</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Last Name</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$lastName</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Email</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$email</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Phone</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$phone</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Address</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$address1</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Address line 2</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$address2</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>City</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$city</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Postcode</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$postcode</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Preferred Contact Method</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$contactPreferenceText</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Type of Boat</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$boatType</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Type of Sail</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$sailType</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Sail Use</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$sailUseText</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Boat Location</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$boatLocation</p></div>
                  <div style='padding:18px 22px; border-bottom:1px solid #dbe3ec;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Newsletter</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$newsletterText</p></div>
                  <div style='padding:18px 22px;'><p style='margin:0 0 6px 0; font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#7b8794; font-weight:700;'>Additional Information</p><p style='margin:0; font-family:Arial, sans-serif; font-size:16px; color:#202E52;'>$additionalInfo</p></div>
                </div>
              </div>
            </div>
          </div>
          ";

          $mail->Body = $recipientMessage;
          $mail->AltBody = "New sail quote request
          First Name: $firstName
          Last Name: $lastName
          Email: $email
          Phone: $phone
          Address: $address1
          Address line 2: $address2
          City: $city
          Postcode: $postcode
          Preferred Contact Method: $contactPreferenceText
          Type of Boat: $boatType
          Type of Sail: $sailType
          Sail Use: $sailUseText
          Boat Location: $boatLocation
          Newsletter: $newsletterText
          Additional Information: $additionalInfo";

          $mail->send();

          return array(
              "success" => true,
              "message" => "Your sail quote request has been sent successfully. One of our advisers will be in touch with you shortly."
          );
      } catch (Exception $e) {
          return array(
              "success" => false,
              "message" => $mail->ErrorInfo
          );
      }
  }
}
