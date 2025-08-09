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


}

?>
