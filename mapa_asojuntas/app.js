"use strict";

/* =========================================
   CLASE MAPA
========================================= */

class Mapa {

    /* =====================================
       CONSTRUCTOR
    ===================================== */

    constructor() {
        this.showMap();
    }

    /* =====================================
       MOSTRAR ENCABEZADO Y MAPA
    ===================================== */

    showMap() {

        /* ---------------------------------
           BUSCAR CONTENEDOR PRINCIPAL
        --------------------------------- */

        const aplicacion =
            document.getElementById("app");

        if (!aplicacion) {
            console.error(
                "No se encontró el elemento con id app."
            );

            return;
        }

        /* ---------------------------------
           CREAR ESTRUCTURA HTML
        --------------------------------- */

        aplicacion.innerHTML = `
            <header class="encabezado-mapa">

                <div class="informacion-encabezado">

                    <h1 class="titulo-mapa">
                        Mapa satelital de Arbeláez
                    </h1>

                    <p class="descripcion-mapa">
                        Explora el territorio y dibuja las áreas que necesitas identificar.
                    </p>

                </div>

                <div class="estado-mapa">
                    Imagen satelital
                </div>

            </header>

            <main
                id="map"
                aria-label="Mapa satelital de Arbeláez"
            ></main>
        `;

        /* ---------------------------------
           VERIFICAR LEAFLET
        --------------------------------- */

        if (typeof L === "undefined") {
            console.error(
                "Leaflet no está disponible."
            );

            return;
        }

        /* ---------------------------------
           CREAR MAPA LEAFLET
        --------------------------------- */

        this.map = L.map(
            "map",
            {
                preferCanvas: true,

                zoomControl: true,

                touchZoom: true,

                doubleClickZoom: true,

                scrollWheelZoom: true,

                boxZoom: true,

                keyboard: true,

                dragging: true,

                tap: false
            }
        );

        /* ---------------------------------
           POSICIÓN INICIAL
        --------------------------------- */

        this.map.setView(
            [
                4.270625797339428,
                -74.41654400019608
            ],
            13
        );

        /* ---------------------------------
           MAPA SATELITAL
        --------------------------------- */

        this.capaSatelital =
            L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/" +
                "World_Imagery/MapServer/tile/{z}/{y}/{x}",

                {
                    /*
                        Nivel real aproximado disponible
                        en el servicio de teselas.
                    */
                    maxNativeZoom: 19,

                    /*
                        Leaflet permite acercarse más,
                        ampliando la última imagen disponible.
                    */
                    maxZoom: 22,

                    minZoom: 3,

                    attribution:
                        "Imágenes &copy; Esri, Maxar, Earthstar Geographics",

                    crossOrigin: "anonymous",

                    updateWhenIdle: true,

                    keepBuffer: 4
                }
            );

        /* ---------------------------------
           AGREGAR CAPA AL MAPA
        --------------------------------- */

        this.capaSatelital.addTo(
            this.map
        );

        /* ---------------------------------
           AGREGAR ESCALA
        --------------------------------- */

        L.control.scale(
            {
                metric: true,
                imperial: false,
                position: "bottomleft"
            }
        ).addTo(
            this.map
        );

        /* ---------------------------------
           CORREGIR TAMAÑO INICIAL
        --------------------------------- */

        window.setTimeout(
            () => {
                this.map.invalidateSize({
                    animate: false
                });
            },
            150
        );

        /* ---------------------------------
           AJUSTAR AL CAMBIAR LA PANTALLA
        --------------------------------- */

        window.addEventListener(
            "resize",
            () => {
                this.map.invalidateSize({
                    animate: false
                });
            }
        );

        window.addEventListener(
            "orientationchange",
            () => {
                window.setTimeout(
                    () => {
                        this.map.invalidateSize({
                            animate: false
                        });
                    },
                    200
                );
            }
        );
    }
}

/* =========================================
   CREAR INSTANCIA DE LA CLASE
========================================= */

const mapa =
    new Mapa();
