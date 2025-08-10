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
            'id_order'       => $data['idOrder'] ?? null,       // DB: id_order | JSON: idOrder
            'data_time'      => $data['date_time'] ?? null,     // DB: data_time | JSON: date_time
            'shipping_days'  => $data['shippingDays'] ?? null,  // DB: shipping_days | JSON: shippingDays
            'status'         => $data['status'] ?? null,        // DB: status | JSON: status
            'subtotal'       => $data['subtotal'] ?? null,      // DB: subtotal | JSON: subtotal
            'tax'            => $data['tax'] ?? null,           // DB: tax | JSON: tax
            'shipping_price' => $data['shipping_price'] ?? null,// DB: shipping_price | JSON: shipping_price
            'total'          => $data['total'] ?? null,         // DB: total | JSON: total
            'id_customers'   => $data['idUser'] ?? null         // DB: id_customers | JSON: idUser
        ];

        return $this;
    }

    public function createOrder(bool $close = true): bool
    {
        try {
            if (!isset($this->Orders['id_order']) || $this->Orders['id_order'] === null) {
                throw new InvalidArgumentException("id_order es obligatorio para crear la orden.");
            }

            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                INSERT INTO Orders (
                    id_order, data_time, shipping_days, status,
                    subtotal, tax, shipping_price, total, id_customers
                ) VALUES (
                    :id_order, :data_time, :shipping_days, :status,
                    :subtotal, :tax, :shipping_price, :total, :id_customers
                )
            ");

            // Binds (con tipos adecuados y NULL cuando aplique)
            $sql->bindValue(':id_order', (int)$this->Orders['id_order'], PDO::PARAM_INT);
            $sql->bindValue(':data_time', $this->Orders['data_time']); // "YYYY-MM-DD HH:MM:SS" o NULL
            if ($this->Orders['shipping_days'] !== null) {
                $sql->bindValue(':shipping_days', (int)$this->Orders['shipping_days'], PDO::PARAM_INT);
            } else {
                $sql->bindValue(':shipping_days', null, PDO::PARAM_NULL);
            }

            $sql->bindValue(':status', $this->Orders['status']);

            // Numéricos: si vienen como string, casteamos suave a float
            $toFloat = function ($v) {
                if ($v === null || $v === '') return null;
                // por si acaso te llega con coma decimal
                return (float) str_replace(',', '.', (string)$v);
            };

            $sql->bindValue(':subtotal',       $toFloat($this->Orders['subtotal']));
            $sql->bindValue(':tax',            $toFloat($this->Orders['tax']));
            $sql->bindValue(':shipping_price', $toFloat($this->Orders['shipping_price']));
            $sql->bindValue(':total',          $toFloat($this->Orders['total']));

            if ($this->Orders['id_customers'] !== null) {
                $sql->bindValue(':id_customers', (int)$this->Orders['id_customers'], PDO::PARAM_INT);
            } else {
                $sql->bindValue(':id_customers', null, PDO::PARAM_NULL);
            }

            $ok = $sql->execute();

            if ($close) {
                $this->connection->closeConnection();
            }

            return $ok;

        } catch (Throwable $e) {
            error_log("Error al crear la orden: " . $e->getMessage());
            return false;
        }
    }




}

?>
