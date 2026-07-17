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
   ESTILOS GENERADOS DESDE JAVASCRIPT
========================================= */

const estilosAplicacion =
    document.createElement("style");

estilosAplicacion.textContent = `
    .control-flechas-mapa {
        display: none;
        grid-template-areas:
            ". arriba ."
            "izquierda centro derecha"
            ". abajo .";
        grid-template-columns: 48px 48px 48px;
        grid-template-rows: 48px 48px 48px;
        gap: 4px;
        padding: 7px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 9px;
        box-shadow: 0 1px 7px rgba(0, 0, 0, 0.45);
    }

    .flecha-mapa {
        width: 48px;
        height: 48px;
        margin: 0;
        padding: 0;
        border: 1px solid #777;
        border-radius: 7px;
        background: #ffffff;
        color: #222;
        cursor: pointer;
        font-size: 21px;
        font-weight: bold;
        line-height: 48px;
        text-align: center;
        touch-action: manipulation;
        user-select: none;
        -webkit-user-select: none;
    }

    .flecha-mapa:hover {
        background: #eeeeee;
    }

    .flecha-mapa:active {
        background: #d5d5d5;
        transform: scale(0.94);
    }

    .flecha-arriba {
        grid-area: arriba;
    }

    .flecha-abajo {
        grid-area: abajo;
    }

    .flecha-izquierda {
        grid-area: izquierda;
    }

    .flecha-derecha {
        grid-area: derecha;
    }

    .centro-flechas {
        grid-area: centro;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #555;
        font-size: 18px;
        font-weight: bold;
    }

    .mensaje-modo-mapa {
        background: rgba(255, 255, 255, 0.96);
        border-radius: 6px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
        color: #222;
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        max-width: 215px;
        padding: 8px 10px;
        text-align: center;
    }

    @media (max-width: 768px) {
        .control-flechas-mapa {
            grid-template-columns: 54px 54px 54px;
            grid-template-rows: 54px 54px 54px;
            gap: 5px;
        }

        .flecha-mapa {
            width: 54px;
            height: 54px;
            font-size: 25px;
            line-height: 54px;
        }
    }
`;

