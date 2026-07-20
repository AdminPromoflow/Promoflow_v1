<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Mapa de Arbeláez</title>

    <?php
    $stylePath = __DIR__ . "/style.css";
    $appPath = __DIR__ . "/app.js";

    $styleVersion = file_exists($stylePath)
        ? filemtime($stylePath)
        : time();

    $appVersion = file_exists($appPath)
        ? filemtime($appPath)
        : time();
    ?>

    <!-- Leaflet -->
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    >

    <!-- Leaflet Draw -->
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"
    >

    <!-- Custom CSS -->
    <link
        rel="stylesheet"
        href="style.css?v=<?= $styleVersion ?>"
    >
</head>

<body>

    <header>
        <h1>Map of Arbeláez</h1>

        <button
            type="button"
            id="print-drawn-polygons"
        >
            Download map image
        </button>
    </header>

    <div id="map"></div>

    <!-- Leaflet -->
    <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    ></script>

    <!-- Leaflet Draw -->
    <script
        src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"
    ></script>

    <!-- html2canvas -->
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
    ></script>

    <!-- Custom JavaScript -->
    <script src="app.js?v=<?= $appVersion ?>"></script>

</body>
</html>
