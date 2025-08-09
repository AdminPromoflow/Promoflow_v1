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
}
?>