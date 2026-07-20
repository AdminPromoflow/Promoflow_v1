<?php

header(
    'Content-Type: application/json; charset=utf-8'
);

ini_set(
    'display_errors',
    '0'
);

error_reporting(
    E_ALL
);

date_default_timezone_set(
    'America/Bogota'
);


/* =========================================
   INCLUIR PHPMAILER
========================================= */

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


/* =========================================
   IMPORTAR CLASES DE PHPMAILER
========================================= */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;


/* =========================================
   CLASE PARA ENVIAR CORREOS
========================================= */

class EmailsSender
{
    /* =====================================
       FUNCIÓN PRINCIPAL
    ===================================== */

    public function handleEmail()
    {
        /*
         * El PDF se envía mediante FormData.
         *
         * Los textos llegan en:
         *
         * $_POST
         *
         * El archivo PDF llega en:
         *
         * $_FILES
         */

        $action =
            $_POST['action'] ??
            null;

        switch ($action) {

            case 'send_email':

                $this->sendEmail(
                    $_POST,
                    $_FILES
                );

                break;

            default:

                $this->responseJSON(
                    false,
                    'Acción no reconocida.'
                );

                break;
        }
    }


    /* =====================================
       ENVIAR CORREO
    ===================================== */

    private function sendEmail(
        array $data,
        array $files
    ) {
        try {

            /* =================================
               RECIBIR DATOS
            ================================= */

            $nombre = trim(
                (string) (
                    $data['nombre'] ??
                    ''
                )
            );

            $celular = trim(
                (string) (
                    $data['celular'] ??
                    ''
                )
            );

            $vereda = trim(
                (string) (
                    $data['vereda'] ??
                    ''
                )
            );

            $coordenadaX = trim(
                (string) (
                    $data['coordenada_x'] ??
                    ''
                )
            );

            $coordenadaY = trim(
                (string) (
                    $data['coordenada_y'] ??
                    ''
                )
            );

            $coordenadaZ = trim(
                (string) (
                    $data['coordenada_z'] ??
                    ''
                )
            );

            $cantidadFiguras = filter_var(
                $data['cantidad_figuras'] ??
                0,
                FILTER_VALIDATE_INT
            );


            /* =================================
               ORGANIZAR DATOS
            ================================= */

            $emailData = [
                'nombre' =>
                    $nombre,

                'celular' =>
                    $celular,

                'vereda' =>
                    $vereda,

                'coordenada_x' =>
                    $coordenadaX,

                'coordenada_y' =>
                    $coordenadaY,

                'coordenada_z' =>
                    $coordenadaZ,

                'cantidad_figuras' =>
                    $cantidadFiguras
            ];


            /* =================================
               VALIDAR DATOS
            ================================= */

            $this->validateData(
                $emailData
            );


            /* =================================
               VALIDAR PDF
            ================================= */

            $archivoPDF =
                $this->validatePDF(
                    $files
                );


            /* =================================
               VALIDAR TAMAÑO
            ================================= */

            $this->validateFileSize(
                $archivoPDF
            );


            /* =================================
               VALIDAR ARCHIVO SUBIDO
            ================================= */

            $this->validateUploadedFile(
                $archivoPDF
            );


            /* =================================
               DATOS DEL PDF
            ================================= */

            $rutaTemporal =
                (string) $archivoPDF['tmp_name'];

            $nombreOriginal =
                (string) $archivoPDF['name'];

            $nombrePDF =
                $this->createSafeFileName(
                    $nombreOriginal
                );


            /* =================================
               DATOS SEGUROS PARA HTML
            ================================= */

            $safeData =
                $this->getSafeData(
                    $emailData
                );


            /* =================================
               FECHA
            ================================= */

            $fecha =
                date(
                    'd/m/Y h:i:s a'
                );

            $year =
                date(
                    'Y'
                );


            /* =================================
               CREAR CUERPO HTML
            ================================= */

            $htmlBody =
                $this->createHTMLBody(
                    $safeData,
                    $fecha,
                    $year
                );


            /* =================================
               CREAR TEXTO PLANO
            ================================= */

            $plainTextBody =
                $this->createPlainTextBody(
                    $emailData,
                    $fecha,
                    $year
                );


            /* =================================
               CREAR PHPMAILER
            ================================= */

            $mail =
                new PHPMailer(
                    true
                );


            /* =================================
               CONFIGURACIÓN SMTP
            ================================= */

            $mail->isSMTP();

            $mail->SMTPDebug =
                SMTP::DEBUG_OFF;

            $mail->Host =
                'smtp.hostinger.com';

            $mail->Port =
                587;

            $mail->SMTPAuth =
                true;


            /*
             * CAMBIA ESTOS DATOS.
             */

            $mail->Username =
                'admin@lanyardsforyou.com';

            $mail->Password =
                '32skiff32!CI';


            $mail->SMTPSecure =
                PHPMailer::ENCRYPTION_STARTTLS;

            $mail->CharSet =
                'UTF-8';

            $mail->Encoding =
                'base64';

            $mail->Timeout =
                30;


            /* =================================
               REMITENTE
            ================================= */

            $mail->setFrom(
                'admin@lanyardsforyou.com',
                'Sistema de Mapas'
            );

            $mail->addReplyTo(
                'admin@lanyardsforyou.com',
                'Sistema de Mapas'
            );


            /* =================================
               DESTINATARIO
            ================================= */

            $mail->addAddress(
                'aleinarossui@gmail.com',
                'Asojuntas Arbeláez'
            );


            /*
             * Puedes agregar más destinatarios:
             *
             * $mail->addAddress(
             *     'otrocorreo@gmail.com',
             *     'Nombre de la persona'
             * );
             */


            /* =================================
               ADJUNTAR PDF
            ================================= */

            $mail->addAttachment(
                $rutaTemporal,
                $nombrePDF,
                PHPMailer::ENCODING_BASE64,
                'application/pdf'
            );


            /* =================================
               ASUNTO
            ================================= */

            $mail->Subject =
                'Nuevo mapa recibido - ' .
                $vereda;


            /* =================================
               CONTENIDO DEL CORREO
            ================================= */

            $mail->isHTML(
                true
            );

            $mail->Body =
                $htmlBody;

            $mail->AltBody =
                $plainTextBody;


            /* =================================
               ENVIAR CORREO
            ================================= */

            $mail->send();


            /* =================================
               RESPUESTA EXITOSA
            ================================= */

            $this->responseJSON(
                true,
                'El PDF fue enviado correctamente.',
                [
                    'archivo' =>
                        $nombrePDF,

                    'cantidad_figuras' =>
                        (int) $cantidadFiguras
                ]
            );

        } catch (Exception $error) {

            error_log(
                'EmailsSender::sendEmail PHPMailer error -> ' .
                $error->getMessage()
            );

            $this->responseJSON(
                false,
                'No fue posible enviar el correo: ' .
                $error->getMessage()
            );

        } catch (Throwable $error) {

            error_log(
                'EmailsSender::sendEmail error -> ' .
                $error->getMessage()
            );

            $this->responseJSON(
                false,
                $error->getMessage()
            );
        }
    }


