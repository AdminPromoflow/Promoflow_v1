<?php

class User_Model {
    private $User = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setUser(array $data)
    {
        $this->User = [
            'id_customers' => $data['idUser'] ?? null,
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null
        ];
        
        return $this;
    }
}
?>