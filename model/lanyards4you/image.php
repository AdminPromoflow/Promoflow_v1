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
}
?>