    /* =====================================
       VALIDAR DATOS
    ===================================== */

    private function validateData(
        array $data
    ) {
        if (
            $data['nombre'] ===
            ''
        ) {
            throw new RuntimeException(
                'El nombre es obligatorio.'
            );
        }

        if (
            $data['celular'] ===
            ''
        ) {
            throw new RuntimeException(
                'El celular es obligatorio.'
            );
        }

        if (
            $data['vereda'] ===
            ''
        ) {
            throw new RuntimeException(
                'El nombre de la vereda es obligatorio.'
            );
        }

        if (
            $data['coordenada_x'] ===
            '' ||
            !is_numeric(
                $data['coordenada_x']
            )
        ) {
            throw new RuntimeException(
                'La coordenada X no es válida.'
            );
        }

        if (
            $data['coordenada_y'] ===
            '' ||
            !is_numeric(
                $data['coordenada_y']
            )
        ) {
            throw new RuntimeException(
                'La coordenada Y no es válida.'
            );
        }

        if (
            $data['coordenada_z'] ===
            '' ||
            !is_numeric(
                $data['coordenada_z']
            )
        ) {
            throw new RuntimeException(
                'El nivel de zoom no es válido.'
            );
        }

        if (
            $data['cantidad_figuras'] ===
            false ||
            $data['cantidad_figuras'] <
            1
        ) {
            throw new RuntimeException(
                'La cantidad de figuras no es válida.'
            );
        }
    }


    /* =====================================
       VALIDAR PDF
    ===================================== */

