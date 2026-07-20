"use strict";

/* =========================================
   CREAR MAPA
========================================= */

const map = L.map("map", {
    preferCanvas: true,
    zoomControl: true,
    touchZoom: true,
    doubleClickZoom: true,
    scrollWheelZoom: true,
    boxZoom: true,
    keyboard: true,
    dragging: true,
    tap: false
}).setView(
    [4.270625797339428, -74.41654400019608],
    13
);

/* =========================================
   MAPAS BASE
========================================= */

const mapaCalles = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap",
        crossOrigin: "anonymous"
    }
);

const mapaSatelital = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/" +
        "World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 20,
        attribution: "Imágenes &copy; Esri",
        crossOrigin: "anonymous"
    }
).addTo(map);

/* =========================================
   VARIABLES
========================================= */

let fondoVeredas = null;
let modoDibujoOEdicionActivo = false;

/* =========================================
   COLORES
========================================= */

const coloresVeredas = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#008080",
    "#9a6324",
    "#800000",
    "#808000",
    "#000075",
    "#469990",
    "#a9a9a9",
    "#ff7f50",
    "#7b68ee",
    "#2e8b57",
    "#dc143c"
];

/* =========================================
   FUNCIONES AUXILIARES
========================================= */

function obtenerColor(nombre) {
    const texto = String(
        nombre || "Sin nombre"
    );

    let numero = 0;

    for (let i = 0; i < texto.length; i++) {
        numero += texto.charCodeAt(i);
    }

    return coloresVeredas[
        numero % coloresVeredas.length
    ];
}

