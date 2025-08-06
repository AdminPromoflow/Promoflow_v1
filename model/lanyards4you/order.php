<?php

// class Model_Order
// {
//     private $Orders = [];
//     private $Jobs = [];
//     private $Image = [];
//     private $Text = [];
//     private $Artwork = [];
//     private $Addresses = [];
//     private $Users = [];
//     private $connection;
//
//     public function __construct($connection)
//     {
//         $this->connection = $connection;
//     }
//
//     public function setOrders(array $data)
//     {
//         $this->Orders = [
//             'id_order' => $data['idOrder'] ?? null,      // JSON: idOrder
//             'data_time' => $data['date_time'] ?? null,   // JSON: date_time
//             'shipping_days' => $data['shippingDays'] ?? null,
//             'status' => $data['status'] ?? null,
//             'subtotal' => $data['subtotal'] ?? null,
//             'tax' => $data['tax'] ?? null,
//             'shipping_price' => $data['shipping_price'] ?? null,
//             'total' => $data['total'] ?? null,
//             'id_customer' => $data['idUser'] ?? null,     // JSON: idUser
//             'id_customers' => $data['idUser'] ?? null     // JSON: idUser
//         ];
//     }
//
//
//
// public function setJobs(array $data)
// {
// $this->Jobs = [
//     'id_jobs' => $data['idJobs'] ?? null,           // JSON: idJobs
//     'name' => $data['name'] ?? null,
//     'description' => $data['description'] ?? null,
//     'price_per_unit' => $data['price_per_unit'] ?? null,
//     'amount' => $data['amount'] ?? null,
//     'total' => $data['total'] ?? null,
//     'link_pdf' => $data['link_pdf'] ?? null,
//     'notes' => $data['notes'] ?? null,
//     'new_colour' => $data['newColour'] ?? null,     // JSON: newColour
//     'id_order' => $data['idOrder'] ?? null,         // JSON: idOrder
//     'id_extras' => $data['idExtras'] ?? null,
//     'id_clip' => $data['idClip'] ?? null,
//     'id_price_amount' => $data['idPriceAmount'] ?? null
// ];
// }
//
//
// public function setImage(array $data)
// {
//   $this->Image = [
//       'id_jobs' => $data['idJobs'] ?? null,
//       'times_image' => $data['timesImage'] ?? null,
//       'image_size' => $data['imageSize'] ?? null,
//       'space_between_image' => $data['spaceBetweenImage'] ?? null,
//       'image_rotation' => $data['imageRotation'] ?? null,
//       'space_along_lanyard' => $data['spaceAlongLanyard'] ?? null,
//       'link_image' => $data['linkImage'] ?? null,
//       'image_position' => $data['imagePosition'] ?? null
//   ];
// }
//
//
// public function setText(array $data)
// {
// $this->Text = [
//     'id_jobs' => $data['idJobs'] ?? null,
//     'content_text' => $data['contentText'] ?? null,
//     'time_text' => $data['timesText'] ?? null,
//     'space_between_text' => $data['spaceBetweenText'] ?? null,
//     'space_along_lanyard' => $data['spaceAlongLanyard'] ?? null,
//     'colour_text' => $data['colourText'] ?? null,
//     'font_family_text' => $data['fontFamilyText'] ?? null,
//     'size_text' => $data['sizeText'] ?? null,
//     'bold_text' => $data['boldText'] ?? null,
//     'italic_text' => $data['italicText'] ?? null,
//     'underline_text' => $data['underlineText'] ?? null,
//     'text_position' => $data['textPosition'] ?? null
// ];
// }
//
//
// public function setArtwork(array $data)
// {
//   $this->Artwork = [
//       'id_jobs' => $data['idJobs'] ?? null,
//       'link_right_image' => $data['linkRightImage'] ?? null,
//       'link_left_image' => $data['linkLeftImage'] ?? null
//   ];
// }
//
//
// public function setAddresses(array $data)
// {
// $this->Addresses = [
//     'id_adddress' => $data['idAddress'] ?? null,  // JSON: idAddress
//     'first_name' => $data['first_name'] ?? null,
//     'last_name' => $data['last_name'] ?? null,
//     'company_name' => $data['company_name'] ?? null,
//     'phone' => $data['phone'] ?? null,
//     'country' => $data['country'] ?? null,
//     'state' => $data['state'] ?? null,
//     'town_city' => $data['town_city'] ?? null,
//     'street_address_1' => $data['street_address_1'] ?? null,
//     'street_address_2' => $data['street_address_2'] ?? null,
//     'postcode' => $data['postcode'] ?? null,
//     'email_address' => $data['email_address'] ?? null,
//     'id_customer' => $data['idUser'] ?? null,      // JSON: idUser
//     'id_customers' => $data['idUser'] ?? null       // JSON: idUser
// ];
// }
//
//
//     public function setUsers(array $data)
// {
//     $this->Users = [
//         'id_customers' => $data['idUser'] ?? null,  // JSON: idUser
//         'name' => $data['name'] ?? null,
//         'email' => $data['email'] ?? null
//     ];
// }
// public function saveOrder()
// {
//     try {
//         $conn = $this->connection->getConnection();
//         $conn->beginTransaction();
//
//         // 1. Insertar en Customers
//         $idUser = $this->Users['id_customers'];
//
//         $stmt = $conn->prepare("SELECT COUNT(*) FROM Customers WHERE id_customers = :id");
//         $stmt->execute([':id' => $idUser]);
//
//         if ($stmt->fetchColumn() == 0) {
//             // Insertar si no existe
//             $stmt = $conn->prepare("INSERT INTO Customers (
//                 id_customers, name, email
//             ) VALUES (
//                 :id_customers, :name, :email
//             )");
//
//             $stmt->execute([
//                 ':id_customers' => $idUser,
//                 ':name' => $this->Users['name'],
//                 ':email' => $this->Users['email']
//             ]);
//         }
//
//
//         // 2. Insertar en Addresses (una o múltiples direcciones)
//         $addresses = is_array($this->Addresses[0] ?? null) ? $this->Addresses : [$this->Addresses];
//
//         foreach ($addresses as $address) {
//             // Validar que la dirección tenga contenido útil
//             if (!empty($address['first_name']) || !empty($address['last_name']) || !empty($address['email_address'])) {
//
//                 // Verificar si la dirección ya existe por ID y usuario
//                 $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM Addresses WHERE id_adddress = :id_adddress AND id_customers = :id_customers");
//                 $stmtCheck->execute([
//                     ':id_adddress' => $address['id_adddress'],
//                     ':id_customers' => $idUser
//                 ]);
//
//                 $exists = $stmtCheck->fetchColumn();
//
//                 if ($exists) {
//                     // Actualizar si ya existe
//                     $stmtUpdate = $conn->prepare("UPDATE Addresses SET
//                         first_name = :first_name,
//                         last_name = :last_name,
//                         company_name = :company_name,
//                         phone = :phone,
//                         country = :country,
//                         state = :state,
//                         town_city = :town_city,
//                         street_address_1 = :street_address_1,
//                         street_address_2 = :street_address_2,
//                         postcode = :postcode,
//                         email_address = :email_address,
//                         id_customer = :id_customer
//                     WHERE id_adddress = :id_adddress AND id_customers = :id_customers");
//
//                     $stmtUpdate->execute([
//                         ':first_name' => $address['first_name'],
//                         ':last_name' => $address['last_name'],
//                         ':company_name' => $address['company_name'],
//                         ':phone' => $address['phone'],
//                         ':country' => $address['country'],
//                         ':state' => $address['state'],
//                         ':town_city' => $address['town_city'],
//                         ':street_address_1' => $address['street_address_1'],
//                         ':street_address_2' => $address['street_address_2'],
//                         ':postcode' => $address['postcode'],
//                         ':email_address' => $address['email_address'],
//                         ':id_customer' => $idUser,
//                         ':id_adddress' => $address['id_adddress'],
//                         ':id_customers' => $idUser
//                     ]);
//                 } else {
//                     // Insertar si no existe
//                     $stmtInsert = $conn->prepare("INSERT INTO Addresses (
//                         id_adddress, first_name, last_name, company_name, phone, country,
//                         state, town_city, street_address_1, street_address_2,
//                         postcode, email_address, id_customer, id_customers
//                     ) VALUES (
//                         :id_adddress, :first_name, :last_name, :company_name, :phone, :country,
//                         :state, :town_city, :street_address_1, :street_address_2,
//                         :postcode, :email_address, :id_customer, :id_customers
//                     )");
//
//                     $stmtInsert->execute([
//                         ':id_adddress' => $address['id_adddress'],
//                         ':first_name' => $address['first_name'],
//                         ':last_name' => $address['last_name'],
//                         ':company_name' => $address['company_name'],
//                         ':phone' => $address['phone'],
//                         ':country' => $address['country'],
//                         ':state' => $address['state'],
//                         ':town_city' => $address['town_city'],
//                         ':street_address_1' => $address['street_address_1'],
//                         ':street_address_2' => $address['street_address_2'],
//                         ':postcode' => $address['postcode'],
//                         ':email_address' => $address['email_address'],
//                         ':id_customer' => $idUser,
//                         ':id_customers' => $idUser
//                     ]);
//                 }
//             }
//         }
//
//
//         // 3. Insertar en Orders
//         $stmt = $conn->prepare("INSERT INTO Orders (
//             id_order, data_time, shipping_days, status, subtotal, tax,
//             shipping_price, total, id_customer, id_customers
//         ) VALUES (
//             :id_order, :data_time, :shipping_days, :status, :subtotal, :tax,
//             :shipping_price, :total, :id_customer, :id_customers
//         )");
//
//         $stmt->execute([
//             ':id_order' => $this->Orders['id_order'],
//             ':data_time' => $this->Orders['data_time'],
//             ':shipping_days' => $this->Orders['shipping_days'],
//             ':status' => $this->Orders['status'],
//             ':subtotal' => $this->Orders['subtotal'],
//             ':tax' => $this->Orders['tax'],
//             ':shipping_price' => $this->Orders['shipping_price'],
//             ':total' => $this->Orders['total'],
//             ':id_customer' => $idUser,
//             ':id_customers' => $idUser
//         ]);
//
//         // 4. Insertar en Jobs
//         $stmt = $conn->prepare("INSERT INTO Jobs (
//             id_jobs, name, description, price_per_unit, amount, total,
//             link_pdf, notes, new_colour, id_order, id_extras, id_clip, id_price_amount
//         ) VALUES (
//             :id_jobs, :name, :description, :price_per_unit, :amount, :total,
//             :link_pdf, :notes, :new_colour, :id_order, :id_extras, :id_clip, :id_price_amount
//         )");
//
//         $stmt->execute([
//             ':id_jobs' => $this->Jobs['id_jobs'],
//             ':name' => $this->Jobs['name'],
//             ':description' => $this->Jobs['description'],
//             ':price_per_unit' => $this->Jobs['price_per_unit'],
//             ':amount' => $this->Jobs['amount'],
//             ':total' => $this->Jobs['total'],
//             ':link_pdf' => $this->Jobs['link_pdf'],
//             ':notes' => $this->Jobs['notes'],
//             ':new_colour' => $this->Jobs['new_colour'],
//             ':id_order' => $this->Jobs['id_order'],
//             ':id_extras' => $this->Jobs['id_extras'],
//             ':id_clip' => $this->Jobs['id_clip'],
//             ':id_price_amount' => $this->Jobs['id_price_amount']
//         ]);
//
//         // 5. Insertar en Image (si existe)
//         if (!empty($this->Image) && is_array($this->Image) && isset($this->Image['id_jobs'])) {
//             $stmt = $conn->prepare("INSERT INTO Image (
//                 id_jobs, times_image, image_size, space_between_image, image_rotation,
//                 space_along_lanyard, link_image, image_position
//             ) VALUES (
//                 :id_jobs, :times_image, :image_size, :space_between_image, :image_rotation,
//                 :space_along_lanyard, :link_image, :image_position
//             )");
//
//             $stmt->execute([
//                 ':id_jobs' => $this->Image['id_jobs'],
//                 ':times_image' => $this->Image['times_image'],
//                 ':image_size' => $this->Image['image_size'],
//                 ':space_between_image' => $this->Image['space_between_image'],
//                 ':image_rotation' => $this->Image['image_rotation'],
//                 ':space_along_lanyard' => $this->Image['space_along_lanyard'],
//                 ':link_image' => $this->Image['link_image'],
//                 ':image_position' => $this->Image['image_position']
//             ]);
//         }
//
//
//         // 6. Insertar en Text (si existe)
//         if (!empty($this->Text) && is_array($this->Text) && isset($this->Text['id_jobs'])) {
//             $stmt = $conn->prepare("INSERT INTO Text (
//                 id_jobs, content_text, time_text, space_between_text, space_along_lanyard,
//                 colour_text, font_family_text, size_text, bold_text, italic_text,
//                 underline_text, text_position
//             ) VALUES (
//                 :id_jobs, :content_text, :time_text, :space_between_text, :space_along_lanyard,
//                 :colour_text, :font_family_text, :size_text, :bold_text, :italic_text,
//                 :underline_text, :text_position
//             )");
//
//             $stmt->execute([
//                 ':id_jobs' => $this->Text['id_jobs'],
//                 ':content_text' => $this->Text['content_text'],
//                 ':time_text' => $this->Text['time_text'],
//                 ':space_between_text' => $this->Text['space_between_text'],
//                 ':space_along_lanyard' => $this->Text['space_along_lanyard'],
//                 ':colour_text' => $this->Text['colour_text'],
//                 ':font_family_text' => $this->Text['font_family_text'],
//                 ':size_text' => $this->Text['size_text'],
//                 ':bold_text' => $this->Text['bold_text'],
//                 ':italic_text' => $this->Text['italic_text'],
//                 ':underline_text' => $this->Text['underline_text'],
//                 ':text_position' => $this->Text['text_position']
//             ]);
//         }
//
//
//         // 7. Insertar en Artwork (si existe)
//         // 7. Insertar en Artwork (si contiene datos válidos)
//         if (!empty($this->Artwork) && is_array($this->Artwork) && isset($this->Artwork['id_jobs'])) {
//             $stmt = $conn->prepare("INSERT INTO Artwork (
//                 id_jobs, link_right_image, link_left_image
//             ) VALUES (
//                 :id_jobs, :link_right_image, :link_left_image
//             )");
//
//             $stmt->execute([
//                 ':id_jobs' => $this->Artwork['id_jobs'],
//                 ':link_right_image' => $this->Artwork['link_right_image'],
//                 ':link_left_image' => $this->Artwork['link_left_image']
//             ]);
//         }
//
//
//         $conn->commit();
//         $this->connection->closeConnection();
//         return true;
//
//     } catch (Exception $e) {
//         if (isset($conn) && $conn->inTransaction()) {
//             $conn->rollBack();
//         }
//         error_log("Error en saveOrder: " . $e->getMessage());
//         return false;
//     }
// }
//
// }

?>