    private function validatePDF(
        array $files
    ): array {
        if (
            !isset(
                $files['pdf']
            )
        ) {
            throw new RuntimeException(
                'No se recibió el archivo PDF.'
            );
        }

        $archivoPDF =
            $files['pdf'];

        if (
            !is_array(
                $archivoPDF
            )
        ) {
            throw new RuntimeException(
                'La información del archivo PDF no es válida.'
            );
        }

        if (
            !isset(
                $archivoPDF['error'],
                $archivoPDF['tmp_name'],
                $archivoPDF['name'],
                $archivoPDF['size']
            )
        ) {
            throw new RuntimeException(
                'La información del archivo PDF está incompleta.'
            );
        }

        $errorArchivo =
            (int) $archivoPDF['error'];

        if (
            $errorArchivo !==
            UPLOAD_ERR_OK
        ) {
            throw new RuntimeException(
                $this->getUploadErrorMessage(
                    $errorArchivo
                )
            );
        }

        $nombreArchivo =
            (string) $archivoPDF['name'];

        $extension =
            strtolower(
                pathinfo(
                    $nombreArchivo,
                    PATHINFO_EXTENSION
                )
            );

        if (
            $extension !==
            'pdf'
        ) {
            throw new RuntimeException(
                'El archivo debe tener extensión PDF.'
            );
        }

        return $archivoPDF;
    }


    /* =====================================
       VALIDAR TAMAÑO DEL PDF
    ===================================== */

    private function validateFileSize(
        array $archivoPDF
    ) {
        $tamanoArchivo =
            (int) (
                $archivoPDF['size'] ??
                0
            );

        $tamanoMaximo =
            15 * 1024 * 1024;

        if (
            $tamanoArchivo <=
            0
        ) {
            throw new RuntimeException(
                'El archivo PDF está vacío.'
            );
        }

        if (
            $tamanoArchivo >
            $tamanoMaximo
        ) {
            throw new RuntimeException(
                'El archivo PDF supera el tamaño máximo permitido de 15 MB.'
            );
        }
    }


    /* =====================================
       VALIDAR ARCHIVO SUBIDO
    ===================================== */

    private function validateUploadedFile(
        array $archivoPDF
    ) {
        $rutaTemporal =
            (string) (
                $archivoPDF['tmp_name'] ??
                ''
            );

        if (
            $rutaTemporal ===
            ''
        ) {
            throw new RuntimeException(
                'No se encontró la ruta temporal del PDF.'
            );
        }

        if (
            !is_uploaded_file(
                $rutaTemporal
            )
        ) {
            throw new RuntimeException(
                'El archivo recibido no corresponde a una carga válida.'
            );
        }

        if (
            !file_exists(
                $rutaTemporal
            )
        ) {
            throw new RuntimeException(
                'El archivo PDF temporal no existe.'
            );
        }

        if (
            !is_readable(
                $rutaTemporal
            )
        ) {
            throw new RuntimeException(
                'El archivo PDF no puede ser leído por el servidor.'
            );
        }
    }


    /* =====================================
       CREAR DATOS SEGUROS
    ===================================== */

    private function getSafeData(
        array $data
    ): array {
        return [
            'nombre' =>
                htmlspecialchars(
                    (string) $data['nombre'],
                    ENT_QUOTES |
                    ENT_SUBSTITUTE,
                    'UTF-8'
                ),

            'celular' =>
                htmlspecialchars(
                    (string) $data['celular'],
                    ENT_QUOTES |
                    ENT_SUBSTITUTE,
                    'UTF-8'
                ),

            'vereda' =>
                htmlspecialchars(
                    (string) $data['vereda'],
                    ENT_QUOTES |
                    ENT_SUBSTITUTE,
                    'UTF-8'
                ),

            'coordenada_x' =>
                htmlspecialchars(
                    (string) $data['coordenada_x'],
                    ENT_QUOTES |
                    ENT_SUBSTITUTE,
                    'UTF-8'
                ),

            'coordenada_y' =>
                htmlspecialchars(
                    (string) $data['coordenada_y'],
                    ENT_QUOTES |
                    ENT_SUBSTITUTE,
                    'UTF-8'
                ),

            'coordenada_z' =>
                htmlspecialchars(
                    (string) $data['coordenada_z'],
                    ENT_QUOTES |
                    ENT_SUBSTITUTE,
                    'UTF-8'
                ),

            'cantidad_figuras' =>
                htmlspecialchars(
                    (string) $data['cantidad_figuras'],
                    ENT_QUOTES |
                    ENT_SUBSTITUTE,
                    'UTF-8'
                )
        ];
    }


    /* =====================================
       CREAR CUERPO HTML
    ===================================== */

