"use strict";

class Mapa {

    constructor() {
        this.showMap();
    }

    showMap() {

        const map = L.map("map").setView(
            [4.270625797339428, -74.41654400019608],
            13
        );

        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 20,
                attribution: "Imágenes © Esri"
            }
        ).addTo(map);

        const poligonosDibujados =
            new L.FeatureGroup();

        poligonosDibujados.addTo(map);

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

        map.on(
            L.Draw.Event.CREATED,
            function (evento) {
                poligonosDibujados.addLayer(
                    evento.layer
                );
            }
        );
    }
}

const mapa = new Mapa();
