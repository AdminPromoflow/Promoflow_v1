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

    /*
     * Evita clics táctiles fantasma
     * en algunos navegadores móviles.
     */
    tap: false
}).setView(
    [4.270625797339428, -74.41654400019608],
    13
);

/* =========================================
   MAPAS BASE
========================================= */

// Mapa de calles
const mapaCalles = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap",
        crossOrigin: "anonymous"
    }
);

// Imagen satelital activa por defecto
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
   VARIABLES GENERALES
========================================= */

let fondoVeredas = null;
let limitesCompletosVeredas = null;
let ultimaAreaDibujada = null;

/* =========================================
   COLORES DE LAS VEREDAS
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
    const texto = String(nombre || "Sin nombre");

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

/*
 * Espera a que Leaflet termine de ajustar
 * el mapa y las imágenes estén cargadas.
 */
async function esperarCargaMapa() {
    await esperar(700);

    const imagenesMapa = Array.from(
        document.querySelectorAll(
            "#map .leaflet-tile"
        )
    );

    const imagenesPendientes =
        imagenesMapa.filter((imagen) => {
            return !imagen.complete;
        });

    if (imagenesPendientes.length > 0) {
        await Promise.all(
            imagenesPendientes.map(
                (imagen) => {
                    return new Promise(
                        (resolve) => {
                            let terminado = false;

                            const terminar = () => {
                                if (terminado) {
                                    return;
                                }

                                terminado = true;
                                resolve();
                            };

                            imagen.addEventListener(
                                "load",
                                terminar,
                                {
                                    once: true
                                }
                            );

                            imagen.addEventListener(
                                "error",
                                terminar,
                                {
                                    once: true
                                }
                            );

                            window.setTimeout(
                                terminar,
                                5000
                            );
                        }
                    );
                }
            )
        );
    }

    await esperar(
        esDispositivoMovil()
            ? 900
            : 500
    );
}

/*
 * Espera a que termine un movimiento
 * o cambio de zoom del mapa.
 */