    private function createHTMLBody(
        array $data,
        string $fecha,
        string $year
    ): string {
        $nombre =
            $data['nombre'];

        $celular =
            $data['celular'];

        $vereda =
            $data['vereda'];

        $coordenadaX =
            $data['coordenada_x'];

        $coordenadaY =
            $data['coordenada_y'];

        $coordenadaZ =
            $data['coordenada_z'];

        $cantidadFiguras =
            $data['cantidad_figuras'];

        return <<<HTML
<!doctype html>

<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Nuevo mapa recibido
    </title>

</head>

<body
    style="
        margin:0;
        padding:0;
        background:#ffffff;
    "
>

    <div
        style="
            display:none;
            max-height:0;
            overflow:hidden;
            line-height:1px;
            color:#ffffff;
            opacity:0;
        "
    >
        Se ha generado un nuevo mapa para la vereda {$vereda}.
    </div>

    <div
        style="
            width:100%;
            background:#ffffff;
        "
    >

        <div
            style="
                max-width:640px;
                margin:0 auto;
                padding:24px;
                border:1px solid #000000;
                box-sizing:border-box;
            "
        >

            <div
                style="
                    margin:0 0 8px 0;
                "
            >

                <p
                    style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:12px;
                        line-height:1.4;
                        color:#000000;
                    "
                >
                    ASOJUNTAS ARBELÁEZ
                </p>

            </div>

            <div
                style="
                    margin:0 0 16px 0;
                "
            >

                <h1
                    style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:22px;
                        line-height:1.3;
                        color:#000000;
                    "
                >
                    Nuevo mapa recibido
                </h1>

            </div>

            <div
                style="
                    margin:0 0 16px 0;
                "
            >

                <p
                    style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        line-height:1.6;
                        color:#000000;
                    "
                >
                    Se ha generado un nuevo mapa con las áreas dibujadas por el solicitante.
                </p>

            </div>

            <div
                style="
                    margin:16px 0;
                    padding:12px 0;
                    border-top:1px solid #000000;
                    border-bottom:1px solid #000000;
                "
            >

                <p
                    style="
                        margin:0 0 10px 0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Nombre:
                    </strong>

                    <span>
                        {$nombre}
                    </span>

                </p>

                <p
                    style="
                        margin:0 0 10px 0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Celular:
                    </strong>

                    <span>
                        {$celular}
                    </span>

                </p>

                <p
                    style="
                        margin:0 0 10px 0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Vereda:
                    </strong>

                    <span>
                        {$vereda}
                    </span>

                </p>

                <p
                    style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Figuras dibujadas:
                    </strong>

                    <span>
                        {$cantidadFiguras}
                    </span>

                </p>

            </div>

            <div
                style="
                    margin:24px 0 12px 0;
                "
            >

                <h2
                    style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:18px;
                        line-height:1.3;
                        color:#000000;
                    "
                >
                    Información geográfica
                </h2>

            </div>

            <div
                style="
                    margin:16px 0;
                    padding:12px 0;
                    border-top:1px solid #000000;
                    border-bottom:1px solid #000000;
                "
            >

                <p
                    style="
                        margin:0 0 10px 0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        X - Longitud:
                    </strong>

                    <span>
                        {$coordenadaX}
                    </span>

                </p>

                <p
                    style="
                        margin:0 0 10px 0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Y - Latitud:
                    </strong>

                    <span>
                        {$coordenadaY}
                    </span>

                </p>

                <p
                    style="
                        margin:0 0 10px 0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Zoom:
                    </strong>

                    <span>
                        {$coordenadaZ}
                    </span>

                </p>

                <p
                    style="
                        margin:0 0 10px 0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Sistema:
                    </strong>

                    <span>
                        WGS 84
                    </span>

                </p>

                <p
                    style="
                        margin:0 0 10px 0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Código:
                    </strong>

                    <span>
                        EPSG:4326
                    </span>

                </p>

                <p
                    style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        color:#000000;
                    "
                >

                    <strong
                        style="
                            display:inline-block;
                            width:180px;
                        "
                    >
                        Fecha:
                    </strong>

                    <span>
                        {$fecha}
                    </span>

                </p>

            </div>

            <div
                style="
                    margin:0 0 16px 0;
                "
            >

                <p
                    style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        line-height:1.6;
                        color:#000000;
                    "
                >
                    El archivo PDF con el mapa y todas las figuras dibujadas se encuentra adjunto a este correo.
                </p>

            </div>

            <div
                style="
                    margin:16px 0 0 0;
                "
            >

                <p
                    style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:13px;
                        line-height:1.6;
                        color:#000000;
                    "
                >
                    Atentamente,
                    <br>

                    Sistema de Mapas de Asojuntas Arbeláez
                </p>

            </div>

        </div>

        <div
            style="
                max-width:640px;
                margin:8px auto 0 auto;
                text-align:center;
            "
        >

            <p
                style="
                    margin:0;
                    font-family:Arial, Helvetica, sans-serif;
                    font-size:11px;
                    color:#000000;
                "
            >
                © {$year} Asojuntas Arbeláez. Todos los derechos reservados.
            </p>

        </div>

    </div>

</body>

</html>
HTML;
    }


