<?php

class Job_Model {
    private $Jobs = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setJobs(array $data)
    {
        $this->Jobs = [
            'id_jobs' => $data['idJobs'] ?? null,           // JSON: idJobs
            'name' => $data['name'] ?? null,
            'description' => $data['description'] ?? null,
            'price_per_unit' => $data['price_per_unit'] ?? null,
            'amount' => $data['amount'] ?? null,
            'total' => $data['total'] ?? null,
            'link_pdf' => $data['link_pdf'] ?? null,
            'notes' => $data['notes'] ?? null,
            'new_colour' => $data['newColour'] ?? null,     // JSON: newColour
            'id_order' => $data['idOrder'] ?? null,         // JSON: idOrder
            'id_extras' => $data['idExtras'] ?? null,
            'id_clip' => $data['idClip'] ?? null,
            'id_price_amount' => $data['idPriceAmount'] ?? null
        ];
        
        return $this;
    }
}
?>