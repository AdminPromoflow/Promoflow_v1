<?php
class Addresses_Model {
    private $Address = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setAddress(array $data)
    {
        $this->Address = [
            'id_adddress'      => $data['id_adddress'] ?? $data['idAddress'] ?? null,
            'first_name'       => $data['first_name'] ?? null,
            'last_name'        => $data['last_name'] ?? null,
            'company_name'     => $data['company_name'] ?? null,
            'phone'            => $data['phone'] ?? null,
            'country'          => $data['country'] ?? null,
            'state'            => $data['state'] ?? null,
            'town_city'        => $data['town_city'] ?? null,
            'street_address_1' => $data['street_address_1'] ?? null,
            'street_address_2' => $data['street_address_2'] ?? null,
            'postcode'         => $data['postcode'] ?? null,
            'email_address'    => $data['email_address'] ?? null,
            'id_customers'     => $data['id_customers'] ?? $data['idUser'] ?? null
        ];
        return $this;
    }

    public function addressExist(bool $close = true): bool
    {
        try {
            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                SELECT id_adddress
                FROM Addresses
                WHERE id_adddress = :id_adddress
                LIMIT 1
            ");

            $sql->bindParam(':id_adddress', $this->Address['id_adddress'], PDO::PARAM_INT);
            $sql->execute();

            $address = $sql->fetch(PDO::FETCH_ASSOC);

            if ($close) {
                $this->connection->closeConnection();
            }

            return $address ? true : false;

        } catch (PDOException $e) {
            echo "Error al verificar dirección: " . $e->getMessage();
            return false;
        }
    }

    public function createAddress(bool $close = true): bool
    {
        try {
            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                INSERT INTO Addresses (
                    id_adddress, first_name, last_name, company_name, phone,
                    country, state, town_city, street_address_1,
                    street_address_2, postcode, email_address, id_customers
                ) VALUES (
                    :id_adddress, :first_name, :last_name, :company_name, :phone,
                    :country, :state, :town_city, :street_address_1,
                    :street_address_2, :postcode, :email_address, :id_customers
                )
            ");

            $sql->bindParam(':id_adddress', $this->Address['id_adddress'], PDO::PARAM_INT);
            $sql->bindParam(':first_name', $this->Address['first_name'], PDO::PARAM_STR);
            $sql->bindParam(':last_name', $this->Address['last_name'], PDO::PARAM_STR);
            $sql->bindParam(':company_name', $this->Address['company_name'], PDO::PARAM_STR);
            $sql->bindParam(':phone', $this->Address['phone'], PDO::PARAM_STR);
            $sql->bindParam(':country', $this->Address['country'], PDO::PARAM_STR);
            $sql->bindParam(':state', $this->Address['state'], PDO::PARAM_STR);
            $sql->bindParam(':town_city', $this->Address['town_city'], PDO::PARAM_STR);
            $sql->bindParam(':street_address_1', $this->Address['street_address_1'], PDO::PARAM_STR);
            $sql->bindParam(':street_address_2', $this->Address['street_address_2'], PDO::PARAM_STR);
            $sql->bindParam(':postcode', $this->Address['postcode'], PDO::PARAM_STR);
            $sql->bindParam(':email_address', $this->Address['email_address'], PDO::PARAM_STR);
            $sql->bindParam(':id_customers', $this->Address['id_customers'], PDO::PARAM_INT);

            $result = $sql->execute();

            if ($close) {
                $this->connection->closeConnection();
            }

            return $result;

        } catch (PDOException $e) {
            echo "Error al crear dirección: " . $e->getMessage();
            return false;
        }
    }

    public function updateAddress(bool $close = true): bool
    {
        try {
            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                UPDATE Addresses
                SET
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
                    email_address = :email_address
                WHERE id_adddress = :id_adddress
                LIMIT 1
            ");

            $sql->bindParam(':first_name', $this->Address['first_name'], PDO::PARAM_STR);
            $sql->bindParam(':last_name', $this->Address['last_name'], PDO::PARAM_STR);
            $sql->bindParam(':company_name', $this->Address['company_name'], PDO::PARAM_STR);
            $sql->bindParam(':phone', $this->Address['phone'], PDO::PARAM_STR);
            $sql->bindParam(':country', $this->Address['country'], PDO::PARAM_STR);
            $sql->bindParam(':state', $this->Address['state'], PDO::PARAM_STR);
            $sql->bindParam(':town_city', $this->Address['town_city'], PDO::PARAM_STR);
            $sql->bindParam(':street_address_1', $this->Address['street_address_1'], PDO::PARAM_STR);
            $sql->bindParam(':street_address_2', $this->Address['street_address_2'], PDO::PARAM_STR);
            $sql->bindParam(':postcode', $this->Address['postcode'], PDO::PARAM_STR);
            $sql->bindParam(':email_address', $this->Address['email_address'], PDO::PARAM_STR);
            $sql->bindParam(':id_adddress', $this->Address['id_adddress'], PDO::PARAM_INT);

            $result = $sql->execute();

            if ($close) {
                $this->connection->closeConnection();
            }

            return $result;

        } catch (PDOException $e) {
            echo "Error al actualizar dirección: " . $e->getMessage();
            return false;
        }
    }
}
?>
