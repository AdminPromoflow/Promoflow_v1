<?php

class Artwork_Model {
    private $Artwork = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setArtwork(array $data)
    {
        $this->Artwork = [
            'id_jobs' => $data['idJobs'] ?? null,
            'link_right_image' => $data['linkRightImage'] ?? null,
            'link_left_image' => $data['linkLeftImage'] ?? null
        ];

        return $this;
    }

    public function createArtwork(bool $close = true): bool
    {
        try {
            if (!isset($this->Artwork['id_jobs']) || $this->Artwork['id_jobs'] === null) {
                throw new InvalidArgumentException("id_jobs es obligatorio para crear el Artwork.");
            }

            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                INSERT INTO Artwork (
                    id_jobs,
                    link_right_image,
                    link_left_image
                ) VALUES (
                    :id_jobs,
                    :link_right_image,
                    :link_left_image
                )
            ");

            $sql->bindValue(':id_jobs', (int)$this->Artwork['id_jobs'], PDO::PARAM_INT);
            $sql->bindValue(':link_right_image', $this->Artwork['link_right_image']);
            $sql->bindValue(':link_left_image',  $this->Artwork['link_left_image']);

            $ok = $sql->execute();

            if ($close) {
                $this->connection->closeConnection();
            }

            return $ok;

        } catch (Throwable $e) {
            error_log("Error al crear Artwork: " . $e->getMessage());
            return false;
        }
    }

}
?>
