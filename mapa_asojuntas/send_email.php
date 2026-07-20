<?php

declare(strict_types=1);

/* =========================================
   RESPUESTA EN FORMATO JSON
========================================= */

header("Content-Type: application/json; charset=utf-8");

/* =========================================
   EVITAR QUE ERRORES PHP DAÑEN EL JSON
========================================= */

ini_set("display_errors", "0");
error_reporting(E_ALL);

/* =========================================
   CARGAR PHPMAILER
========================================= */

/*
 * Esta ruta funciona cuando instalaste
 * PHPMailer usando Composer:
 *
 * composer require phpmailer/phpmailer
 */

$rutaAutoload = __DIR__ . "/vendor/autoload.php";

if (!file_exists($rutaAutoload)) {
    responderJSON(
        false,
        "No se encontró PHPMailer. Verifica que exista la carpeta vendor."
    );
}

require_once $rutaAutoload;

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

/* =========================================
   FUNCIÓN PARA RESPONDER JSON
========================================= */

function responderJSON(
    bool $ok,
    string $mensaje,
    array $datos = []
): void {
    echo json_encode(
        array_merge(
            [
                "ok" => $ok,
                "mensaje" => $mensaje
            ],
            $datos
        ),
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );

    exit;
}

/* =========================================
   VERIFICAR MÉTODO HTTP
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responderJSON(
        false,
        "Método no permitido. Debes enviar los datos mediante POST."
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
    $_POST["cantidad_figuras"] ?? "0"
);

/* =========================================
   VALIDAR DATOS
========================================= */

if ($nombre === "") {
    responderJSON(
        false,
        "El nombre es obligatorio."
    );
}

if ($celular === "") {
    responderJSON(
        false,
        "El número de celular es obligatorio."
    );
}

if ($vereda === "") {
    responderJSON(
        false,
        "El nombre de la vereda es obligatorio."
    );
}

if (
    $coordenadaX === "" ||
    !is_numeric($coordenadaX)
) {
    responderJSON(
        false,
        "La coordenada X no es válida."
    );
}

if (
    $coordenadaY === "" ||
    !is_numeric($coordenadaY)
) {
    responderJSON(
        false,
        "La coordenada Y no es válida."
    );
}

if (
    $coordenadaZ === "" ||
    !is_numeric($coordenadaZ)
) {
    responderJSON(
        false,
        "El nivel de zoom no es válido."
    );
}

if (
    !ctype_digit($cantidadFiguras) ||
    (int) $cantidadFiguras < 1
) {
    responderJSON(
        false,
        "La cantidad de figuras no es válida."
    );
}

/* =========================================
   VALIDAR ARCHIVO PDF
========================================= */

if (!isset($_FILES["pdf"])) {
    responderJSON(
        false,
        "No se recibió el archivo PDF."
    );
}

$archivoPDF = $_FILES["pdf"];

if (
    !isset(
        $archivoPDF["error"],
        $archivoPDF["tmp_name"],
        $archivoPDF["name"],
        $archivoPDF["size"]
    )
) {
    responderJSON(
        false,
        "La información del archivo PDF está incompleta."
    );
}

if (
    $archivoPDF["error"] !==
    UPLOAD_ERR_OK
) {
    $mensajeErrorArchivo =
        obtenerMensajeErrorArchivo(
            (int) $archivoPDF["error"]
        );

    responderJSON(
        false,
        $mensajeErrorArchivo
    );
}

/* =========================================
   VALIDAR TAMAÑO DEL PDF
========================================= */

$tamanoMaximo =
    15 * 1024 * 1024;

if (
    (int) $archivoPDF["size"] <= 0
) {
    responderJSON(
        false,
        "El archivo PDF está vacío."
    );
}

if (
    (int) $archivoPDF["size"] >
    $tamanoMaximo
) {
    responderJSON(
        false,
        "El archivo PDF supera el tamaño máximo permitido de 15 MB."
    );
}

