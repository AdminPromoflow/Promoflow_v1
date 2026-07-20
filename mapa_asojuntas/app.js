"use strict";

class Mapa {

    constructor() {
        this.showMap();
        this.showVeredas();
        this.showPoligonosDibujados();
    }

    showMap() {

        this.map = L.map(
            "map",
            {
                maxZoom: 18,
                minZoom: 11
            }
        ).setView(
            [4.270625797339428, -74.41654400019608],
            13
        );

        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 18,
                minZoom: 11,
                attribution: "Imágenes © Esri"
            }
        ).addTo(this.map);
    }

    showVeredas() {

        fetch("geosons/Veredas.geojson")
            .then((respuesta) => {

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudo cargar Veredas.geojson."
                    );
                }

                return respuesta.json();
            })
            .then((datos) => {

                this.veredas = L.geoJSON(
                    datos,
                    {
                        style: {
                            color: "#ffff00",
                            weight: 2,
                            opacity: 1,
                            fillColor: "#ffff00",
                            fillOpacity: 0.15
                        }
                    }
                );

                this.veredas.addTo(
                    this.map
                );
            })
            .catch((error) => {

                console.error(
                    "Error cargando las veredas:",
                    error
                );
            });
    }

    showPoligonosDibujados() {

        this.poligonosDibujados =
            new L.FeatureGroup();

        this.poligonosDibujados.addTo(
            this.map
        );

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
                        this.poligonosDibujados,

                    edit: true,
                    remove: true
                }
            });

        this.map.addControl(
            controlDibujo
        );

        this.map.on(
            L.Draw.Event.CREATED,
            (evento) => {

                this.poligonosDibujados.addLayer(
                    evento.layer
                );
            }
        );
    }
}

const mapa = new Mapa();