document.head.appendChild(
    estilosAplicacion
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
let modoDibujoOEdicionActivo = false;

let estadoInteraccionAnterior = {
    dragging: true,
    touchZoom: true,
    doubleClickZoom: true,
    scrollWheelZoom: true,
    boxZoom: true,
    keyboard: true
};

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
    const texto = String(
        nombre || "Sin nombre"
    );

    let numero = 0;

    for (
        let i = 0;
        i < texto.length;
        i++
    ) {
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

                            const finalizar = () => {
                                if (terminado) {
                                    return;
                                }

                                terminado = true;
                                resolve();
                            };

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

function obtenerCoordenadasXYZ(
    layer,
    zoom
) {
    if (
        !layer ||
        typeof layer.getBounds !==
            "function"
    ) {
        throw new Error(
            "El área dibujada no tiene límites válidos."
        );
    }

    const limites =
        layer.getBounds();

    if (!limites.isValid()) {
        throw new Error(
            "Los límites del área dibujada no son válidos."
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

            layer.on(
                "click",
                function () {
                    if (
                        !esDispositivoMovil() ||
                        modoDibujoOEdicionActivo
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

            // Se eliminó el rectángulo.
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
   CONTROL DE FLECHAS
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
                aria-label="Mover mapa hacia arriba"
                title="Mover mapa hacia arriba"
            >
                ▲
            </button>

            <button
                type="button"
                class="flecha-mapa flecha-izquierda"
                aria-label="Mover mapa hacia la izquierda"
                title="Mover mapa hacia la izquierda"
            >
                ◀
            </button>

            <div class="centro-flechas">
                ✥
            </div>

            <button
                type="button"
                class="flecha-mapa flecha-derecha"
                aria-label="Mover mapa hacia la derecha"
                title="Mover mapa hacia la derecha"
            >
                ▶
            </button>

            <button
                type="button"
                class="flecha-mapa flecha-abajo"
                aria-label="Mover mapa hacia abajo"
                title="Mover mapa hacia abajo"
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

        const distanciaMovimiento =
            esDispositivoMovil()
                ? 110
                : 160;

        function moverMapa(
            desplazamientoX,
            desplazamientoY
        ) {
            map.panBy(
                [
                    desplazamientoX,
                    desplazamientoY
                ],
                {
                    animate: true,
                    duration: 0.25
                }
            );
        }

        const configuracionBotones = [
            {
                selector:
                    ".flecha-arriba",

                x: 0,
                y: -distanciaMovimiento
            },
            {
                selector:
                    ".flecha-abajo",

                x: 0,
                y: distanciaMovimiento
            },
            {
                selector:
                    ".flecha-izquierda",

                x: -distanciaMovimiento,
                y: 0
            },
            {
                selector:
                    ".flecha-derecha",

                x: distanciaMovimiento,
                y: 0
            }
        ];

        configuracionBotones.forEach(
            (configuracion) => {
                const boton =
                    contenedor.querySelector(
                        configuracion.selector
                    );

                const ejecutarMovimiento =
                    function (evento) {
                        evento.preventDefault();
                        evento.stopPropagation();

                        moverMapa(
                            configuracion.x,
                            configuracion.y
                        );
                    };

                boton.addEventListener(
                    "click",
                    ejecutarMovimiento
                );

                boton.addEventListener(
                    "touchend",
                    ejecutarMovimiento,
                    {
                        passive: false
                    }
                );
            }
        );

        return contenedor;
    };

controlFlechas.addTo(map);

const elementoFlechas =
    document.querySelector(
        ".control-flechas-mapa"
    );

/* =========================================
   MENSAJE DEL MODO DE EDICIÓN
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

        elemento.innerHTML = `
            Usa las flechas para mover el mapa
            mientras dibujas o editas.
        `;

        elemento.style.display =
            "none";

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
   ACTIVAR Y DESACTIVAR INTERACCIONES
========================================= */

function guardarEstadoInteracciones() {
    estadoInteraccionAnterior = {
        dragging:
            map.dragging.enabled(),

        touchZoom:
            map.touchZoom.enabled(),

        doubleClickZoom:
            map.doubleClickZoom.enabled(),

        scrollWheelZoom:
            map.scrollWheelZoom.enabled(),

        boxZoom:
            map.boxZoom.enabled(),

        keyboard:
            map.keyboard.enabled()
    };
}

function desactivarInteraccionesMapa() {
    guardarEstadoInteracciones();

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
}

function restaurarInteraccionesMapa() {
    if (
        estadoInteraccionAnterior.dragging
    ) {
        map.dragging.enable();
    }

    if (
        estadoInteraccionAnterior.touchZoom
    ) {
        map.touchZoom.enable();
    }

    if (
        estadoInteraccionAnterior
            .doubleClickZoom
    ) {
        map.doubleClickZoom.enable();
    }

    if (
        estadoInteraccionAnterior
            .scrollWheelZoom
    ) {
        map.scrollWheelZoom.enable();
    }

    if (
        estadoInteraccionAnterior.boxZoom
    ) {
        map.boxZoom.enable();
    }

    if (
        estadoInteraccionAnterior.keyboard
    ) {
        map.keyboard.enable();
    }
}

function mostrarFlechasMapa() {
    if (modoDibujoOEdicionActivo) {
        return;
    }

    modoDibujoOEdicionActivo = true;

    desactivarInteraccionesMapa();

    if (elementoFlechas) {
        elementoFlechas.style.display =
            "grid";
    }

    if (elementoMensajeModo) {
        elementoMensajeModo.style.display =
            "block";
    }
}

function ocultarFlechasMapa() {
    if (!modoDibujoOEdicionActivo) {
        return;
    }

    modoDibujoOEdicionActivo = false;

    if (elementoFlechas) {
        elementoFlechas.style.display =
            "none";
    }

    if (elementoMensajeModo) {
        elementoMensajeModo.style.display =
            "none";
    }

    restaurarInteraccionesMapa();
}

/* =========================================
   EVENTOS DE INICIO Y FIN DE MODOS
========================================= */

map.on(
    L.Draw.Event.DRAWSTART,
    mostrarFlechasMapa
);

map.on(
    L.Draw.Event.DRAWSTOP,
    ocultarFlechasMapa
);

map.on(
    L.Draw.Event.EDITSTART,
    mostrarFlechasMapa
);

map.on(
    L.Draw.Event.EDITSTOP,
    ocultarFlechasMapa
);

map.on(
    L.Draw.Event.DELETESTART,
    mostrarFlechasMapa
);

map.on(
    L.Draw.Event.DELETESTOP,
    ocultarFlechasMapa
);

/* =========================================
   EVENTOS DE DIBUJO
========================================= */

map.on(
    L.Draw.Event.CREATED,
    function (evento) {
        const layer =
            evento.layer;

        poligonosDibujados.addLayer(
            layer
        );

        ultimaAreaDibujada =
            layer;

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
            function (layerEliminado) {
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
    .then((respuesta) => {
        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cargar " +
                    "BG_veredas.geojson. " +
                    `Código: ${respuesta.status}`
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
            "Error cargando el fondo gris:",
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
                "No se pudo cargar " +
                    "Veredas.geojson. " +
                    `Código: ${respuesta.status}`
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

        limitesCompletosVeredas =
            capaVeredas.getBounds();

        if (
            limitesCompletosVeredas
                .isValid()
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
   DESCARGAR Y ENVIAR PDF
========================================= */

async function descargarMapaPDF() {
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

    const nombreUsuario =
        window.prompt(
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

    const celularUsuario =
        window.prompt(
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

    const nombreVereda =
        window.prompt(
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

        const limitesArea =
            ultimaAreaDibujada
                .getBounds();

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
                                elemento.classList
                                    .contains(
                                        "leaflet-control-container"
                                    )
                            );
                        },

                    onclone:
                        function (
                            documentoClonado
                        ) {
                            const mapaClonado =
                                documentoClonado
                                    .getElementById(
                                        "map"
                                    );

                            if (mapaClonado) {
                                mapaClonado
                                    .style
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

        const pdf =
            new jsPDF({
                orientation:
                    "landscape",

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
           IMAGEN
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

        /* =================================
           PREPARAR ARCHIVO
        ================================= */

        const nombreLimpio =
            crearNombreArchivo(
                nombreVereda
            );

        const nombreArchivo =
            `area-${nombreLimpio || "vereda"}.pdf`;

        const pdfBlob =
            pdf.output("blob");

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
            String(coordenadas.z)
        );

        /*
         * Descargar primero para que el usuario
         * no pierda el archivo si el correo falla.
         */
        pdf.save(
            nombreArchivo
        );

        /*
         * Enviar una copia al servidor.
         */
        try {
            if (textoBoton) {
                textoBoton.textContent =
                    "Enviando...";
            }

            const respuestaCorreo =
                await fetch(
                    "enviar_pdf.php",
                    {
                        method: "POST",
                        body: formulario
                    }
                );

            const textoRespuesta =
                await respuestaCorreo.text();

            let resultadoCorreo;

            try {
                resultadoCorreo =
                    JSON.parse(
                        textoRespuesta
                    );
            } catch (errorJSON) {
                throw new Error(
                    "El servidor no devolvió una respuesta JSON válida."
                );
            }

            if (
                !respuestaCorreo.ok ||
                !resultadoCorreo.ok
            ) {
                throw new Error(
                    resultadoCorreo.mensaje ||
                    "No se pudo enviar el PDF por correo."
                );
            }

            alert(
                "El PDF fue descargado y enviado correctamente."
            );
        } catch (errorCorreo) {
            console.error(
                "El PDF fue descargado, pero no se pudo enviar:",
                errorCorreo
            );

            alert(
                "El PDF fue descargado, pero no se pudo enviar por correo. " +
                errorCorreo.message
            );
        }
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
