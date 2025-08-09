<?php

class Text_Model {
    private $Text = [];
    private $connection;

    public function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function setText(array $data)
    {
        $this->Text = [
            'id_jobs' => $data['idJobs'] ?? null,
            'content_text' => $data['contentText'] ?? null,
            'time_text' => $data['timesText'] ?? null,
            'space_between_text' => $data['spaceBetweenText'] ?? null,
            'space_along_lanyard' => $data['spaceAlongLanyard'] ?? null,
            'colour_text' => $data['colourText'] ?? null,
            'font_family_text' => $data['fontFamilyText'] ?? null,
            'size_text' => $data['sizeText'] ?? null,
            'bold_text' => $data['boldText'] ?? null,
            'italic_text' => $data['italicText'] ?? null,
            'underline_text' => $data['underlineText'] ?? null,
            'text_position' => $data['textPosition'] ?? null
        ];
        
        return $this;
    }
}
?>