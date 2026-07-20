<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Mapa de Arbeláez</title>

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

    <!-- Nuestro CSS -->
    <link
        rel="stylesheet"
        href="style.css"
    >
</head>

<body>

    <header>
        <h1>Mapa de Arbeláez</h1>
    </header>

    <div id="map"></div>

    <!-- Leaflet primero -->
    <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    ></script>

    <!-- Leaflet Draw después -->
    <script
        src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"
    ></script>

    <!-- Nuestro JavaScript al final -->
    <script src="app.js"></script>

</body>
</html>