function escaparHTML(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function esperar(milisegundos) {
    return new Promise((resolve) => {
        window.setTimeout(
            resolve,
            milisegundos
        );
    });
}

function esDispositivoMovil() {
    return window.matchMedia(
        "(max-width: 768px)"
    ).matches;
}

/* =========================================
   ESPERAR CARGA DEL MAPA
========================================= */

async function esperarCargaMapa() {
    await esperar(700);

    const imagenes = Array.from(
        document.querySelectorAll(
            "#map .leaflet-tile"
        )
    );

    const pendientes = imagenes.filter(
        (imagen) => {
            return !imagen.complete;
        }
    );

    if (pendientes.length > 0) {
        await Promise.all(
            pendientes.map((imagen) => {
                return new Promise(
                    (resolve) => {
                        let terminado = false;

                        function finalizar() {
                            if (terminado) {
                                return;
                            }

                            terminado = true;
                            resolve();
                        }

                        imagen.addEventListener(
                            "load",
                            finalizar,
                            {
                                once: true
                            }
                        );

                        imagen.addEventListener(
                            "error",
                            finalizar,
                            {
                                once: true
                            }
                        );

                        window.setTimeout(
                            finalizar,
                            5000
                        );
                    }
                );
            })
        );
    }

    await esperar(
        esDispositivoMovil()
            ? 1000
            : 600
    );
}

/* =========================================
   ESPERAR MOVIMIENTO DEL MAPA
========================================= */

function esperarMovimientoMapa(
    tiempoMaximo = 2000
) {
    return new Promise((resolve) => {
        let terminado = false;

        function finalizar() {
            if (terminado) {
                return;
            }

            terminado = true;

            map.off(
                "moveend",
                finalizar
            );

            resolve();
        }

        map.once(
            "moveend",
            finalizar
        );

        window.setTimeout(
            finalizar,
            tiempoMaximo
        );
    });
}

/* =========================================
   CALCULAR TAMAÑO DE IMAGEN EN PDF
========================================= */

function calcularTamanoImagenPDF(
    anchoOriginal,
    altoOriginal,
    anchoMaximo,
    altoMaximo
) {
    const proporcion =
        anchoOriginal /
        altoOriginal;

    let ancho = anchoMaximo;

    let alto =
        ancho /
        proporcion;

    if (alto > altoMaximo) {
        alto = altoMaximo;

        ancho =
            alto *
            proporcion;
    }

    return {
        ancho,
        alto
    };
}

/* =========================================
   OBTENER FIGURAS DIBUJADAS
========================================= */

function obtenerFigurasDibujadas() {
    return poligonosDibujados.getLayers();
}

/* =========================================
   AGREGAR COORDENADAS A LOS LÍMITES
========================================= */

function agregarCoordenadasALimites(
    coordenadas,
    limites
) {
    if (!coordenadas) {
        return;
    }

    /*
     * Si es una coordenada directa de Leaflet.
     */
    if (
        coordenadas instanceof L.LatLng
    ) {
        limites.extend(
            coordenadas
        );

        return;
    }

    /*
     * Respaldo por si la coordenada no fue
     * creada directamente como L.LatLng.
     */
    if (
        typeof coordenadas === "object" &&
        typeof coordenadas.lat === "number" &&
        typeof coordenadas.lng === "number"
    ) {
        limites.extend(
            L.latLng(
                coordenadas.lat,
                coordenadas.lng
            )
        );

        return;
    }

    /*
     * Leaflet puede guardar los puntos en
     * varios niveles de arreglos.
     *
     * Por eso se recorren recursivamente.
     */
    if (Array.isArray(coordenadas)) {
        coordenadas.forEach(
            (coordenada) => {
                agregarCoordenadasALimites(
                    coordenada,
                    limites
                );
            }
        );
    }
}

/* =========================================
   OBTENER LÍMITES DE TODAS LAS FIGURAS
========================================= */

function obtenerLimitesTodasLasFiguras() {
    const figuras =
        obtenerFigurasDibujadas();

    if (figuras.length === 0) {
        throw new Error(
            "No hay figuras dibujadas."
        );
    }

    const limitesGenerales =
        L.latLngBounds([]);

    figuras.forEach((figura) => {
        if (!figura) {
            return;
        }

        /*
         * Obtener todos los vértices del
         * polígono.
         */
        if (
            typeof figura.getLatLngs ===
            "function"
        ) {
            const coordenadasFigura =
                figura.getLatLngs();

            agregarCoordenadasALimites(
                coordenadasFigura,
                limitesGenerales
            );

            return;
        }

        /*
         * Respaldo para otras capas Leaflet.
         */
        if (
            typeof figura.getBounds ===
            "function"
        ) {
            const limitesFigura =
                figura.getBounds();

            if (
                limitesFigura &&
                limitesFigura.isValid()
            ) {
                limitesGenerales.extend(
                    limitesFigura
                );
            }
        }
    });

    if (!limitesGenerales.isValid()) {
        throw new Error(
            "No fue posible calcular los límites de todas las figuras dibujadas."
        );
    }

    return limitesGenerales;
}

/* =========================================
   AJUSTAR MAPA A TODAS LAS FIGURAS
========================================= */

async function ajustarMapaATodasLasFiguras(
    limites
) {
    if (
        !limites ||
        !limites.isValid()
    ) {
        throw new Error(
            "Los límites de las figuras no son válidos."
        );
    }

    /*
     * Detener cualquier movimiento anterior.
     */
    map.stop();

    /*
     * Actualizar el tamaño antes de calcular
     * el zoom.
     */
    map.invalidateSize({
        animate: false,
        pan: false
    });

    await esperar(200);

    const padding =
        esDispositivoMovil()
            ? L.point(45, 45)
            : L.point(70, 70);

    /*
     * Calcular el zoom necesario para mostrar
     * todos los polígonos.
     */
    let zoomCalculado =
        map.getBoundsZoom(
            limites,
            false,
            padding
        );

    /*
     * Evitar un zoom demasiado cercano.
     */
    zoomCalculado =
        Math.min(
            zoomCalculado,
            18
        );

    /*
     * Dejar un nivel adicional de margen.
     */
    if (
        zoomCalculado >
        map.getMinZoom()
    ) {
        zoomCalculado -= 1;
    }

    const centroGeneral =
        limites.getCenter();

    /*
     * Aplicar el centro y el zoom calculado.
     */
    map.setView(
        centroGeneral,
        zoomCalculado,
        {
            animate: false
        }
    );

    map.invalidateSize({
        animate: false,
        pan: false
    });

    await esperarMovimientoMapa();
    await esperarCargaMapa();

    return zoomCalculado;
}

/* =========================================
   OBTENER COORDENADAS DEL CONJUNTO
========================================= */

function obtenerCoordenadasConjunto(
    limites,
    zoom
) {
    if (
        !limites ||
        !limites.isValid()
    ) {
        throw new Error(
            "Los límites de las figuras no son válidos."
        );
    }

    const centro =
        limites.getCenter();

    return {
        x: centro.lng,
        y: centro.lat,
        z: zoom
    };
}

/* =========================================
   CREAR NOMBRE DE ARCHIVO
========================================= */

function crearNombreArchivo(texto) {
    return String(texto)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );
}

