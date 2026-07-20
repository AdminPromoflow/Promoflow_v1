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
            ? 900
            : 500
    );
}

function esperarMovimientoMapa(
    tiempoMaximo = 1800
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
   CALCULAR LÍMITES DE TODAS LAS FIGURAS
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
        if (
            figura &&
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
            "No fue posible calcular los límites de las figuras dibujadas."
        );
    }

    return limitesGenerales;
}

/* =========================================
   OBTENER CENTRO DEL CONJUNTO
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
   LEER RESPUESTA DEL SERVIDOR
========================================= */

async function leerRespuestaJSON(
    respuesta
) {
    const texto =
        await respuesta.text();

    if (texto.trim() === "") {
        throw new Error(
            "El servidor devolvió una respuesta vacía."
        );
    }

    try {
        return JSON.parse(
            texto
        );
    } catch (error) {
        console.error(
            "Respuesta no válida del servidor:",
            texto
        );

        throw new Error(
            "El servidor no devolvió un JSON válido. Revisa los errores del archivo send_email.php."
        );
    }
}

/* =========================================
   ENVIAR PDF POR CORREO
========================================= */

async function enviarPDFPorCorreo(
    pdfBlob,
    nombreArchivo,
    datos
) {
    const formulario =
        new FormData();

    /*
     * Esta acción es la que recibe el switch
     * de handleEmail() en send_email.php.
     */
    formulario.append(
        "action",
        "send_email"
    );

    formulario.append(
        "pdf",
        pdfBlob,
        nombreArchivo
    );

    formulario.append(
        "nombre",
        datos.nombre
    );

    formulario.append(
        "celular",
        datos.celular
    );

    formulario.append(
        "vereda",
        datos.vereda
    );

    formulario.append(
        "coordenada_x",
        datos.coordenadaX
    );

    formulario.append(
        "coordenada_y",
        datos.coordenadaY
    );

    formulario.append(
        "coordenada_z",
        datos.coordenadaZ
    );

    formulario.append(
        "cantidad_figuras",
        datos.cantidadFiguras
    );

    const respuesta =
        await fetch(
            "send_email.php",
            {
                method: "POST",
                body: formulario
            }
        );

    const resultado =
        await leerRespuestaJSON(
            respuesta
        );

    if (
        !respuesta.ok ||
        (
            resultado.ok !== true &&
            resultado.response !== true
        )
    ) {
        throw new Error(
            resultado.mensaje ||
            resultado.error ||
            "No fue posible enviar el PDF por correo."
        );
    }

    return resultado;
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

poligonosDibujados.addTo(
    map
);

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

                if (!boton) {
                    return;
                }

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

controlFlechas.addTo(
    map
);

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

controlMensajeModo.addTo(
    map
);

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
        console.log(
            "Las figuras fueron editadas."
        );
    }
);

map.on(
    L.Draw.Event.DELETED,
    function () {
        console.log(
            "Una o más figuras fueron eliminadas."
        );
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

L.control.scale({
    metric: true,
    imperial: false,
    position: "bottomleft"
}).addTo(map);

/* =========================================
   AJUSTAR TAMAÑO DEL MAPA
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
   BOTÓN DEL PDF
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
   DESCARGAR Y ENVIAR PDF
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

    const centroAnterior =
        map.getCenter();

    const zoomAnterior =
        map.getZoom();

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

        map.closePopup();

        const limitesTodasLasFiguras =
            obtenerLimitesTodasLasFiguras();

        /*
         * Primero se corrige el tamaño del mapa
         * y después se calculan los límites.
         */
        map.invalidateSize({
            animate: false
        });

        const movimientoMapa =
            esperarMovimientoMapa();

        map.fitBounds(
            limitesTodasLasFiguras,
            {
                padding:
                    esDispositivoMovil()
                        ? [40, 40]
                        : [65, 65],

                maxZoom: 18,
                animate: false
            }
        );

        await movimientoMapa;
        await esperarCargaMapa();

        const coordenadas =
            obtenerCoordenadasConjunto(
                limitesTodasLasFiguras,
                map.getZoom()
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
                            return Boolean(
                                elemento.classList &&
                                elemento.classList.contains(
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
                orientation:
                    "landscape",

                unit:
                    "mm",

                format:
                    "a4",

                compress:
                    true
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

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(
            16
        );

        pdf.text(
            figurasDibujadas.length === 1
                ? "Mapa del área dibujada"
                : "Mapa de las áreas dibujadas",

            margen,
            12
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(
            9
        );

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

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(
            11
        );

        pdf.text(
            "Información del solicitante",
            margen,
            posicionDatos
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(
            9.5
        );

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
            `Z - Zoom: ${coordenadas.z}`,
            105,
            posicionDatos + 21
        );

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

        const nombreArchivo =
            `areas-${
                crearNombreArchivo(
                    nombreVereda
                ) || "vereda"
            }.pdf`;

        const pdfBlob =
            pdf.output(
                "blob"
            );

        /*
         * Primero se guarda el PDF en el
         * dispositivo del usuario.
         */
        pdf.save(
            nombreArchivo
        );

        if (textoBoton) {
            textoBoton.textContent =
                "Enviando...";
        }

        const datosCorreo = {
            nombre:
                nombreUsuario.trim(),

            celular:
                celularUsuario.trim(),

            vereda:
                nombreVereda.trim(),

            coordenadaX:
                coordenadas.x.toFixed(8),

            coordenadaY:
                coordenadas.y.toFixed(8),

            coordenadaZ:
                String(
                    coordenadas.z
                ),

            cantidadFiguras:
                String(
                    figurasDibujadas.length
                )
        };

        /*
         * La función crea el FormData,
         * agrega action=send_email y lo
         * envía al PHP.
         */
        const resultadoCorreo =
            await enviarPDFPorCorreo(
                pdfBlob,
                nombreArchivo,
                datosCorreo
            );

        console.log(
            "Correo enviado:",
            resultadoCorreo
        );

        alert(
            figurasDibujadas.length === 1
                ? "La figura fue incluida en el PDF. El archivo fue descargado y enviado correctamente."
                : `Las ${figurasDibujadas.length} figuras fueron incluidas en el PDF. El archivo fue descargado y enviado correctamente.`
        );

    } catch (error) {
        console.error(
            "Error generando o enviando el PDF:",
            error
        );

        alert(
            error.message ||
            "No fue posible generar o enviar el PDF."
        );

    } finally {
        /*
         * El mapa regresa a la posición
         * que tenía antes de generar el PDF.
         */
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