function esperarMovimientoMapa(
    tiempoMaximo = 1800
) {
    return new Promise((resolve) => {
        let terminado = false;

        const finalizar = () => {
            if (terminado) {
                return;
            }

            terminado = true;

            map.off(
                "moveend",
                finalizar
            );

            resolve();
        };

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

/*
 * Ajustar una imagen al espacio disponible
 * del PDF sin deformarla.
 */
function calcularTamanoImagenPDF(
    anchoOriginal,
    altoOriginal,
    anchoMaximo,
    altoMaximo
) {
    const proporcion =
        anchoOriginal / altoOriginal;

    let ancho = anchoMaximo;
    let alto = ancho / proporcion;

    if (alto > altoMaximo) {
        alto = altoMaximo;
        ancho = alto * proporcion;
    }

    return {
        ancho,
        alto
    };
}

/*
 * Obtener las coordenadas del centro
 * del área dibujada.
 *
 * X = longitud
 * Y = latitud
 * Z = zoom de Leaflet
 */
function obtenerCoordenadasXYZ(
    layer,
    zoom
) {
    if (
        !layer ||
        typeof layer.getBounds !== "function"
    ) {
        throw new Error(
            "El área dibujada no tiene límites válidos."
        );
    }

    const limites = layer.getBounds();

    if (!limites.isValid()) {
        throw new Error(
            "Los límites del área dibujada no son válidos."
        );
    }

    const centro = limites.getCenter();

    return {
        x: centro.lng,
        y: centro.lat,
        z: zoom
    };
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

    let contenido = `
        <h3>Información de la vereda</h3>
    `;

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
   CAPA DE VEREDAS
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
                        esDispositivoMovil()
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
                        esDispositivoMovil()
                    ) {
                        return;
                    }

                    capaVeredas.resetStyle(
                        layer
                    );
                }
            );

            layer.on(
                "click",
                function () {
                    if (
                        !esDispositivoMovil()
                    ) {
                        return;
                    }

                    capaVeredas.resetStyle();

                    layer.setStyle({
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 0.38
                    });

                    layer.bringToFront();
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
   PARCHE MULTITÁCTIL PARA LEAFLET DRAW
========================================= */

/*
 * Leaflet Draw normalmente interpreta
 * un touchstart con dos dedos como un
 * nuevo vértice del polígono.
 *
 * Este parche permite dibujar únicamente
 * cuando existe exactamente un dedo.
 */
if (
    window.L &&
    L.Draw &&
    L.Draw.Polyline &&
    L.Draw.Polyline.prototype &&
    typeof L.Draw.Polyline.prototype._onTouch ===
        "function"
) {
    const funcionTouchOriginal =
        L.Draw.Polyline.prototype._onTouch;

    L.Draw.Polyline.prototype._onTouch =
        function (evento) {
            const eventoOriginal =
                evento.originalEvent ||
                evento;

            const cantidadDedos =
                eventoOriginal.touches
                    ? eventoOriginal.touches.length
                    : 0;

            /*
             * Solo un dedo puede agregar
             * un vértice al polígono.
             */
            if (cantidadDedos !== 1) {
                this._clickHandled = null;
                this._touchHandled = null;

                return;
            }

            return funcionTouchOriginal.call(
                this,
                evento
            );
        };
}

/*
 * Parche adicional para rectángulos.
 * Si se detectan dos dedos mientras se
 * comienza a dibujar un rectángulo,
 * Leaflet Draw ignora ese gesto.
 */
if (
    window.L &&
    L.Draw &&
    L.Draw.SimpleShape &&
    L.Draw.SimpleShape.prototype &&
    typeof L.Draw.SimpleShape.prototype
        ._onMouseDown === "function"
) {
    const mouseDownOriginal =
        L.Draw.SimpleShape.prototype
            ._onMouseDown;

    L.Draw.SimpleShape.prototype
        ._onMouseDown =
        function (evento) {
            const eventoOriginal =
                evento.originalEvent ||
                evento;

            const cantidadDedos =
                eventoOriginal.touches
                    ? eventoOriginal.touches.length
                    : 0;

            if (cantidadDedos >= 2) {
                this._isDrawing = false;
                return;
            }

            return mouseDownOriginal.call(
                this,
                evento
            );
        };
}

/* =========================================
   PROTECCIÓN ADICIONAL MULTITÁCTIL
========================================= */

const contenedorMapa =
    map.getContainer();

let gestoMultitactilActivo = false;
let bloquearEventosHasta = 0;

function activarBloqueoMultitactil() {
    gestoMultitactilActivo = true;

    bloquearEventosHasta =
        Date.now() + 900;
}

contenedorMapa.addEventListener(
    "touchstart",
    function (evento) {
        if (evento.touches.length >= 2) {
            activarBloqueoMultitactil();
        }
    },
    {
        passive: true,
        capture: true
    }
);

contenedorMapa.addEventListener(
    "touchmove",
    function (evento) {
        if (evento.touches.length >= 2) {
            activarBloqueoMultitactil();
        }
    },
    {
        passive: true,
        capture: true
    }
);

contenedorMapa.addEventListener(
    "touchend",
    function (evento) {
        if (!gestoMultitactilActivo) {
            return;
        }

        bloquearEventosHasta =
            Date.now() + 900;

        if (evento.touches.length === 0) {
            window.setTimeout(
                function () {
                    gestoMultitactilActivo =
                        false;
                },
                900
            );
        }
    },
    {
        passive: true,
        capture: true
    }
);

contenedorMapa.addEventListener(
    "touchcancel",
    function () {
        bloquearEventosHasta =
            Date.now() + 900;

        window.setTimeout(
            function () {
                gestoMultitactilActivo =
                    false;
            },
            900
        );
    },
    {
        passive: true,
        capture: true
    }
);

function bloquearClicFantasma(evento) {
    if (
        gestoMultitactilActivo ||
        Date.now() < bloquearEventosHasta
    ) {
        evento.preventDefault();
        evento.stopPropagation();
        evento.stopImmediatePropagation();
    }
}

contenedorMapa.addEventListener(
    "click",
    bloquearClicFantasma,
    true
);

contenedorMapa.addEventListener(
    "dblclick",
    bloquearClicFantasma,
    true
);

contenedorMapa.addEventListener(
    "contextmenu",
    bloquearClicFantasma,
    true
);

/* =========================================
   HERRAMIENTAS DE DIBUJO
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

            rectangle: {
                showArea: true,
                metric: true,

                shapeOptions: {
                    color: "#0066ff",
                    weight: 3,
                    opacity: 1,
                    fillColor: "#0066ff",
                    fillOpacity: 0.25
                }
            },

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

map.addControl(controlDibujo);

/* =========================================
   EVENTOS DE DIBUJO
========================================= */

map.on(
    L.Draw.Event.CREATED,
    function (evento) {
        const layer = evento.layer;

        /*
         * Evitar guardar una geometría
         * creada accidentalmente durante
         * un gesto con dos dedos.
         */
        if (
            gestoMultitactilActivo ||
            Date.now() < bloquearEventosHasta
        ) {
            return;
        }

        poligonosDibujados.addLayer(
            layer
        );

        ultimaAreaDibujada = layer;

        layer.bindPopup(`
            <strong>
                Área dibujada
            </strong>
            <br>
            Esta área será exportada al PDF.
            Puedes editarla o eliminarla
            usando las herramientas del mapa.
        `);

        console.log(
            "Polígono creado:",
            layer.toGeoJSON()
        );

        layer.openPopup();
    }
);

map.on(
    L.Draw.Event.EDITED,
    function (evento) {
        evento.layers.eachLayer(
            function (layer) {
                ultimaAreaDibujada =
                    layer;

                console.log(
                    "Polígono editado:",
                    layer.toGeoJSON()
                );
            }
        );
    }
);

map.on(
    L.Draw.Event.DELETED,
    function (evento) {
        let seEliminoUltimaArea =
            false;

        evento.layers.eachLayer(
            function (
                layerEliminado
            ) {
                if (
                    layerEliminado ===
                    ultimaAreaDibujada
                ) {
                    seEliminoUltimaArea =
                        true;
                }
            }
        );

        if (seEliminoUltimaArea) {
            const capasRestantes =
                poligonosDibujados
                    .getLayers();

            ultimaAreaDibujada =
                capasRestantes.length > 0
                    ? capasRestantes[
                        capasRestantes.length -
                            1
                    ]
                    : null;
        }

        console.log(
            "Se eliminó uno o más polígonos."
        );
    }
);

/* =========================================
   CARGAR FONDO GRIS
========================================= */

fetch(
    "geosons/BG_veredas.geojson"
)
    .then((response) => {
        if (!response.ok) {
            throw new Error(
                "No se pudo cargar " +
                    "BG_veredas.geojson. " +
                    `Código: ${response.status}`
            );
        }

        return response.json();
    })
    .then((data) => {
        fondoVeredas = L.geoJSON(
            data,
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
            "Error cargando el fondo gris:",
            error
        );
    });

/* =========================================
   CARGAR VEREDAS DE ARBELÁEZ
========================================= */

fetch(
    "geosons/Veredas.geojson"
)
    .then((respuesta) => {
        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cargar " +
                    "Veredas.geojson. " +
                    `Código: ${respuesta.status}`
            );
        }

        return respuesta.json();
    })
    .then((datos) => {
        capaVeredas.addData(datos);
        capaVeredas.addTo(map);

        limitesCompletosVeredas =
            capaVeredas.getBounds();

        if (
            limitesCompletosVeredas.isValid()
        ) {
            map.fitBounds(
                limitesCompletosVeredas,
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
            "Error cargando las veredas:",
            error
        );
    });

/* =========================================
   SELECTOR DE CAPAS
========================================= */

const mapasBase = {
    "Imagen satelital":
        mapaSatelital,

    "Mapa de calles":
        mapaCalles
};

const capasSuperpuestas = {
    "Veredas":
        capaVeredas,

    "Polígonos dibujados":
        poligonosDibujados
};

L.control.layers(
    mapasBase,
    capasSuperpuestas,
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
   AJUSTAR MAPA A LA PANTALLA
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
    function () {
        window.setTimeout(
            ajustarTamanoMapa,
            300
        );
    }
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
} else {
    console.error(
        "No se encontró el botón " +
            "descargar_mapa_pdf."
    );
}

/* =========================================
   DESCARGAR ÁREA DIBUJADA EN PDF
========================================= */

async function descargarMapaPDF() {
    /*
     * Comprobar el área antes de pedir
     * los datos del usuario.
     */
    if (!ultimaAreaDibujada) {
        alert(
            "Primero debes dibujar o modificar un área."
        );

        return;
    }

    if (
        !poligonosDibujados.hasLayer(
            ultimaAreaDibujada
        )
    ) {
        ultimaAreaDibujada = null;

        alert(
            "El área seleccionada fue eliminada."
        );

        return;
    }

    const nombreUsuario = window.prompt(
        "Ingrese su nombre completo:"
    );

    if (
        nombreUsuario === null ||
        nombreUsuario.trim() === ""
    ) {
        alert(
            "Debes ingresar tu nombre."
        );

        return;
    }

    const celularUsuario = window.prompt(
        "Ingrese su número de celular:"
    );

    if (
        celularUsuario === null ||
        celularUsuario.trim() === ""
    ) {
        alert(
            "Debes ingresar tu número de celular."
        );

        return;
    }

    const nombreVereda = window.prompt(
        "Ingrese el nombre de la vereda:"
    );

    if (
        nombreVereda === null ||
        nombreVereda.trim() === ""
    ) {
        alert(
            "Debes ingresar el nombre de la vereda."
        );

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

    const centroAnterior =
        map.getCenter();

    const zoomAnterior =
        map.getZoom();

    botonDescargarPDF.disabled = true;

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

        map.closePopup();

        const limitesArea =
            ultimaAreaDibujada.getBounds();

        if (!limitesArea.isValid()) {
            throw new Error(
                "El área dibujada no tiene límites válidos."
            );
        }

        map.fitBounds(
            limitesArea,
            {
                padding:
                    esDispositivoMovil()
                        ? [35, 35]
                        : [55, 55],

                maxZoom: 18,
                animate: false
            }
        );

        map.invalidateSize({
            animate: false
        });

        await esperarMovimientoMapa();
        await esperarCargaMapa();

        const coordenadas =
            obtenerCoordenadasXYZ(
                ultimaAreaDibujada,
                map.getZoom()
            );

        const elementoMapa =
            document.getElementById(
                "map"
            );

        if (!elementoMapa) {
            throw new Error(
                "No se encontró el contenedor del mapa."
            );
        }

        const escalaCaptura =
            esDispositivoMovil()
                ? 1.25
                : 2;

        const canvas =
            await html2canvas(
                elementoMapa,
                {
                    useCORS: true,
                    allowTaint: false,
                    scale: escalaCaptura,
                    backgroundColor:
                        "#ffffff",
                    logging: false,
                    imageTimeout: 20000,

                    ignoreElements:
                        function (
                            elemento
                        ) {
                            return (
                                elemento.classList &&
                                elemento.classList.contains(
                                    "leaflet-control-container"
                                )
                            );
                        },

                    onclone: function (
                        documentoClonado
                    ) {
                        const mapaClonado =
                            documentoClonado
                                .getElementById(
                                    "map"
                                );

                        if (mapaClonado) {
                            mapaClonado.style
                                .transform =
                                "none";
                        }
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

        const pdf = new jsPDF({
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

        const anchoDisponible =
            anchoPagina -
            margen * 2;

        const altoDisponibleImagen =
            altoPagina -
            altoEncabezado -
            altoInformacion -
            margen;

        const tamanoImagen =
            calcularTamanoImagenPDF(
                canvas.width,
                canvas.height,
                anchoDisponible,
                altoDisponibleImagen
            );

        const posicionX =
            (
                anchoPagina -
                tamanoImagen.ancho
            ) / 2;

        const posicionY =
            altoEncabezado +
            (
                altoDisponibleImagen -
                tamanoImagen.alto
            ) / 2;

        /* =================================
           TÍTULO
        ================================= */

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(16);

        pdf.text(
            "Mapa del área dibujada",
            margen,
            12
        );

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

        /* =================================
           IMAGEN DEL MAPA
        ================================= */

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

        /* =================================
           INFORMACIÓN INFERIOR
        ================================= */

        const posicionDatos =
            altoPagina -
            altoInformacion +
            5;

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

        const columnaCentro = 105;

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(11);

        pdf.text(
            "Centro del área",
            columnaCentro,
            posicionDatos
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(9.5);

        pdf.text(
            `X - Longitud: ${coordenadas.x.toFixed(8)}`,
            columnaCentro,
            posicionDatos + 7
        );

        pdf.text(
            `Y - Latitud: ${coordenadas.y.toFixed(8)}`,
            columnaCentro,
            posicionDatos + 14
        );

        pdf.text(
            `Z - Zoom: ${coordenadas.z}`,
            columnaCentro,
            posicionDatos + 21
        );

        const columnaDerecha = 205;

        const fecha =
            new Date().toLocaleString(
                "es-CO"
            );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(11);

        pdf.text(
            "Información técnica",
            columnaDerecha,
            posicionDatos
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(8.5);

        pdf.text(
            `Fecha: ${fecha}`,
            columnaDerecha,
            posicionDatos + 7
        );

        pdf.text(
            "Sistema: WGS 84",
            columnaDerecha,
            posicionDatos + 14
        );

        pdf.text(
            "Código: EPSG:4326",
            columnaDerecha,
            posicionDatos + 21
        );

        const nombreArchivo =
            nombreVereda
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

        pdf.save(
            `area-${nombreArchivo || "vereda"}.pdf`
        );
    } catch (error) {
        console.error(
            "Error generando el PDF:",
            error
        );

        alert(
            error.message ||
                "No fue posible generar el PDF."
        );
    } finally {
        map.setView(
            centroAnterior,
            zoomAnterior,
            {
                animate: false
            }
        );

        map.invalidateSize({
            animate: false
        });

        botonDescargarPDF.disabled =
            false;

        if (textoBoton) {
            textoBoton.textContent =
                textoOriginal;
        }
    }
}
