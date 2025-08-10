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

    public function createText(bool $close = true): bool
    {
        try {
            if (!isset($this->Text['id_jobs']) || $this->Text['id_jobs'] === null) {
                throw new InvalidArgumentException("id_jobs es obligatorio para crear el Text.");
            }

            $conn = $this->connection->getConnection();

            $sql = $conn->prepare("
                INSERT INTO Text (
                    id_jobs,
                    content_text,
                    time_text,
                    space_between_text,
                    space_along_lanyard,
                    colour_text,
                    font_family_text,
                    size_text,
                    bold_text,
                    italic_text,
                    underline_text,
                    text_position
                ) VALUES (
                    :id_jobs,
                    :content_text,
                    :time_text,
                    :space_between_text,
                    :space_along_lanyard,
                    :colour_text,
                    :font_family_text,
                    :size_text,
                    :bold_text,
                    :italic_text,
                    :underline_text,
                    :text_position
                )
            ");

            // Helpers
            $toFloat = function ($v) {
                if ($v === null || $v === '') return null;
                return (float) str_replace(',', '.', (string)$v);
            };
            $toBoolOrNull = function ($v) {
                if ($v === null || $v === '') return null;
                return (bool)$v;
            };

            // Binds
            $sql->bindValue(':id_jobs', (int)$this->Text['id_jobs'], PDO::PARAM_INT);

            $sql->bindValue(':content_text', $this->Text['content_text']);

            if ($this->Text['time_text'] !== null) {
                $sql->bindValue(':time_text', (int)$this->Text['time_text'], PDO::PARAM_INT);
            } else {
                $sql->bindValue(':time_text', null, PDO::PARAM_NULL);
            }

            $sql->bindValue(':space_between_text', $toFloat($this->Text['space_between_text']));
            $sql->bindValue(':space_along_lanyard', $toFloat($this->Text['space_along_lanyard']));
            $sql->bindValue(':colour_text', $this->Text['colour_text']);
            $sql->bindValue(':font_family_text', $this->Text['font_family_text']);
            $sql->bindValue(':size_text', $toFloat($this->Text['size_text']));

            // BOOL en MySQL -> 0/1. PDO::PARAM_BOOL lo maneja bien.
            $bold = $toBoolOrNull($this->Text['bold_text']);
            if ($bold === null) { $sql->bindValue(':bold_text', null, PDO::PARAM_NULL); }
            else { $sql->bindValue(':bold_text', $bold, PDO::PARAM_BOOL); }

            $italic = $toBoolOrNull($this->Text['italic_text']);
            if ($italic === null) { $sql->bindValue(':italic_text', null, PDO::PARAM_NULL); }
            else { $sql->bindValue(':italic_text', $italic, PDO::PARAM_BOOL); }

            $underline = $toBoolOrNull($this->Text['underline_text']);
            if ($underline === null) { $sql->bindValue(':underline_text', null, PDO::PARAM_NULL); }
            else { $sql->bindValue(':underline_text', $underline, PDO::PARAM_BOOL); }

            $sql->bindValue(':text_position', $toFloat($this->Text['text_position']));

            $ok = $sql->execute();

            if ($close) {
                $this->connection->closeConnection();
            }

            return $ok;

        } catch (Throwable $e) {
            error_log("Error al crear Text: " . $e->getMessage());
            return false;
        }
    }

}
?>
