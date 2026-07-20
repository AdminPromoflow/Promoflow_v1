"use strict";

class Mapa {

    constructor() {
        this.showMap();
        this.showPoligonosDibujados();
    }

    showMap() {

        this.map = L.map(
            "map",
            {
                minZoom: 5,
                maxZoom: 18
            }
        ).setView(
            [4.270625797339428, -74.41654400019608],
            18
        );

        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                minZoom: 5,
                maxZoom: 18,
                attribution: "Imágenes © Esri"
            }
        ).addTo(this.map);
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