/* =========================================
   POPUPS
========================================= */

function mostrarAtributos(
    feature,
    layer
) {
    const propiedades =
        feature.properties || {};

    let contenido =
        "<h3>Información de la vereda</h3>";

    Object.entries(propiedades).forEach(
        ([campo, valor]) => {
            if (
                valor !== null &&
                valor !== undefined &&
                valor !== ""
            ) {
                contenido += `
                    <strong>
                        ${escaparHTML(campo)}:
                    </strong>

                    ${escaparHTML(valor)}
                    <br>
                `;
            }
        }
    );

    layer.bindPopup(
        contenido,
        {
            maxWidth: 320,
            maxHeight: 260
        }
    );
}

/* =========================================
   VEREDAS
========================================= */

const capaVeredas = L.geoJSON(
    null,
    {
        style: function (feature) {
            const propiedades =
                feature.properties || {};

            const nombre =
                propiedades.NOMBRE_VER ||
                "Sin nombre";

            const color =
                obtenerColor(nombre);

            return {
                color: color,

                weight:
                    esDispositivoMovil()
                        ? 1.5
                        : 2,

                opacity: 0.9,
                fillColor: color,
                fillOpacity: 0.22
            };
        },

        onEachFeature: function (
            feature,
            layer
        ) {
            const propiedades =
                feature.properties || {};

            const nombre =
                propiedades.NOMBRE_VER ||
                "Sin nombre";

            layer.bindTooltip(
                escaparHTML(nombre),
                {
                    permanent: true,
                    direction: "center",
                    className:
                        "label-vereda"
                }
            );

            mostrarAtributos(
                feature,
                layer
            );

            layer.on(
                "mouseover",
                function () {
                    if (
                        esDispositivoMovil() ||
                        modoDibujoOEdicionActivo
                    ) {
                        return;
                    }

                    layer.setStyle({
                        weight: 4,
                        opacity: 1,
                        fillOpacity: 0.38
                    });

                    layer.bringToFront();
                }
            );

            layer.on(
                "mouseout",
                function () {
                    if (
                        esDispositivoMovil() ||
                        modoDibujoOEdicionActivo
                    ) {
                        return;
                    }

                    capaVeredas.resetStyle(
                        layer
                    );
                }
            );
        }
    }
);

/* =========================================
   POLÍGONOS DIBUJADOS
========================================= */

const poligonosDibujados =
    new L.FeatureGroup();

poligonosDibujados.addTo(map);

/* =========================================
   CONTROL DE DIBUJO
========================================= */

const controlDibujo =
    new L.Control.Draw({
        position: "topleft",

        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true,
                metric: true,

                shapeOptions: {
                    color: "#ff0000",
                    weight: 3,
                    opacity: 1,
                    fillColor: "#ff0000",
                    fillOpacity: 0.25
                }
            },

            rectangle: false,
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false
        },

        edit: {
            featureGroup:
                poligonosDibujados,

            edit: true,
            remove: true
        }
    });

map.addControl(
    controlDibujo
);

/* =========================================
   FLECHAS SIEMPRE VISIBLES
========================================= */

const controlFlechas =
    L.control({
        position: "bottomright"
    });

