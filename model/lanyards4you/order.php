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

    public function getAllOrders(): array
    {
        $conn = $this->connection->getConnection();

        // 1) TODAS LAS ÓRDENES
        $stmtOrders = $conn->prepare("
            SELECT
                id_order        AS idOrder,
                data_time       AS date_time,
                shipping_days   AS shippingDays,
                status          AS status,
                subtotal        AS subtotal,
                tax             AS tax,
                shipping_price  AS shipping_price,
                total           AS total,
                id_customers    AS idUser
            FROM Orders
            ORDER BY data_time DESC, id_order DESC
        ");
        $stmtOrders->execute();
        $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

        if (!$orders) {
            return [];
        }

        // Recolectar IDs para consultas masivas
        $orderIds = [];
        $userIds  = [];
        foreach ($orders as $o) {
            $orderIds[] = (int)$o['idOrder'];
            if ($o['idUser'] !== null) {
                $userIds[] = (int)$o['idUser'];
            }
        }
        $orderIds = array_values(array_unique($orderIds));
        $userIds  = array_values(array_unique($userIds));

        // Helper para placeholders IN (:p0,:p1,...)
        $makeIn = function(array $ids, string $prefix) {
            $placeholders = [];
            $params = [];
            foreach ($ids as $i => $val) {
                $ph = ":{$prefix}{$i}";
                $placeholders[] = $ph;
                $params[$ph] = $val;
            }
            return [$placeholders, $params];
        };

        // 2) JOBS DE TODAS LAS ÓRDENES
        $jobsByOrder = [];
        $jobsAll = [];
        if (!empty($orderIds)) {
            [$ph, $params] = $makeIn($orderIds, 'oid');
            $sqlJobs = "
                SELECT
                    id_jobs            AS idJobs,
                    name               AS name,
                    description        AS description,
                    price_per_unit     AS price_per_unit,
                    amount             AS amount,
                    total              AS total,
                    link_pdf           AS link_pdf,
                    notes              AS notes,
                    new_colour         AS newColour,
                    id_order           AS idOrder,
                    id_extras          AS idExtras,
                    id_clip            AS idClip,
                    id_price_amount    AS idPriceAmount,
                    idSupplier         AS idSupplier
                FROM Jobs
                WHERE id_order IN (".implode(',', $ph).")
                ORDER BY id_jobs ASC
            ";
            $stmtJobs = $conn->prepare($sqlJobs);
            $stmtJobs->execute($params);
            $jobsAll = $stmtJobs->fetchAll(PDO::FETCH_ASSOC);

            foreach ($jobsAll as $j) {
                $jobsByOrder[(int)$j['idOrder']][] = $j;
            }
        }

        // Recolectar id_jobs para imágenes/textos/artwork
        $jobIds = [];
        foreach ($jobsAll as $j) {
            $jobIds[] = (int)$j['idJobs'];
        }
        $jobIds = array_values(array_unique($jobIds));

        // 3) IMÁGENES POR JOB
        $imagesByJob = [];
        if (!empty($jobIds)) {
            [$ph, $params] = $makeIn($jobIds, 'jid');
            $sqlImg = "
                SELECT
                    id_jobs                   AS idJobs,
                    times_image               AS timesImage,
                    image_size                AS imageSize,
                    space_between_image       AS spaceBetweenImage,
                    image_rotation            AS imageRotation,
                    space_along_lanyard       AS spaceAlongLanyard,
                    link_image                AS linkImage,
                    image_position            AS imagePosition
                FROM Image
                WHERE id_jobs IN (".implode(',', $ph).")
                ORDER BY id_jobs
            ";
            $stmtImg = $conn->prepare($sqlImg);
            $stmtImg->execute($params);
            $imgs = $stmtImg->fetchAll(PDO::FETCH_ASSOC);
            foreach ($imgs as $row) {
                $imagesByJob[(int)$row['idJobs']][] = $row;
            }
        }

        // 4) TEXTOS POR JOB
        $textsByJob = [];
        if (!empty($jobIds)) {
            [$ph, $params] = $makeIn($jobIds, 'tid');
            $sqlTxt = "
                SELECT
                    id_jobs                 AS idJobs,
                    content_text            AS contentText,
                    time_text               AS timeText,
                    space_between_text      AS spaceBetweenText,
                    space_along_lanyard     AS spaceAlongLanyard,
                    colour_text             AS colourText,
                    font_family_text        AS fontFamilyText,
                    size_text               AS sizeText,
                    bold_text               AS boldText,
                    italic_text             AS italicText,
                    underline_text          AS underlineText,
                    text_position           AS textPosition
                FROM Text
                WHERE id_jobs IN (".implode(',', $ph).")
                ORDER BY id_jobs
            ";
            $stmtTxt = $conn->prepare($sqlTxt);
            $stmtTxt->execute($params);
            $txts = $stmtTxt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($txts as $row) {
                $textsByJob[(int)$row['idJobs']][] = $row;
            }
        }

        // 5) ARTWORK POR JOB
        $artworkByJob = [];
        if (!empty($jobIds)) {
            [$ph, $params] = $makeIn($jobIds, 'aid');
            $sqlArt = "
                SELECT
                    id_jobs            AS idJobs,
                    link_right_image   AS linkRightImage,
                    link_left_image    AS linkLeftImage
                FROM Artwork
                WHERE id_jobs IN (".implode(',', $ph).")
            ";
            $stmtArt = $conn->prepare($sqlArt);
            $stmtArt->execute($params);
            $arts = $stmtArt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($arts as $row) {
                $artworkByJob[(int)$row['idJobs']] = $row;
            }
        }

        // 6) DIRECCIONES POR USUARIO
        $addressesByUser = [];
        if (!empty($userIds)) {
            [$ph, $params] = $makeIn($userIds, 'uid');
            // Ojo: en el esquema la columna es id_adddress (con 3 d)
            $sqlAddr = "
                SELECT
                    id_adddress       AS idAddress,
                    first_name,
                    last_name,
                    company_name,
                    phone,
                    country,
                    state,
                    town_city,
                    street_address_1,
                    street_address_2,
                    postcode,
                    email_address,
                    id_customers      AS idUser
                FROM Addresses
                WHERE id_customers IN (".implode(',', $ph).")
                ORDER BY id_adddress ASC
            ";
            $stmtAddr = $conn->prepare($sqlAddr);
            $stmtAddr->execute($params);
            $addrs = $stmtAddr->fetchAll(PDO::FETCH_ASSOC);
            foreach ($addrs as $row) {
                $addressesByUser[(int)$row['idUser']][] = $row;
            }
        }

        // 7) USUARIOS
        $usersById = [];
        if (!empty($userIds)) {
            [$ph, $params] = $makeIn($userIds, 'cu');
            $sqlUsers = "
                SELECT
                    id_customers AS idUser,
                    name,
                    email
                FROM Customers
                WHERE id_customers IN (".implode(',', $ph).")
            ";
            $stmtUsers = $conn->prepare($sqlUsers);
            $stmtUsers->execute($params);
            $users = $stmtUsers->fetchAll(PDO::FETCH_ASSOC);
            foreach ($users as $u) {
                $u['password'] = null;
                $u['signup_category'] = 'normal';
                $usersById[(int)$u['idUser']] = $u;
            }
        }

        // 8) ENSAMBLAR ESTRUCTURA (addresses dentro de user; image/text/artwork dentro de job)
        $result = [];

        foreach ($orders as $o) {
            $oid = (int)$o['idOrder'];
            $uid = $o['idUser'] !== null ? (int)$o['idUser'] : null;

            // Jobs para la orden, con image/text/artwork anidados dentro de "job"
            $jobs = [];
            if (!empty($jobsByOrder[$oid])) {
                foreach ($jobsByOrder[$oid] as $j) {
                    $jid = (int)$j['idJobs'];

                    // El objeto "job" contiene sus propios campos + image/text/artwork
                    $jobObject = $j;
                    $jobObject['image']   = $imagesByJob[$jid]  ?? [];
                    $jobObject['text']    = $textsByJob[$jid]   ?? [];
                    $jobObject['artwork'] = $artworkByJob[$jid] ?? (object)[];

                    $jobs[] = [ "job" => $jobObject ];
                }
            }

            // User con addresses embebidas
            $user = null;
            if ($uid !== null) {
                $user = $usersById[$uid] ?? null;
                if ($user !== null) {
                    $user['addresses'] = $addressesByUser[$uid] ?? [];
                }
            }

            $bundle = [
                "order" => $o,
                "jobs"  => $jobs,
                "user"  => $user
            ];

            $result[] = $bundle;
        }

        return $result;
    }







}

?>
