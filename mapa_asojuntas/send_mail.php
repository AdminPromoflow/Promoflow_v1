<?php

declare(strict_types=1);

/* =========================================
   RESPUESTA EN FORMATO JSON
========================================= */

header("Content-Type: application/json; charset=utf-8");

/* =========================================
   CARGAR PHPMAILER
========================================= */

/*
 * Esta configuración supone que tienes:
 *
 * send_email.php
 * PHPMailer/
 * └── src/
 *     ├── PHPMailer.php
 *     ├── SMTP.php
 *     └── Exception.php
 */

require_once __DIR__ . "/PHPMailer/src/Exception.php";
require_once __DIR__ . "/PHPMailer/src/PHPMailer.php";
require_once __DIR__ . "/PHPMailer/src/SMTP.php";

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

/* =========================================
   FUNCIÓN PARA RESPONDER
========================================= */

function responder(
    bool $ok,
    string $mensaje,
    int $codigoHttp = 200
): void {
    http_response_code($codigoHttp);

    echo json_encode(
        [
            "ok" => $ok,
            "mensaje" => $mensaje
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

/* =========================================
   VALIDAR MÉTODO
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(
        false,
        "Método de solicitud no permitido.",
        405
    );
}

/* =========================================
   RECIBIR DATOS
========================================= */

$nombre = trim(
    $_POST["nombre"] ?? ""
);

$celular = trim(
    $_POST["celular"] ?? ""
);

$vereda = trim(
    $_POST["vereda"] ?? ""
);

$coordenadaX = trim(
    $_POST["coordenada_x"] ?? ""
);

$coordenadaY = trim(
    $_POST["coordenada_y"] ?? ""
);

$coordenadaZ = trim(
    $_POST["coordenada_z"] ?? ""
);

$cantidadFiguras = trim(
    $_POST["cantidad_figuras"] ?? "1"
);

/* =========================================
   VALIDAR DATOS
========================================= */

if ($nombre === "") {
    responder(
        false,
        "El nombre es obligatorio.",
        422
    );
}

if ($celular === "") {
    responder(
        false,
        "El número de celular es obligatorio.",
        422
    );
}

if ($vereda === "") {
    responder(
        false,
        "El nombre de la vereda es obligatorio.",
        422
    );
}

if (
    $coordenadaX === "" ||
    !is_numeric($coordenadaX)
) {
    responder(
        false,
        "La coordenada X no es válida.",
        422
    );
}

if (
    $coordenadaY === "" ||
    !is_numeric($coordenadaY)
) {
    responder(
        false,
        "La coordenada Y no es válida.",
        422
    );
}

if (
    $coordenadaZ === "" ||
    !is_numeric($coordenadaZ)
) {
    responder(
        false,
        "El nivel de zoom no es válido.",
        422
    );
}

/* =========================================
   VALIDAR ARCHIVO PDF
========================================= */

if (!isset($_FILES["pdf"])) {
    responder(
        false,
        "No se recibió el archivo PDF.",
        422
    );
}

$archivoPDF = $_FILES["pdf"];

if (
    !isset($archivoPDF["error"]) ||
    is_array($archivoPDF["error"])
) {
    responder(
        false,
        "El archivo recibido no es válido.",
        422
    );
}

if ($archivoPDF["error"] !== UPLOAD_ERR_OK) {
    $mensajesError = [
        UPLOAD_ERR_INI_SIZE =>
            "El PDF supera el tamaño permitido por el servidor.",

        UPLOAD_ERR_FORM_SIZE =>
            "El PDF supera el tamaño permitido por el formulario.",

        UPLOAD_ERR_PARTIAL =>
            "El PDF se recibió de manera incompleta.",

        UPLOAD_ERR_NO_FILE =>
            "No se seleccionó ningún archivo PDF.",

        UPLOAD_ERR_NO_TMP_DIR =>
            "El servidor no tiene una carpeta temporal disponible.",

        UPLOAD_ERR_CANT_WRITE =>
            "El servidor no pudo guardar temporalmente el archivo.",

        UPLOAD_ERR_EXTENSION =>
            "Una extensión del servidor detuvo la carga del archivo."
    ];

    responder(
        false,
        $mensajesError[$archivoPDF["error"]] ??
            "Ocurrió un error al recibir el PDF.",
        422
    );
}

$tamanoMaximo = 15 * 1024 * 1024;

if ($archivoPDF["size"] > $tamanoMaximo) {
    responder(
        false,
        "El PDF no puede superar los 15 MB.",
        422
    );
}

$rutaTemporal = $archivoPDF["tmp_name"];

if (
    !is_uploaded_file($rutaTemporal)
) {
    responder(
        false,
        "El archivo recibido no es una carga válida.",
        422
    );
}

/* =========================================
   COMPROBAR QUE SEA PDF
========================================= */

$tipoMime = "";

if (
    class_exists("finfo")
) {
    $finfo = new finfo(
        FILEINFO_MIME_TYPE
    );

    $tipoMime = $finfo->file(
        $rutaTemporal
    );
}

$tiposPermitidos = [
    "application/pdf",
    "application/x-pdf"
];

if (
    $tipoMime !== "" &&
    !in_array(
        $tipoMime,
        $tiposPermitidos,
        true
    )
) {
    responder(
        false,
        "El archivo recibido no es un PDF válido.",
        422
    );
}

/* =========================================
   LIMPIAR NOMBRE DEL ARCHIVO
========================================= */

$nombreOriginal =
    basename(
        $archivoPDF["name"] ??
        "mapa-vereda.pdf"
    );

$nombreSeguro = preg_replace(
    "/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ._-]/u",
    "-",
    $nombreOriginal
);

if (
    $nombreSeguro === null ||
    $nombreSeguro === ""
) {
    $nombreSeguro =
        "mapa-vereda.pdf";
}

if (
    strtolower(
        pathinfo(
            $nombreSeguro,
            PATHINFO_EXTENSION
        )
    ) !== "pdf"
) {
    $nombreSeguro .= ".pdf";
}

/* =========================================
   ESCAPAR TEXTO PARA HTML
========================================= */

$nombreHTML = htmlspecialchars(
    $nombre,
    ENT_QUOTES,
    "UTF-8"
);

$celularHTML = htmlspecialchars(
    $celular,
    ENT_QUOTES,
    "UTF-8"
);

$veredaHTML = htmlspecialchars(
    $vereda,
    ENT_QUOTES,
    "UTF-8"
);

$coordenadaXHTML = htmlspecialchars(
    $coordenadaX,
    ENT_QUOTES,
    "UTF-8"
);

$coordenadaYHTML = htmlspecialchars(
    $coordenadaY,
    ENT_QUOTES,
    "UTF-8"
);

$coordenadaZHTML = htmlspecialchars(
    $coordenadaZ,
    ENT_QUOTES,
    "UTF-8"
);

$cantidadFigurasHTML = htmlspecialchars(
    $cantidadFiguras,
    ENT_QUOTES,
    "UTF-8"
);

/* =========================================
   CONFIGURAR Y ENVIAR CORREO
========================================= */

$mail = new PHPMailer(
    true
);

try {
    /* =====================================
       CONFIGURACIÓN SMTP
    ===================================== */

    $mail->isSMTP();

    $mail->Host =
        "smtp.hostinger.com";

    $mail->SMTPAuth =
        true;

    /*
     * Coloca aquí el correo completo
     * desde el cual se enviará el mensaje.
     */
    $mail->Username =
        "admin@lanyardsforyou.com";

    /*
     * Coloca aquí la contraseña del correo.
     */
    $mail->Password =
        "32skiff32!CI";

    $mail->SMTPSecure =
        PHPMailer::ENCRYPTION_SMTPS;

    $mail->Port =
        465;

    $mail->CharSet =
        "UTF-8";

    $mail->Encoding =
        "base64";

    /*
     * Durante las pruebas puedes usar:
     *
     * $mail->SMTPDebug = SMTP::DEBUG_SERVER;
     *
     * Pero debes quitarlo cuando
     * el sistema esté funcionando.
     */
    $mail->SMTPDebug =
        SMTP::DEBUG_OFF;

    /* =====================================
       REMITENTE
    ===================================== */

    $mail->setFrom(
        "admin@lanyardsforyou.com",
        "Mapa de Juntas de Acción Comunal"
    );

    /* =====================================
       DESTINATARIO
    ===================================== */

    /*
     * Coloca aquí el correo que recibirá
     * los mapas enviados por los usuarios.
     */
    $mail->addAddress(
        "aleinarossui@gmail.com",
        "Administrador"
    );

    /*
     * Opcionalmente puedes agregar
     * otros destinatarios:
     *
     * $mail->addCC("otro@tudominio.com");
     * $mail->addBCC("copia@tudominio.com");
     */

    /* =====================================
       ARCHIVO ADJUNTO
    ===================================== */

    $mail->addAttachment(
        $rutaTemporal,
        $nombreSeguro
    );

    /* =====================================
       CONTENIDO DEL CORREO
    ===================================== */

    $mail->isHTML(
        true
    );

    $mail->Subject =
        "Nuevo mapa solicitado - " .
        $vereda;

    $mail->Body = "
        <!DOCTYPE html>
        <html lang=\"es\">
        <head>
            <meta charset=\"UTF-8\">

            <style>
                body {
                    margin: 0;
                    padding: 24px;
                    background-color: #f3f4f6;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #202124;
                }

                .contenedor {
                    max-width: 650px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow:
                        0 4px 18px
                        rgba(0, 0, 0, 0.08);
                }

                .encabezado {
                    padding: 24px;
                    background-color: #263238;
                    color: #ffffff;
                }

                .encabezado h1 {
                    margin: 0;
                    font-size: 22px;
                }

                .contenido {
                    padding: 24px;
                }

                .contenido p {
                    margin-top: 0;
                    line-height: 1.6;
                }

                .tabla {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                .tabla th,
                .tabla td {
                    padding: 12px;
                    border: 1px solid #dddddd;
                    text-align: left;
                    vertical-align: top;
                }

                .tabla th {
                    width: 38%;
                    background-color: #f5f5f5;
                }

                .aviso {
                    margin-top: 20px;
                    padding: 14px;
                    border-radius: 8px;
                    background-color: #fff8e1;
                }
            </style>
        </head>

        <body>
            <div class=\"contenedor\">
                <div class=\"encabezado\">
                    <h1>
                        Nueva solicitud de mapa
                    </h1>
                </div>

                <div class=\"contenido\">
                    <p>
                        Se recibió una nueva solicitud
                        de mapa con un archivo PDF adjunto.
                    </p>

                    <table class=\"tabla\">
                        <tr>
                            <th>
                                Nombre
                            </th>

                            <td>
                                {$nombreHTML}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                Celular
                            </th>

                            <td>
                                {$celularHTML}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                Vereda
                            </th>

                            <td>
                                {$veredaHTML}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                Cantidad de figuras
                            </th>

                            <td>
                                {$cantidadFigurasHTML}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                X - Longitud
                            </th>

                            <td>
                                {$coordenadaXHTML}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                Y - Latitud
                            </th>

                            <td>
                                {$coordenadaYHTML}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                Z - Zoom
                            </th>

                            <td>
                                {$coordenadaZHTML}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                Sistema de coordenadas
                            </th>

                            <td>
                                WGS 84 - EPSG:4326
                            </td>
                        </tr>
                    </table>

                    <div class=\"aviso\">
                        El mapa se encuentra adjunto
                        a este mensaje en formato PDF.
                    </div>
                </div>
            </div>
        </body>
        </html>
    ";

    $mail->AltBody =
        "Nueva solicitud de mapa.\n\n" .
        "Nombre: {$nombre}\n" .
        "Celular: {$celular}\n" .
        "Vereda: {$vereda}\n" .
        "Cantidad de figuras: {$cantidadFiguras}\n" .
        "X - Longitud: {$coordenadaX}\n" .
        "Y - Latitud: {$coordenadaY}\n" .
        "Z - Zoom: {$coordenadaZ}\n" .
        "Sistema de coordenadas: WGS 84 - EPSG:4326\n\n" .
        "El PDF se encuentra adjunto al correo.";

    $mail->send();

    responder(
        true,
        "El correo fue enviado correctamente."
    );
} catch (Exception $e) {
    error_log(
        "Error PHPMailer: " .
        $mail->ErrorInfo
    );

    responder(
        false,
        "No fue posible enviar el correo.",
        500
    );
}