controlFlechas.onAdd =
    function () {
        const contenedor =
            L.DomUtil.create(
                "div",
                "control-flechas-mapa"
            );

        contenedor.innerHTML = `
            <button
                type="button"
                class="flecha-mapa flecha-arriba"
                aria-label="Mover hacia arriba"
            >
                ▲
            </button>

            <button
                type="button"
                class="flecha-mapa flecha-izquierda"
                aria-label="Mover hacia la izquierda"
            >
                ◀
            </button>

            <div class="centro-flechas">
                ✥
            </div>

            <button
                type="button"
                class="flecha-mapa flecha-derecha"
                aria-label="Mover hacia la derecha"
            >
                ▶
            </button>

            <button
                type="button"
                class="flecha-mapa flecha-abajo"
                aria-label="Mover hacia abajo"
            >
                ▼
            </button>
        `;

        L.DomEvent.disableClickPropagation(
            contenedor
        );

        L.DomEvent.disableScrollPropagation(
            contenedor
        );

        const distancia =
            esDispositivoMovil()
                ? 100
                : 150;

        const movimientos = [
            {
                selector:
                    ".flecha-arriba",
                x: 0,
                y: -distancia
            },

            {
                selector:
                    ".flecha-abajo",
                x: 0,
                y: distancia
            },

            {
                selector:
                    ".flecha-izquierda",
                x: -distancia,
                y: 0
            },

            {
                selector:
                    ".flecha-derecha",
                x: distancia,
                y: 0
            }
        ];

        movimientos.forEach(
            (movimiento) => {
                const boton =
                    contenedor.querySelector(
                        movimiento.selector
                    );

                boton.addEventListener(
                    "click",
                    function (evento) {
                        evento.preventDefault();
                        evento.stopPropagation();

                        map.panBy(
                            [
                                movimiento.x,
                                movimiento.y
                            ],
                            {
                                animate: true,
                                duration: 0.25
                            }
                        );
                    }
                );
            }
        );

        return contenedor;
    };

controlFlechas.addTo(map);

/* =========================================
   MENSAJE DE MODO
========================================= */

const controlMensajeModo =
    L.control({
        position: "bottomleft"
    });

controlMensajeModo.onAdd =
    function () {
        const elemento =
            L.DomUtil.create(
                "div",
                "mensaje-modo-mapa"
            );

        elemento.textContent =
            "Usa las flechas para mover el mapa mientras dibujas o editas.";

        L.DomEvent.disableClickPropagation(
            elemento
        );

        return elemento;
    };

controlMensajeModo.addTo(map);

const elementoMensajeModo =
    document.querySelector(
        ".mensaje-modo-mapa"
    );

/* =========================================
   ACTIVAR MODO DE DIBUJO O EDICIÓN
========================================= */

function activarModoDibujoEdicion() {
    modoDibujoOEdicionActivo = true;

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    if (elementoMensajeModo) {
        elementoMensajeModo.style.display =
            "block";
    }
}

function desactivarModoDibujoEdicion() {
    modoDibujoOEdicionActivo = false;

    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();

    if (elementoMensajeModo) {
        elementoMensajeModo.style.display =
            "none";
    }
}

map.on(
    L.Draw.Event.DRAWSTART,
    activarModoDibujoEdicion
);

map.on(
    L.Draw.Event.DRAWSTOP,
    desactivarModoDibujoEdicion
);

map.on(
    L.Draw.Event.EDITSTART,
    activarModoDibujoEdicion
);

map.on(
    L.Draw.Event.EDITSTOP,
    desactivarModoDibujoEdicion
);

map.on(
    L.Draw.Event.DELETESTART,
    activarModoDibujoEdicion
);

map.on(
    L.Draw.Event.DELETESTOP,
    desactivarModoDibujoEdicion
);

/* =========================================
   EVENTOS DE POLÍGONOS
========================================= */

map.on(
    L.Draw.Event.CREATED,
    function (evento) {
        const layer =
            evento.layer;

        poligonosDibujados.addLayer(
            layer
        );

        const numeroFigura =
            poligonosDibujados
                .getLayers()
                .length;

        layer.bindPopup(`
            <strong>
                Figura ${numeroFigura}
            </strong>

            <br>

            Esta figura será incluida en el PDF junto con las demás figuras dibujadas.
        `);

        layer.openPopup();
    }
);

map.on(
    L.Draw.Event.EDITED,
    function () {
        /*
         * Todas las figuras editadas permanecen
         * dentro de poligonosDibujados.
         */
    }
);

map.on(
    L.Draw.Event.DELETED,
    function () {
        /*
         * Leaflet elimina automáticamente las
         * figuras del grupo.
         */
    }
);

/* =========================================
   FONDO GRIS
========================================= */

fetch(
    "geosons/BG_veredas.geojson"
)
    .then((respuesta) => {
        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cargar BG_veredas.geojson."
            );
        }

        return respuesta.json();
    })
    .then((datos) => {
        fondoVeredas = L.geoJSON(
            datos,
            {
                style: {
                    color: "#666666",
                    weight: 1,
                    opacity: 0.62,
                    fillColor: "#9e9e9e",
                    fillOpacity: 0.4
                },

                interactive: false
            }
        ).addTo(map);

        fondoVeredas.bringToBack();
    })
    .catch((error) => {
        console.error(
            "Error cargando el fondo:",
            error
        );
    });