/* =========================================
   VALIDAR ARCHIVO TEMPORAL
========================================= */

$rutaTemporal =
    $archivoPDF["tmp_name"];

if (
    !is_uploaded_file(
        $rutaTemporal
    )
) {
    responderJSON(
        false,
        "El archivo recibido no es una carga válida."
    );
}

/* =========================================
   VALIDAR TIPO MIME
========================================= */

$finfo =
    new finfo(
        FILEINFO_MIME_TYPE
    );

$tipoMime =
    $finfo->file(
        $rutaTemporal
    );

$tiposPermitidos = [
    "application/pdf",
    "application/x-pdf"
];

if (
    !in_array(
        $tipoMime,
        $tiposPermitidos,
        true
    )
) {
    responderJSON(
        false,
        "El archivo enviado no es un PDF válido."
    );
}

/* =========================================
   VALIDAR FIRMA DEL PDF
========================================= */

$manejadorArchivo =
    fopen(
        $rutaTemporal,
        "rb"
    );

if ($manejadorArchivo === false) {
    responderJSON(
        false,
        "No fue posible leer el archivo PDF."
    );
}

$firmaPDF =
    fread(
        $manejadorArchivo,
        5
    );

fclose(
    $manejadorArchivo
);

if ($firmaPDF !== "%PDF-") {
    responderJSON(
        false,
        "El archivo no contiene una estructura PDF válida."
    );
}

/* =========================================
   CREAR NOMBRE SEGURO DEL ARCHIVO
========================================= */

$nombreArchivo =
    crearNombreSeguro(
        $archivoPDF["name"]
    );

if (
    strtolower(
        pathinfo(
            $nombreArchivo,
            PATHINFO_EXTENSION
        )
    ) !== "pdf"
) {
    $nombreArchivo .= ".pdf";
}

/* =========================================
   LIMPIAR DATOS PARA MOSTRARLOS
========================================= */

$nombreSeguro =
    htmlspecialchars(
        $nombre,
        ENT_QUOTES |
        ENT_SUBSTITUTE,
        "UTF-8"
    );

$celularSeguro =
    htmlspecialchars(
        $celular,
        ENT_QUOTES |
        ENT_SUBSTITUTE,
        "UTF-8"
    );

$veredaSegura =
    htmlspecialchars(
        $vereda,
        ENT_QUOTES |
        ENT_SUBSTITUTE,
        "UTF-8"
    );

$coordenadaXSegura =
    htmlspecialchars(
        $coordenadaX,
        ENT_QUOTES |
        ENT_SUBSTITUTE,
        "UTF-8"
    );

$coordenadaYSegura =
    htmlspecialchars(
        $coordenadaY,
        ENT_QUOTES |
        ENT_SUBSTITUTE,
        "UTF-8"
    );

$coordenadaZSegura =
    htmlspecialchars(
        $coordenadaZ,
        ENT_QUOTES |
        ENT_SUBSTITUTE,
        "UTF-8"
    );

$cantidadFigurasSegura =
    htmlspecialchars(
        $cantidadFiguras,
        ENT_QUOTES |
        ENT_SUBSTITUTE,
        "UTF-8"
    );

/* =========================================
   CONFIGURACIÓN DEL CORREO
========================================= */

/*
 * CAMBIA ESTOS DATOS.
 *
 * Ejemplo para un correo de Hostinger:
 *
 * Servidor SMTP:
 * smtp.hostinger.com
 *
 * Puerto SSL:
 * 465
 *
 * Puerto TLS:
 * 587
 */

$servidorSMTP =
    "smtp.hostinger.com";

$usuarioSMTP =
    "admin@lanyardsforyou.com";

$contrasenaSMTP =
    "32skiff32!CI";

$puertoSMTP =
    465;

/*
 * Correo desde el cual se enviará el mensaje.
 *
 * Normalmente debe ser igual a $usuarioSMTP.
 */

