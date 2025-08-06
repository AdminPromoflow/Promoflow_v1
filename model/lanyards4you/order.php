<?php

class Model_Order
{
    private $Orders = [];
    private $Jobs = [];
    private $Image = [];
    private $Text = [];
    private $Artwork = [];
    private $Addresses = [];
    private $Users = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setOrders(array $data)
    {
        $this->Orders = [
            'id_order' => $data['id_order'] ?? null,
            'data_time' => $data['data_time'] ?? null,
            'shipping_days' => $data['shipping_days'] ?? null,
            'status' => $data['status'] ?? null,
            'subtotal' => $data['subtotal'] ?? null,
            'tax' => $data['tax'] ?? null,
            'shipping_price' => $data['shipping_price'] ?? null,
            'total' => $data['total'] ?? null,
            'id_customer' => $data['id_customer'] ?? null,
            'id_customers' => $data['id_customers'] ?? null
        ];
    }

    public function setJobs(array $data)
    {
        $this->Jobs = [
            'id_jobs' => $data['id_jobs'] ?? null,
            'name' => $data['name'] ?? null,
            'description' => $data['description'] ?? null,
            'price_per_unit' => $data['price_per_unit'] ?? null,
            'amount' => $data['amount'] ?? null,
            'total' => $data['total'] ?? null,
            'link_pdf' => $data['link_pdf'] ?? null,
            'notes' => $data['notes'] ?? null,
            'new_colour' => $data['new_colour'] ?? null,
            'id_order' => $data['id_order'] ?? null,
            'id_extras' => $data['id_extras'] ?? null,
            'id_clip' => $data['id_clip'] ?? null,
            'id_price_amount' => $data['id_price_amount'] ?? null
        ];
    }

    public function setImage(array $data)
    {
        $this->Image = [
            'id_jobs' => $data['id_jobs'] ?? null,
            'times_image' => $data['times_image'] ?? null,
            'image_size' => $data['image_size'] ?? null,
            'space_between_image' => $data['space_between_image'] ?? null,
            'image_rotation' => $data['image_rotation'] ?? null,
            'space_along_lanyard' => $data['space_along_lanyard'] ?? null,
            'link_image' => $data['link_image'] ?? null,
            'image_position' => $data['image_position'] ?? null
        ];
    }

    public function setText(array $data)
    {
        $this->Text = [
            'id_jobs' => $data['id_jobs'] ?? null,
            'content_text' => $data['content_text'] ?? null,
            'time_text' => $data['time_text'] ?? null,
            'space_between_text' => $data['space_between_text'] ?? null,
            'space_along_lanyard' => $data['space_along_lanyard'] ?? null,
            'colour_text' => $data['colour_text'] ?? null,
            'font_family_text' => $data['font_family_text'] ?? null,
            'size_text' => $data['size_text'] ?? null,
            'bold_text' => $data['bold_text'] ?? null,
            'italic_text' => $data['italic_text'] ?? null,
            'underline_text' => $data['underline_text'] ?? null,
            'text_position' => $data['text_position'] ?? null
        ];
    }

    public function setArtwork(array $data)
    {
        $this->Artwork = [
            'id_jobs' => $data['id_jobs'] ?? null,
            'link_right_image' => $data['link_right_image'] ?? null,
            'link_left_image' => $data['link_left_image'] ?? null
        ];
    }

    public function setAddresses(array $data)
    {
        $this->Addresses = [
            'id_adddress' => $data['id_adddress'] ?? null,
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'company_name' => $data['company_name'] ?? null,
            'phone' => $data['phone'] ?? null,
            'country' => $data['country'] ?? null,
            'state' => $data['state'] ?? null,
            'town_city' => $data['town_city'] ?? null,
            'street_address_1' => $data['street_address_1'] ?? null,
            'street_address_2' => $data['street_address_2'] ?? null,
            'postcode' => $data['postcode'] ?? null,
            'email_address' => $data['email_address'] ?? null,
            'id_customer' => $data['id_customer'] ?? null,
            'id_customers' => $data['id_customers'] ?? null
        ];
    }