/* =========================================
   CARGAR VEREDAS
========================================= */

fetch(
    "geosons/Veredas.geojson"
)
    .then((respuesta) => {
        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cargar Veredas.geojson."
            );
        }

        return respuesta.json();
    })
    .then((datos) => {
        capaVeredas.addData(
            datos
        );

        capaVeredas.addTo(
            map
        );

        const limites =
            capaVeredas.getBounds();

        if (limites.isValid()) {
            map.fitBounds(
                limites,
                {
                    padding:
                        esDispositivoMovil()
                            ? [10, 10]
                            : [20, 20],

                    maxZoom: 15,
                    animate: false
                }
            );
        }

        if (fondoVeredas) {
            fondoVeredas.bringToBack();
        }
    })
    .catch((error) => {
        console.error(
            "Error cargando veredas:",
            error
        );
    });

/* =========================================
   CONTROL DE CAPAS
========================================= */

L.control.layers(
    {
        "Imagen satelital":
            mapaSatelital,

        "Mapa de calles":
            mapaCalles
    },

    {
        "Veredas":
            capaVeredas,

        "Polígonos dibujados":
            poligonosDibujados
    },

    {
        collapsed:
            esDispositivoMovil(),

        position: "topright"
    }
).addTo(map);

/* =========================================
   ESCALA
========================================= */

L.control.scale({
    metric: true,
    imperial: false,
    position: "bottomleft"
}).addTo(map);

/* =========================================
   TAMAÑO DEL MAPA
========================================= */

function ajustarTamanoMapa() {
    window.setTimeout(
        function () {
            map.invalidateSize({
                animate: false
            });
        },
        150
    );
}

window.addEventListener(
    "load",
    ajustarTamanoMapa
);

window.addEventListener(
    "resize",
    ajustarTamanoMapa
);

window.addEventListener(
    "orientationchange",
    ajustarTamanoMapa
);

/* =========================================
   BOTÓN DESCARGAR PDF
========================================= */

const botonDescargarPDF =
    document.getElementById(
        "descargar_mapa_pdf"
    );

if (botonDescargarPDF) {
    botonDescargarPDF.addEventListener(
        "click",
        descargarMapaPDF
    );
}

/* =========================================
   DESCARGAR PDF
========================================= */

