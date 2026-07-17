<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
    >

    <title>Mapa Asojuntas</title>

    <!-- Leaflet -->
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    >

    <!-- Leaflet Draw -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"
    >

    <!-- Estilos propios -->
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <header class="encabezado">
        <div class="titulo-contenedor">
            <h1>Mapa de veredas</h1>

            <p>
                Asojuntas
            </p>
        </div>

        <button
            id="descargar_mapa_pdf"
            class="boton-descargar"
            type="button"
            aria-label="Descargar mapa en PDF"
        >
            <span class="icono-descarga">⬇</span>
            <span class="texto-boton">
                Descargar PDF
            </span>
        </button>
    </header>

    <main class="contenedor-mapa">
        <div id="map"></div>
    </main>

    <!-- Leaflet -->
    <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    ></script>

    <!-- Leaflet Draw -->
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js"
    ></script>

    <!-- Captura del mapa -->
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
    ></script>

    <!-- PDF -->
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ></script>

    <!-- JavaScript propio -->
    <script src="app.js"></script>

</body>
</html>
