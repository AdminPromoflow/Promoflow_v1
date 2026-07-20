"use strict";

class MapApp {

    constructor() {
        this.showMap();
        this.showVillages();
        this.showDrawnPolygons();
        this.showZoomControls();
        this.showMovementControls();
    }

    showMap() {

        this.map = L.map(
            "map",
            {
                zoomControl: false,
                dragging: false,
                touchZoom: false,
                doubleClickZoom: false,
                scrollWheelZoom: false,
                boxZoom: false,
                keyboard: false,
                tap: false,
                maxZoom: 18,
                minZoom: 11
            }
        ).setView(
            [4.234401078089235, -74.41519745304102],
            13
        );

        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 18,
                minZoom: 11,
                attribution: "Imagery © Esri"
            }
        ).addTo(this.map);
    }

    showZoomControls() {

        const zoomControl = L.control({
            position: "topright"
        });

        zoomControl.onAdd = () => {

            const container = L.DomUtil.create(
                "div",
                "custom-zoom-control"
            );

            container.innerHTML = `
                <button
                    type="button"
                    class="custom-zoom-button zoom-in-button"
                    aria-label="Zoom in"
                    title="Zoom in"
                >
                    +
                </button>

                <button
                    type="button"
                    class="custom-zoom-button zoom-out-button"
                    aria-label="Zoom out"
                    title="Zoom out"
                >
                    −
                </button>
            `;

            L.DomEvent.disableClickPropagation(
                container
            );

            L.DomEvent.disableScrollPropagation(
                container
            );

            const zoomInButton =
                container.querySelector(
                    ".zoom-in-button"
                );

            const zoomOutButton =
                container.querySelector(
                    ".zoom-out-button"
                );

            zoomInButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    this.map.zoomIn();
                }
            );

            zoomOutButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    this.map.zoomOut();
                }
            );

            return container;
        };

        zoomControl.addTo(
            this.map
        );
    }

    showMovementControls() {

        const movementControl = L.control({
            position: "bottomright"
        });

        movementControl.onAdd = () => {

            const container = L.DomUtil.create(
                "div",
                "movement-control"
            );

            container.innerHTML = `
                <button
                    type="button"
                    class="movement-button move-up-button"
                    aria-label="Move up"
                    title="Move up"
                >
                    ▲
                </button>

                <button
                    type="button"
                    class="movement-button move-left-button"
                    aria-label="Move left"
                    title="Move left"
                >
                    ◀
                </button>

                <div class="movement-center">
                    ✥
                </div>

                <button
                    type="button"
                    class="movement-button move-right-button"
                    aria-label="Move right"
                    title="Move right"
                >
                    ▶
                </button>

                <button
                    type="button"
                    class="movement-button move-down-button"
                    aria-label="Move down"
                    title="Move down"
                >
                    ▼
                </button>
            `;

            L.DomEvent.disableClickPropagation(
                container
            );

            L.DomEvent.disableScrollPropagation(
                container
            );

            const movementDistance = 150;

            const movements = [
                {
                    selector: ".move-up-button",
                    x: 0,
                    y: -movementDistance
                },
                {
                    selector: ".move-down-button",
                    x: 0,
                    y: movementDistance
                },
                {
                    selector: ".move-left-button",
                    x: -movementDistance,
                    y: 0
                },
                {
                    selector: ".move-right-button",
                    x: movementDistance,
                    y: 0
                }
            ];

            movements.forEach(
                (movement) => {

                    const button =
                        container.querySelector(
                            movement.selector
                        );

                    button.addEventListener(
                        "click",
                        (event) => {

                            event.preventDefault();
                            event.stopPropagation();

                            this.map.panBy(
                                [
                                    movement.x,
                                    movement.y
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

            return container;
        };

        movementControl.addTo(
            this.map
        );
    }

    getVillageColors() {

        return [
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
            "#ff7f50"
        ];
    }

    getVillageColor(name) {

        const colors =
            this.getVillageColors();

        const text = String(
            name || "No name"
        );

        let number = 0;

        for (let i = 0; i < text.length; i++) {
            number += text.charCodeAt(i);
        }

        return colors[
            number % colors.length
        ];
    }

    getVillageName(feature) {

        const properties =
            feature.properties || {};

        return (
            properties.NOMBRE_VER ||
            "No name"
        );
    }

    getVillageStyle(feature) {

        const name =
            this.getVillageName(feature);

        const color =
            this.getVillageColor(name);

        return {
            color: color,
            weight: 2,
            opacity: 0.85,
            fillColor: color,
            fillOpacity: 0.18
        };
    }

    showVillageName(feature, layer) {

        const name =
            this.getVillageName(feature);

        layer.bindTooltip(
            name,
            {
                permanent: true,
                direction: "center",
                className: "village-name"
            }
        );
    }

    highlightVillage(layer) {

        layer.setStyle({
            weight: 4,
            opacity: 1,
            fillOpacity: 0.4
        });

        layer.bringToFront();
    }

    resetVillageHighlight(layer) {

        if (!this.villages) {
            return;
        }

        this.villages.resetStyle(
            layer
        );
    }

    addVillageHighlight(layer) {

        layer.on(
            "mouseover",
            () => {

                this.highlightVillage(
                    layer
                );
            }
        );

        layer.on(
            "mouseout",
            () => {

                this.resetVillageHighlight(
                    layer
                );
            }
        );
    }

    createVillageLayer(data) {

        this.villages = L.geoJSON(
            data,
            {
                style: (feature) => {

                    return this.getVillageStyle(
                        feature
                    );
                },

                onEachFeature: (
                    feature,
                    layer
                ) => {

                    this.showVillageName(
                        feature,
                        layer
                    );

                    this.addVillageHighlight(
                        layer
                    );
                }
            }
        );

        this.villages.addTo(
            this.map
        );
    }

    showVillages() {

        fetch("geosons/Veredas.geojson")
            .then((response) => {

                if (!response.ok) {
                    throw new Error(
                        "Could not load Veredas.geojson."
                    );
                }

                return response.json();
            })
            .then((data) => {

                this.createVillageLayer(
                    data
                );
            })
            .catch((error) => {

                console.error(
                    "Error loading villages:",
                    error
                );
            });
    }

    showDrawnPolygons() {

        this.drawnPolygons =
            new L.FeatureGroup();

        this.drawnPolygons.addTo(
            this.map
        );

        const drawControl =
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
                        this.drawnPolygons,

                    edit: true,
                    remove: true
                }
            });

        this.map.addControl(
            drawControl
        );

        this.map.on(
            L.Draw.Event.CREATED,
            (event) => {

                this.drawnPolygons.addLayer(
                    event.layer
                );
            }
        );
    }
}

const mapApp = new MapApp();