$correoRemitente =
    "admin@lanyardsforyou.com";

$nombreRemitente =
    "Mapa Asojuntas";

/*
 * Correo que recibirá el PDF.
 */

$correoDestino =
    "aleinarossui@gmail.com";

$nombreDestino =
    "Asojuntas Arbeláez";

/* =========================================
   VALIDAR CONFIGURACIÓN
========================================= */

if (
    !filter_var(
        $correoRemitente,
        FILTER_VALIDATE_EMAIL
    )
) {
    responderJSON(
        false,
        "El correo remitente configurado no es válido."
    );
}

if (
    !filter_var(
        $correoDestino,
        FILTER_VALIDATE_EMAIL
    )
) {
    responderJSON(
        false,
        "El correo de destino configurado no es válido."
    );
}

/* =========================================
   FECHA DE ENVÍO
========================================= */

date_default_timezone_set(
    "America/Bogota"
);

$fechaEnvio =
    date(
        "d/m/Y h:i:s a"
    );

/* =========================================
   ASUNTO DEL CORREO
========================================= */

$asunto =
    "Nuevo mapa enviado - " .
    $vereda;

/* =========================================
   CUERPO HTML
========================================= */

$cuerpoHTML = "
<!DOCTYPE html>
<html lang=\"es\">
<head>
    <meta charset=\"UTF-8\">

    <meta
        name=\"viewport\"
        content=\"width=device-width, initial-scale=1.0\"
    >

    <title>Nuevo mapa enviado</title>
</head>

<body
    style=\"
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
        font-family: Arial, Helvetica, sans-serif;
        color: #1f2937;
    \"