async function descargarMapaPDF() {
    const figurasDibujadas =
        obtenerFigurasDibujadas();

    if (figurasDibujadas.length === 0) {
        alert(
            "Primero debes dibujar al menos una figura."
        );

        return;
    }

    let limitesTodasLasFiguras;

    try {
        /*
         * Calcular los límites utilizando todos
         * los vértices de todos los polígonos.
         */
        limitesTodasLasFiguras =
            obtenerLimitesTodasLasFiguras();

        /*
         * Cerrar cualquier popup abierto.
         */
        map.closePopup();

        /*
         * Ajustar el mapa inmediatamente para
         * mostrar todos los polígonos.
         */
        await ajustarMapaATodasLasFiguras(
            limitesTodasLasFiguras
        );
    } catch (error) {
        console.error(
            "Error ajustando el mapa:",
            error
        );

        alert(
            error.message ||
            "No fue posible mostrar todas las figuras."
        );

        return;
    }

    /*
     * Pedir los datos después de hacer zoom.
     */
    const nombreUsuario =
        window.prompt(
            "Ingrese su nombre completo:"
        );

    if (
        nombreUsuario === null ||
        nombreUsuario.trim() === ""
    ) {
        return;
    }

    const celularUsuario =
        window.prompt(
            "Ingrese su número de celular:"
        );

    if (
        celularUsuario === null ||
        celularUsuario.trim() === ""
    ) {
        return;
    }

    const nombreVereda =
        window.prompt(
            "Ingrese el nombre de la vereda:"
        );

    if (
        nombreVereda === null ||
        nombreVereda.trim() === ""
    ) {
        return;
    }

    const textoBoton =
        botonDescargarPDF.querySelector(
            ".texto-boton"
        );

    const textoOriginal =
        textoBoton
            ? textoBoton.textContent
            : "";

    botonDescargarPDF.disabled =
        true;

    if (textoBoton) {
        textoBoton.textContent =
            "Generando...";
    }

    try {
        if (
            typeof html2canvas ===
            "undefined"
        ) {
            throw new Error(
                "html2canvas no está disponible."
            );
        }

        if (
            !window.jspdf ||
            !window.jspdf.jsPDF
        ) {
            throw new Error(
                "jsPDF no está disponible."
            );
        }

        /*
         * Volver a ajustar el mapa justo antes
         * de capturarlo.
         */
        const zoomImpresion =
            await ajustarMapaATodasLasFiguras(
                limitesTodasLasFiguras
            );

        /*
         * Poner los polígonos dibujados encima
         * de las capas de las veredas.
         */
        poligonosDibujados.eachLayer(
            (figura) => {
                if (
                    typeof figura.bringToFront ===
                    "function"
                ) {
                    figura.bringToFront();
                }
            }
        );

        await esperar(300);
        await esperarCargaMapa();

        const coordenadas =
            obtenerCoordenadasConjunto(
                limitesTodasLasFiguras,
                zoomImpresion
            );

        const elementoMapa =
            document.getElementById(
                "map"
            );

        if (!elementoMapa) {
            throw new Error(
                "No se encontró el elemento del mapa."
            );
        }

        /*
         * Capturar el mapa con todos los
         * polígonos visibles.
         */
        const canvas =
            await html2canvas(
                elementoMapa,
                {
                    useCORS: true,
                    allowTaint: false,

                    scale:
                        esDispositivoMovil()
                            ? 1.25
                            : 2,

                    backgroundColor:
                        "#ffffff",

                    logging: false,
                    imageTimeout: 20000,

                    ignoreElements:
                        function (elemento) {
                            return (
                                elemento.classList &&
                                elemento.classList
                                    .contains(
                                        "leaflet-control-container"
                                    )
                            );
                        }
                }
            );

        const imagen =
            canvas.toDataURL(
                "image/jpeg",
                0.94
            );

        const {
            jsPDF
        } = window.jspdf;

        const pdf =
            new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
                compress: true
            });

        const anchoPagina =
            pdf.internal.pageSize
                .getWidth();

        const altoPagina =
            pdf.internal.pageSize
                .getHeight();

        const margen = 10;
        const altoEncabezado = 22;
        const altoInformacion = 45;

        const tamanoImagen =
            calcularTamanoImagenPDF(
                canvas.width,
                canvas.height,

                anchoPagina -
                    margen * 2,

                altoPagina -
                    altoEncabezado -
                    altoInformacion -
                    margen
            );

        const posicionX =
            (
                anchoPagina -
                tamanoImagen.ancho
            ) / 2;

        const posicionY =
            altoEncabezado;

        /* =====================================
           TÍTULO DEL PDF
        ===================================== */

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(16);

        pdf.text(
            figurasDibujadas.length === 1
                ? "Mapa del área dibujada"
                : "Mapa de las áreas dibujadas",
            margen,
            12
        );

        /* =====================================
           INFORMACIÓN DEL ENCABEZADO
        ===================================== */

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(9);

        pdf.text(
            `Vereda: ${nombreVereda.trim()}`,
            margen,
            18
        );

        pdf.text(
            `Figuras incluidas: ${figurasDibujadas.length}`,
            110,
            18
        );

        /* =====================================
           IMAGEN DEL MAPA
        ===================================== */

        pdf.addImage(
            imagen,
            "JPEG",
            posicionX,
            posicionY,
            tamanoImagen.ancho,
            tamanoImagen.alto,
            undefined,
            "FAST"
        );

        const posicionDatos =
            altoPagina -
            altoInformacion +
            5;

        /* =====================================
           INFORMACIÓN DEL SOLICITANTE
        ===================================== */

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(11);

        pdf.text(
            "Información del solicitante",
            margen,
            posicionDatos
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(9.5);

        pdf.text(
            `Nombre: ${nombreUsuario.trim()}`,
            margen,
            posicionDatos + 7
        );

        pdf.text(
            `Celular: ${celularUsuario.trim()}`,
            margen,
            posicionDatos + 14
        );

        pdf.text(
            `Vereda: ${nombreVereda.trim()}`,
            margen,
            posicionDatos + 21
        );

        pdf.text(
            `Cantidad de figuras: ${figurasDibujadas.length}`,
            margen,
            posicionDatos + 28
        );

        /* =====================================
           CENTRO GENERAL
        ===================================== */

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.text(
            "Centro general de las áreas",
            105,
            posicionDatos
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.text(
            `X - Longitud: ${coordenadas.x.toFixed(8)}`,
            105,
            posicionDatos + 7
        );

        pdf.text(
            `Y - Latitud: ${coordenadas.y.toFixed(8)}`,
            105,
            posicionDatos + 14
        );

        pdf.text(
            `Z - Zoom de impresión: ${zoomImpresion}`,
            105,
            posicionDatos + 21
        );

        /* =====================================
           FECHA Y SISTEMA
        ===================================== */

        const fecha =
            new Date().toLocaleString(
                "es-CO"
            );

        pdf.text(
            `Fecha: ${fecha}`,
            205,
            posicionDatos + 7
        );

        pdf.text(
            "Sistema: WGS 84",
            205,
            posicionDatos + 14
        );

        pdf.text(
            "Código: EPSG:4326",
            205,
            posicionDatos + 21
        );

        /* =====================================
           NOMBRE DEL ARCHIVO
        ===================================== */

        const nombreArchivo =
            `areas-${
                crearNombreArchivo(
                    nombreVereda
                ) || "vereda"
            }.pdf`;

        const pdfBlob =
            pdf.output("blob");

        /* =====================================
           PREPARAR FORMULARIO
        ===================================== */

        const formulario =
            new FormData();

        formulario.append(
            "pdf",
            pdfBlob,
            nombreArchivo
        );

        formulario.append(
            "nombre",
            nombreUsuario.trim()
        );

        formulario.append(
            "celular",
            celularUsuario.trim()
        );

        formulario.append(
            "vereda",
            nombreVereda.trim()
        );

        formulario.append(
            "coordenada_x",
            coordenadas.x.toFixed(8)
        );

        formulario.append(
            "coordenada_y",
            coordenadas.y.toFixed(8)
        );

        formulario.append(
            "coordenada_z",
            String(zoomImpresion)
        );

        formulario.append(
            "cantidad_figuras",
            String(
                figurasDibujadas.length
            )
        );

        /* =====================================
           DESCARGAR PDF
        ===================================== */

        pdf.save(
            nombreArchivo
        );

        /* =====================================
           ENVIAR PDF AL CORREO
        ===================================== */

        try {
            if (textoBoton) {
                textoBoton.textContent =
                    "Enviando...";
            }

            const respuesta =
                await fetch(
                    "send_email.php",
                    {
                        method: "POST",
                        body: formulario
                    }
                );

            const textoRespuesta =
                await respuesta.text();

            let resultado;

            try {
                resultado =
                    JSON.parse(
                        textoRespuesta
                    );
            } catch (errorJSON) {
                console.error(
                    "Respuesta del servidor:",
                    textoRespuesta
                );

                throw new Error(
                    "El servidor no devolvió una respuesta JSON válida."
                );
            }

            if (
                !respuesta.ok ||
                !resultado.ok
            ) {
                throw new Error(
                    resultado.mensaje ||
                    "No se pudo enviar el correo."
                );
            }

            alert(
                figurasDibujadas.length === 1
                    ? "La figura fue incluida en el PDF. El archivo fue descargado y enviado correctamente."
                    : `Las ${figurasDibujadas.length} figuras fueron incluidas en el PDF. El archivo fue descargado y enviado correctamente.`
            );
        } catch (errorCorreo) {
            console.error(
                "Error enviando PDF:",
                errorCorreo
            );

            alert(
                "El PDF se descargó con todas las figuras, pero no se pudo enviar por correo."
            );
        }
    } catch (error) {
        console.error(
            "Error generando PDF:",
            error
        );

        alert(
            error.message ||
            "No fue posible generar el PDF."
        );
    } finally {
        /*
         * Mantener el mapa mostrando todos
         * los polígonos.
         *
         * No regresar al zoom anterior.
         */
        try {
            await ajustarMapaATodasLasFiguras(
                limitesTodasLasFiguras
            );
        } catch (errorAjuste) {
            console.error(
                "No se pudo conservar el zoom:",
                errorAjuste
            );
        }

        botonDescargarPDF.disabled =
            false;

        if (textoBoton) {
            textoBoton.textContent =
                textoOriginal;
        }
    }
}