    public function setUsers(array $data)
    {
        $this->Users = [
            'id_customers' => $data['id_customers'] ?? null,
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null
        ];
    }
    public function saveOrder()
    {
        try {
            $conn = $this->connection->getConnection();

            $stmtUser = $conn->prepare("SELECT id_customers FROM Customers WHERE email = :email LIMIT 1");
            $stmtUser->bindParam(':email', $this->Users['email'], PDO::PARAM_STR);
            $stmtUser->execute();
            $user = $stmtUser->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                throw new Exception("Usuario no encontrado con el email: " . $this->Users['email']);
            }

            $idUser = $user['id_customers'];

            $stmt = $conn->prepare("INSERT INTO Addresses (
                first_name, last_name, company_name, phone, country,
                state, town_city, street_address_1, street_address_2, postcode, email_address, id_customers
            ) VALUES (
                :first_name, :last_name, :company_name, :phone, :country,
                :state, :town_city, :street_address_1, :street_address_2, :postcode, :email_address, :id_customers
            )");

            $stmt->execute([
                ':first_name' => $this->Addresses['first_name'],
                ':last_name' => $this->Addresses['last_name'],
                ':company_name' => $this->Addresses['company_name'],
                ':phone' => $this->Addresses['phone'],
                ':country' => $this->Addresses['country'],
                ':state' => $this->Addresses['state'],
                ':town_city' => $this->Addresses['town_city'],
                ':street_address_1' => $this->Addresses['street_address_1'],
                ':street_address_2' => $this->Addresses['street_address_2'],
                ':postcode' => $this->Addresses['postcode'],
                ':email_address' => $this->Addresses['email_address'],
                ':id_customers' => $idUser
            ]);

            $stmt = $conn->prepare("INSERT INTO Orders (
                id_order, data_time, shipping_days, status, subtotal, tax,
                shipping_price, total, id_customer, id_customers
            ) VALUES (
                :id_order, :data_time, :shipping_days, :status, :subtotal, :tax,
                :shipping_price, :total, :id_customer, :id_customers
            )");

            $stmt->execute($this->Orders);

            $stmt = $conn->prepare("INSERT INTO Jobs (
                id_jobs, name, description, price_per_unit, amount, total,
                link_pdf, notes, new_colour, id_order, id_extras, id_clip, id_price_amount
            ) VALUES (
                :id_jobs, :name, :description, :price_per_unit, :amount, :total,
                :link_pdf, :notes, :new_colour, :id_order, :id_extras, :id_clip, :id_price_amount
            )");

            $stmt->execute($this->Jobs);

            $stmt = $conn->prepare("INSERT INTO Image (
                id_jobs, times_image, image_size, space_between_image, image_rotation,
                space_along_lanyard, link_image, image_position
            ) VALUES (
                :id_jobs, :times_image, :image_size, :space_between_image, :image_rotation,
                :space_along_lanyard, :link_image, :image_position
            )");

            $stmt->execute($this->Image);

            $stmt = $conn->prepare("INSERT INTO Text (
                id_jobs, content_text, time_text, space_between_text, space_along_lanyard,
                colour_text, font_family_text, size_text, bold_text, italic_text,
                underline_text, text_position
            ) VALUES (
                :id_jobs, :content_text, :time_text, :space_between_text, :space_along_lanyard,
                :colour_text, :font_family_text, :size_text, :bold_text, :italic_text,
                :underline_text, :text_position
            )");

            $stmt->execute($this->Text);

            $stmt = $conn->prepare("INSERT INTO Artwork (
                id_jobs, link_right_image, link_left_image
            ) VALUES (
                :id_jobs, :link_right_image, :link_left_image
            )");

            $stmt->execute($this->Artwork);

            $this->connection->closeConnection();
            return true;

        } catch (Exception $e) {
            error_log("Error en saveOrder: " . $e->getMessage());
            return false;
        }
    }
}

?>
