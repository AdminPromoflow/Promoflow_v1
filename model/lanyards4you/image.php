<?php

class Image_Model {
    private $Image = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setImage(array $data)
    {
        $this->Image = [
            'id_jobs' => $data['idJobs'] ?? null,
            'times_image' => $data['timesImage'] ?? null,
            'image_size' => $data['imageSize'] ?? null,
            'space_between_image' => $data['spaceBetweenImage'] ?? null,
            'image_rotation' => $data['imageRotation'] ?? null,
            'space_along_lanyard' => $data['spaceAlongLanyard'] ?? null,
            'link_image' => $data['linkImage'] ?? null,
            'image_position' => $data['imagePosition'] ?? null
        ];

        return $this;
    }
    
    public function createImage(bool $close = true): bool
    {
        try {
            if (!isset($this->Image['id_jobs']) || $this->Image['id_jobs'] === null) {
                throw new InvalidArgumentException("id_jobs es obligatorio para crear la imagen.");
            }

            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                INSERT INTO Image (
                    id_jobs,
                    times_image,
                    image_size,
                    space_between_image,
                    image_rotation,
                    space_along_lanyard,
                    link_image,
                    image_position
                ) VALUES (
                    :id_jobs,
                    :times_image,
                    :image_size,
                    :space_between_image,
                    :image_rotation,
                    :space_along_lanyard,
                    :link_image,
                    :image_position
                )
            ");

            // Helper para floats (acepta "12,34")
            $toFloat = function ($v) {
                if ($v === null || $v === '') return null;
                return (float) str_replace(',', '.', (string)$v);
            };

            // Binds
            $sql->bindValue(':id_jobs', (int)$this->Image['id_jobs'], PDO::PARAM_INT);

            if ($this->Image['times_image'] !== null) {
                $sql->bindValue(':times_image', (int)$this->Image['times_image'], PDO::PARAM_INT);
            } else {
                $sql->bindValue(':times_image', null, PDO::PARAM_NULL);
            }

            $sql->bindValue(':image_size',          $toFloat($this->Image['image_size']));
            $sql->bindValue(':space_between_image', $toFloat($this->Image['space_between_image']));
            $sql->bindValue(':image_rotation',      $toFloat($this->Image['image_rotation']));
            $sql->bindValue(':space_along_lanyard', $toFloat($this->Image['space_along_lanyard']));
            $sql->bindValue(':link_image',          $this->Image['link_image']);

            if ($this->Image['image_position'] !== null) {
                $sql->bindValue(':image_position', $toFloat($this->Image['image_position']));
            } else {
                $sql->bindValue(':image_position', null, PDO::PARAM_NULL);
            }

            $ok = $sql->execute();

            if ($close) {
                $this->connection->closeConnection();
            }

            return $ok;

        } catch (Throwable $e) {
            error_log("Error al crear Image: " . $e->getMessage());
            return false;
        }
    }

}
?>