    /* =====================================
       CREAR TEXTO PLANO
    ===================================== */

    private function createPlainTextBody(
        array $data,
        string $fecha,
        string $year
    ): string {
        return
            "NUEVO MAPA RECIBIDO\n\n" .

            "Se ha generado un nuevo mapa con las áreas dibujadas por el solicitante.\n\n" .

            "INFORMACIÓN DEL SOLICITANTE\n\n" .

            "Nombre: " .
            $data['nombre'] .
            "\n" .

            "Celular: " .
            $data['celular'] .
            "\n" .

            "Vereda: " .
            $data['vereda'] .
            "\n" .

            "Figuras dibujadas: " .
            $data['cantidad_figuras'] .
            "\n\n" .

            "INFORMACIÓN GEOGRÁFICA\n\n" .

            "X - Longitud: " .
            $data['coordenada_x'] .
            "\n" .

            "Y - Latitud: " .
            $data['coordenada_y'] .
            "\n" .

            "Zoom: " .
            $data['coordenada_z'] .
            "\n" .

            "Sistema: WGS 84\n" .

            "Código: EPSG:4326\n" .

            "Fecha: " .
            $fecha .
            "\n\n" .

            "El archivo PDF con el mapa se encuentra adjunto a este correo.\n\n" .

            "Atentamente,\n" .

            "Sistema de Mapas de Asojuntas Arbeláez\n\n" .

            "© " .
            $year .
            " Asojuntas Arbeláez";
    }


    /* =====================================
       MENSAJES DE ERROR DEL ARCHIVO
    ===================================== */

    private function getUploadErrorMessage(
        int $errorCode
    ): string {
        switch ($errorCode) {

            case UPLOAD_ERR_INI_SIZE:

                return
                    'El PDF supera el tamaño permitido por el servidor.';

            case UPLOAD_ERR_FORM_SIZE:

                return
                    'El PDF supera el tamaño permitido por el formulario.';

            case UPLOAD_ERR_PARTIAL:

                return
                    'El PDF solamente se cargó parcialmente.';

            case UPLOAD_ERR_NO_FILE:

                return
                    'No se recibió ningún archivo PDF.';

            case UPLOAD_ERR_NO_TMP_DIR:

                return
                    'El servidor no tiene una carpeta temporal disponible.';

            case UPLOAD_ERR_CANT_WRITE:

                return
                    'El servidor no pudo guardar temporalmente el PDF.';

            case UPLOAD_ERR_EXTENSION:

                return
                    'Una extensión de PHP detuvo la carga del PDF.';

            default:

                return
                    'Ocurrió un error desconocido al recibir el PDF.';
        }
    }


    /* =====================================
       CREAR NOMBRE SEGURO DEL PDF
    ===================================== */

    private function createSafeFileName(
        string $originalName
    ): string {
        $originalName =
            basename(
                $originalName
            );

        $fileName =
            pathinfo(
                $originalName,
                PATHINFO_FILENAME
            );

        $convertedName =
            iconv(
                'UTF-8',
                'ASCII//TRANSLIT//IGNORE',
                $fileName
            );

        if (
            $convertedName ===
            false ||
            trim(
                $convertedName
            ) ===
            ''
        ) {
            $convertedName =
                'mapa';
        }

        $convertedName =
            strtolower(
                $convertedName
            );

        $convertedName =
            preg_replace(
                '/[^a-z0-9_-]+/',
                '-',
                $convertedName
            );

        $convertedName =
            trim(
                (string) $convertedName,
                '-'
            );

        if (
            $convertedName ===
            ''
        ) {
            $convertedName =
                'mapa';
        }

        return
            $convertedName .
            '.pdf';
    }


    /* =====================================
       RESPUESTA JSON
    ===================================== */

    private function responseJSON(
        bool $response,
        string $message,
        array $additionalData = []
    ) {
        echo json_encode(
            array_merge(
                [
                    'ok' =>
                        $response,

                    'response' =>
                        $response,

                    'mensaje' =>
                        $message
                ],
                $additionalData
            ),
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
        );

        exit;
    }
}


/* =========================================
   CREAR INSTANCIA
========================================= */

$emailClass =
    new EmailsSender();


/* =========================================
   EJECUTAR CONTROLADOR
========================================= */

$emailClass->handleEmail();

?>