>
    <table
        width=\"100%\"
        cellpadding=\"0\"
        cellspacing=\"0\"
        role=\"presentation\"
        style=\"
            background-color: #f3f4f6;
            padding: 30px 15px;
        \"
    >
        <tr>
            <td align=\"center\">
                <table
                    width=\"100%\"
                    cellpadding=\"0\"
                    cellspacing=\"0\"
                    role=\"presentation\"
                    style=\"
                        max-width: 650px;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
                    \"
                >
                    <tr>
                        <td
                            style=\"
                                padding: 25px 30px;
                                background-color: #163f30;
                                color: #ffffff;
                            \"
                        >
                            <h1
                                style=\"
                                    margin: 0;
                                    font-size: 24px;
                                \"
                            >
                                Nuevo mapa recibido
                            </h1>

                            <p
                                style=\"
                                    margin: 8px 0 0;
                                    font-size: 14px;
                                    color: #d9eee5;
                                \"
                            >
                                Se ha generado y enviado un nuevo mapa.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td
                            style=\"
                                padding: 30px;
                            \"
                        >
                            <h2
                                style=\"
                                    margin: 0 0 20px;
                                    font-size: 19px;
                                    color: #163f30;
                                \"
                            >
                                Información del solicitante
                            </h2>

                            <table
                                width=\"100%\"
                                cellpadding=\"8\"
                                cellspacing=\"0\"
                                role=\"presentation\"
                                style=\"
                                    border-collapse: collapse;
                                    font-size: 15px;
                                \"
                            >
                                <tr>
                                    <td
                                        style=\"
                                            width: 42%;
                                            border-bottom: 1px solid #e5e7eb;
                                            font-weight: bold;
                                        \"
                                    >
                                        Nombre
                                    </td>

                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                        \"
                                    >
                                        {$nombreSeguro}
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                            font-weight: bold;
                                        \"
                                    >
                                        Celular
                                    </td>

                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                        \"
                                    >
                                        {$celularSeguro}
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                            font-weight: bold;
                                        \"
                                    >
                                        Vereda
                                    </td>

                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                        \"
                                    >
                                        {$veredaSegura}
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                            font-weight: bold;
                                        \"
                                    >
                                        Cantidad de figuras
                                    </td>

                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                        \"
                                    >
                                        {$cantidadFigurasSegura}
                                    </td>
                                </tr>
                            </table>

                            <h2
                                style=\"
                                    margin: 30px 0 20px;
                                    font-size: 19px;
                                    color: #163f30;
                                \"
                            >
                                Información geográfica
                            </h2>

                            <table
                                width=\"100%\"
                                cellpadding=\"8\"
                                cellspacing=\"0\"
                                role=\"presentation\"
                                style=\"
                                    border-collapse: collapse;
                                    font-size: 15px;
                                \"
                            >
                                <tr>
                                    <td
                                        style=\"
                                            width: 42%;
                                            border-bottom: 1px solid #e5e7eb;
                                            font-weight: bold;
                                        \"
                                    >
                                        X - Longitud
                                    </td>

                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                        \"
                                    >
                                        {$coordenadaXSegura}
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                            font-weight: bold;
                                        \"
                                    >
                                        Y - Latitud
                                    </td>

                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                        \"
                                    >
                                        {$coordenadaYSegura}
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                            font-weight: bold;
                                        \"
                                    >
                                        Zoom de impresión
                                    </td>

                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                        \"
                                    >
                                        {$coordenadaZSegura}
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                            font-weight: bold;
                                        \"
                                    >
                                        Sistema de coordenadas
                                    </td>

                                    <td
                                        style=\"
                                            border-bottom: 1px solid #e5e7eb;
                                        \"
                                    >
                                        WGS 84 - EPSG:4326
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style=\"
                                            font-weight: bold;
                                        \"
                                    >
                                        Fecha de envío
                                    </td>

                                    <td>
                                        {$fechaEnvio}
                                    </td>
                                </tr>
                            </table>

                            <div
                                style=\"
                                    margin-top: 25px;
                                    padding: 16px;
                                    background-color: #eef7f2;
                                    border-left: 4px solid #1d6b4c;
                                    border-radius: 6px;
                                \"
                            >
                                El archivo PDF con el mapa se encuentra adjunto a este correo.
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td
                            style=\"
                                padding: 18px 30px;
                                background-color: #f8faf9;
                                text-align: center;
                                font-size: 12px;
                                color: #6b7280;
                            \"
                        >
                            Mensaje enviado automáticamente desde el sistema de mapas.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
";

/* =========================================
   CUERPO DE TEXTO PLANO
========================================= */

$cuerpoTexto = "
NUEVO MAPA RECIBIDO

Información del solicitante

Nombre: {$nombre}
Celular: {$celular}
Vereda: {$vereda}
Cantidad de figuras: {$cantidadFiguras}

Información geográfica

X - Longitud: {$coordenadaX}
Y - Latitud: {$coordenadaY}
Zoom de impresión: {$coordenadaZ}
Sistema de coordenadas: WGS 84 - EPSG:4326
Fecha de envío: {$fechaEnvio}

El archivo PDF con el mapa se encuentra adjunto a este correo.
";

/* =========================================
   ENVIAR CORREO
========================================= */

$mail =
    new PHPMailer(true);

