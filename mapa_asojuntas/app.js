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
    }
}

const mapa = new Mapa();
