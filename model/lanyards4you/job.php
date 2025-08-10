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

    public function createJob(bool $close = true): bool
    {
        try {
            // Validación mínima
            if ($this->Jobs['id_jobs'] === null) {
                throw new InvalidArgumentException("id_jobs es obligatorio para crear el Job.");
            }

            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                INSERT INTO Jobs (
                    id_jobs, name, description, price_per_unit, amount, total,
                    link_pdf, notes, new_colour, id_order, id_extras, id_clip, id_price_amount
                ) VALUES (
                    :id_jobs, :name, :description, :price_per_unit, :amount, :total,
                    :link_pdf, :notes, :new_colour, :id_order, :id_extras, :id_clip, :id_price_amount
                )
            ");

            // Binds (con casteos suaves para evitar sorpresas)
            $sql->bindValue(':id_jobs',        (int)$this->Jobs['id_jobs'],        PDO::PARAM_INT);
            $sql->bindValue(':name',           $this->Jobs['name']);
            $sql->bindValue(':description',    $this->Jobs['description']); // JSON en string está OK
            $sql->bindValue(':price_per_unit', $this->Jobs['price_per_unit']);     // FLOAT -> string/num
            $sql->bindValue(':amount',         $this->Jobs['amount'] !== null ? (int)$this->Jobs['amount'] : null, $this->Jobs['amount'] !== null ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $sql->bindValue(':total',          $this->Jobs['total']);
            $sql->bindValue(':link_pdf',       $this->Jobs['link_pdf']);
            $sql->bindValue(':notes',          $this->Jobs['notes']);

            // new_colour es BLOB; si viene null lo mandamos como NULL, si no, como string/LOB
            if ($this->Jobs['new_colour'] === null || $this->Jobs['new_colour'] === '') {
                $sql->bindValue(':new_colour', null, PDO::PARAM_NULL);
            } else {
                // Si lo manejas como string binario, esto funciona. Si usas stream, cambia a bindParam con PDO::PARAM_LOB.
                $sql->bindValue(':new_colour', $this->Jobs['new_colour']);
            }

            $sql->bindValue(':id_order',       $this->Jobs['id_order'] !== null ? (int)$this->Jobs['id_order'] : null, $this->Jobs['id_order'] !== null ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $sql->bindValue(':id_extras',      $this->Jobs['id_extras'] !== null ? (int)$this->Jobs['id_extras'] : null, $this->Jobs['id_extras'] !== null ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $sql->bindValue(':id_clip',        $this->Jobs['id_clip']   !== null ? (int)$this->Jobs['id_clip']   : null, $this->Jobs['id_clip']   !== null ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $sql->bindValue(':id_price_amount',$this->Jobs['id_price_amount'] !== null ? (int)$this->Jobs['id_price_amount'] : null, $this->Jobs['id_price_amount'] !== null ? PDO::PARAM_INT : PDO::PARAM_NULL);

            $ok = $sql->execute();

            if ($close) {
                $this->connection->closeConnection();
            }

            return $ok;

        } catch (Throwable $e) {
            // Puedes registrar el error para depuración
            error_log("Error al crear Job: " . $e->getMessage());
            return false;
        }
    }

}
?>