try {
    /* =====================================
       CONFIGURACIÓN SMTP
    ===================================== */

    $mail->isSMTP();

    $mail->Host =
        $servidorSMTP;

    $mail->SMTPAuth =
        true;

    $mail->Username =
        $usuarioSMTP;

    $mail->Password =
        $contrasenaSMTP;

    /*
     * Para puerto 465:
     */

    $mail->SMTPSecure =
        PHPMailer::ENCRYPTION_SMTPS;

    $mail->Port =
        $puertoSMTP;

    /*
     * Para puerto 587 puedes usar:
     *
     * $mail->SMTPSecure =
     *     PHPMailer::ENCRYPTION_STARTTLS;
     *
     * $mail->Port = 587;
     */

    $mail->CharSet =
        "UTF-8";

    $mail->Encoding =
        "base64";

    $mail->Timeout =
        30;

    /* =====================================
       REMITENTE Y DESTINATARIO
    ===================================== */

    $mail->setFrom(
        $correoRemitente,
        $nombreRemitente
    );

    $mail->addAddress(
        $correoDestino,
        $nombreDestino
    );

    /*
     * Permite responder usando los datos
     * generales del sistema.
     */

    $mail->addReplyTo(
        $correoRemitente,
        $nombreRemitente
    );

    /* =====================================
       ADJUNTAR PDF
    ===================================== */

    $mail->addAttachment(
        $rutaTemporal,
        $nombreArchivo,
        PHPMailer::ENCODING_BASE64,
        "application/pdf"
    );

    /* =====================================
       CONTENIDO DEL CORREO
    ===================================== */

    $mail->isHTML(true);

    $mail->Subject =
        $asunto;

    $mail->Body =
        $cuerpoHTML;

    $mail->AltBody =
        $cuerpoTexto;

    /* =====================================
       ENVIAR
    ===================================== */

    $mail->send();

    responderJSON(
        true,
        "El PDF fue enviado correctamente.",
        [
            "archivo" =>
                $nombreArchivo,

            "cantidad_figuras" =>
                (int) $cantidadFiguras
        ]
    );
} catch (Exception $error) {
    error_log(
        "Error enviando el correo: " .
        $mail->ErrorInfo
    );

    responderJSON(
        false,
        "No fue posible enviar el correo. Revisa la configuración SMTP."
    );
}

/* =========================================
   FUNCIÓN PARA ERRORES DE ARCHIVOS
========================================= */

function obtenerMensajeErrorArchivo(
    int $codigoError
): string {
    return match ($codigoError) {
        UPLOAD_ERR_INI_SIZE =>
            "El PDF supera el tamaño permitido por el servidor.",

        UPLOAD_ERR_FORM_SIZE =>
            "El PDF supera el tamaño permitido por el formulario.",

        UPLOAD_ERR_PARTIAL =>
            "El PDF se cargó parcialmente.",

        UPLOAD_ERR_NO_FILE =>
            "No se recibió ningún archivo PDF.",

        UPLOAD_ERR_NO_TMP_DIR =>
            "El servidor no tiene una carpeta temporal disponible.",

        UPLOAD_ERR_CANT_WRITE =>
            "El servidor no pudo guardar temporalmente el PDF.",

        UPLOAD_ERR_EXTENSION =>
            "Una extensión de PHP detuvo la carga del archivo.",

        default =>
            "Ocurrió un error desconocido al recibir el PDF."
    };
}

/* =========================================
   FUNCIÓN PARA CREAR NOMBRE SEGURO
========================================= */

function crearNombreSeguro(
    string $nombreOriginal
): string {
    $nombreOriginal =
        basename(
            $nombreOriginal
        );

    $extension =
        strtolower(
            pathinfo(
                $nombreOriginal,
                PATHINFO_EXTENSION
            )
        );

    $nombreSinExtension =
        pathinfo(
            $nombreOriginal,
            PATHINFO_FILENAME
        );

    $nombreSinExtension =
        iconv(
            "UTF-8",
            "ASCII//TRANSLIT//IGNORE",
            $nombreSinExtension
        ) ?: "mapa";

    $nombreSinExtension =
        strtolower(
            $nombreSinExtension
        );

    $nombreSinExtension =
        preg_replace(
            "/[^a-z0-9_-]+/",
            "-",
            $nombreSinExtension
        );

    $nombreSinExtension =
        trim(
            $nombreSinExtension,
            "-"
        );

    if ($nombreSinExtension === "") {
        $nombreSinExtension =
            "mapa";
    }

    if ($extension !== "pdf") {
        $extension =
            "pdf";
    }

    return
        $nombreSinExtension .
        "." .
        $extension;
}
