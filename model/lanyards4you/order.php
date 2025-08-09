<?php

class Model_Order
{
    private $Orders = [];
    private $Jobs = [];
    private $Image = [];
    private $Text = [];
    private $Artwork = [];
    private $Addresses1 = [];
    private $Addresses2 = [];
    private $Users = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setOrders(array $data)
    {
        $this->Orders = [
            'id_order' => $data['idOrder'] ?? null,      // JSON: idOrder
            'data_time' => $data['date_time'] ?? null,   // JSON: date_time
            'shipping_days' => $data['shippingDays'] ?? null,
            'status' => $data['status'] ?? null,
            'subtotal' => $data['subtotal'] ?? null,
            'tax' => $data['tax'] ?? null,
            'shipping_price' => $data['shipping_price'] ?? null,
            'total' => $data['total'] ?? null,
            'id_customer' => $data['idUser'] ?? null,     // JSON: idUser
            'id_customers' => $data['idUser'] ?? null     // JSON: idUser
        ];
    }

    

    public function saveOrder()
    {
        try {
            $conn = $this->connection->getConnection();
            $conn->beginTransaction();

            // 1. Insertar en Customers
            $idUser = $this->Users['id_customers'];

            $stmt = $conn->prepare("SELECT COUNT(*) FROM Customers WHERE id_customers = :id");
            $stmt->execute([':id' => $idUser]);

            if ($stmt->fetchColumn() == 0) {
                // Insertar si no existe
                $stmt = $conn->prepare("INSERT INTO Customers (
                    id_customers, name, email
                ) VALUES (
                    :id_customers, :name, :email
                )");

                $stmt->execute([
                    ':id_customers' => $idUser,
                    ':name' => $this->Users['name'],
                    ':email' => $this->Users['email']
                ]);
            }

            // 2. Insertar en Addresses (una o múltiples direcciones)
            // armar arreglo de direcciones
            $addresses = [];
            if (!empty($this->Addresses1)) $addresses[] = $this->Addresses1;
            if (!empty($this->Addresses2)) $addresses[] = $this->Addresses2;

            foreach ($addresses as $address) {
                if (!empty($address['first_name']) || !empty($address['last_name']) || !empty($address['email_address'])) {

                    // EXISTS por id_adddress + id_customers
                    $stmtCheck = $conn->prepare("
                        SELECT COUNT(*)
                        FROM Addresses
                        WHERE id_adddress = :id_adddress AND id_customers = :id_customers
                    ");
                    $stmtCheck->execute([
                        ':id_adddress'  => $address['id_adddress'],
                        ':id_customers' => $idUser
                    ]);
                    $exists = (int)$stmtCheck->fetchColumn();

                    if ($exists) {
                        // UPDATE
                        $stmtUpdate = $conn->prepare("
                            UPDATE Addresses SET
                                first_name = :first_name,
                                last_name = :last_name,
                                company_name = :company_name,
                                phone = :phone,
                                country = :country,
                                state = :state,
                                town_city = :town_city,
                                street_address_1 = :street_address_1,
                                street_address_2 = :street_address_2,
                                postcode = :postcode,
                                email_address = :email_address,
                                id_customer = :id_customer
                            WHERE id_adddress = :id_adddress AND id_customers = :id_customers
                        ");
                        $stmtUpdate->execute([
                            ':first_name'       => $address['first_name'],
                            ':last_name'        => $address['last_name'],
                            ':company_name'     => $address['company_name'],
                            ':phone'            => $address['phone'],
                            ':country'          => $address['country'],
                            ':state'            => $address['state'],
                            ':town_city'        => $address['town_city'],
                            ':street_address_1' => $address['street_address_1'],
                            ':street_address_2' => $address['street_address_2'],
                            ':postcode'         => $address['postcode'],
                            ':email_address'    => $address['email_address'],
                            ':id_customer'      => $idUser,
                            ':id_adddress'      => $address['id_adddress'],  // ← clave correcta
                            ':id_customers'     => $idUser
                        ]);
                    } else {
                        // INSERT
                        $stmtInsert = $conn->prepare("
                            INSERT INTO Addresses (
                                id_adddress, first_name, last_name, company_name, phone, country,
                                state, town_city, street_address_1, street_address_2,
                                postcode, email_address, id_customer, id_customers
                            ) VALUES (
                                :id_adddress, :first_name, :last_name, :company_name, :phone, :country,
                                :state, :town_city, :street_address_1, :street_address_2,
                                :postcode, :email_address, :id_customer, :id_customers
                            )
                        ");
                        $stmtInsert->execute([
                            ':id_adddress'      => $address['id_adddress'],
                            ':first_name'       => $address['first_name'],
                            ':last_name'        => $address['last_name'],
                            ':company_name'     => $address['company_name'],
                            ':phone'            => $address['phone'],
                            ':country'          => $address['country'],
                            ':state'            => $address['state'],
                            ':town_city'        => $address['town_city'],
                            ':street_address_1' => $address['street_address_1'],
                            ':street_address_2' => $address['street_address_2'],
                            ':postcode'         => $address['postcode'],
                            ':email_address'    => $address['email_address'],
                            ':id_customer'      => $idUser,
                            ':id_customers'     => $idUser
                        ]);
                    }
                }
            }

            // 3. Insertar en Orders
            $stmt = $conn->prepare("INSERT INTO Orders (
                id_order, data_time, shipping_days, status, subtotal, tax,
                shipping_price, total, id_customer, id_customers
            ) VALUES (
                :id_order, :data_time, :shipping_days, :status, :subtotal, :tax,
                :shipping_price, :total, :id_customer, :id_customers
            )");

            $stmt->execute([
                ':id_order' => $this->Orders['id_order'],
                ':data_time' => $this->Orders['data_time'],
                ':shipping_days' => $this->Orders['shipping_days'],
                ':status' => $this->Orders['status'],
                ':subtotal' => $this->Orders['subtotal'],
                ':tax' => $this->Orders['tax'],
                ':shipping_price' => $this->Orders['shipping_price'],
                ':total' => $this->Orders['total'],
                ':id_customer' => $idUser,
                ':id_customers' => $idUser
            ]);

            // 4. Insertar en Image (si existe)
            if (!empty($this->Image) && is_array($this->Image) && isset($this->Image['id_jobs'])) {
                $stmt = $conn->prepare("INSERT INTO Image (
                    id_jobs, times_image, image_size, space_between_image, image_rotation,
                    space_along_lanyard, link_image, image_position
                ) VALUES (
                    :id_jobs, :times_image, :image_size, :space_between_image, :image_rotation,
                    :space_along_lanyard, :link_image, :image_position
                )");

                $stmt->execute([
                    ':id_jobs' => $this->Image['id_jobs'],
                    ':times_image' => $this->Image['times_image'],
                    ':image_size' => $this->Image['image_size'],
                    ':space_between_image' => $this->Image['space_between_image'],
                    ':image_rotation' => $this->Image['image_rotation'],
                    ':space_along_lanyard' => $this->Image['space_along_lanyard'],
                    ':link_image' => $this->Image['link_image'],
                    ':image_position' => $this->Image['image_position']
                ]);
            }

            // 5. Insertar en Artwork (si contiene datos válidos)
            if (!empty($this->Artwork) && is_array($this->Artwork) && isset($this->Artwork['id_jobs'])) {
                $stmt = $conn->prepare("INSERT INTO Artwork (
                    id_jobs, link_right_image, link_left_image
                ) VALUES (
                    :id_jobs, :link_right_image, :link_left_image
                )");

                $stmt->execute([
                    ':id_jobs' => $this->Artwork['id_jobs'],
                    ':link_right_image' => $this->Artwork['link_right_image'],
                    ':link_left_image' => $this->Artwork['link_left_image']
                ]);
            }

            $conn->commit();
            $this->connection->closeConnection();
            return true;

        } catch (Exception $e) {
            if (isset($conn) && $conn->inTransaction()) {
                $conn->rollBack();
            }
            error_log("Error en saveOrder: " . $e->getMessage());
            return false;
        }
    }
}

?>
