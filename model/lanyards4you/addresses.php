<?php

class Addresses_Model {
    private $Address1 = [];
    private $Address2 = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setAddress1(array $data)
    {
        $this->Address1 = [
            'id_adddress'      => $data['idAddress'] ?? null,
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
            'id_customer'      => $data['idUser'] ?? null,
            'id_customers'     => $data['idUser'] ?? null
        ];
        
        return $this;
    }

    public function setAddress2(array $data)
    {
        $this->Address2 = [
            'id_adddress'      => $data['idAddress'] ?? null,
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
            'id_customer'      => $data['idUser'] ?? null,
            'id_customers'     => $data['idUser'] ?? null
        ];
        
        return $this;
    }
}
?>