"use strict";

class MapApp {

    constructor() {

        this.initialPosition = [
            4.234401078089235,
            -74.41519745304102
        ];

        this.initialZoom = 13;

        this.showMap();
        this.showVillages();
        this.showDrawnPolygons();
        this.showZoomControls();
        this.showMovementControls();
        this.showResetViewControl();
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
            this.initialPosition,
            this.initialZoom
        );

        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 18,
                minZoom: 11,
                attribution: "Imagery © Esri"
            }
        ).addTo(
            this.map
        );
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

            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.gap = "5px";

            container.innerHTML = `
                <button
                    type="button"
                    class="zoom-in-button"
                    aria-label="Zoom in"
                    title="Zoom in"
                >
                    +
                </button>

                <button
                    type="button"
                    class="zoom-out-button"
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

            const buttons =
                container.querySelectorAll(
                    "button"
                );

            buttons.forEach((button) => {

                button.style.width = "42px";
                button.style.height = "42px";
                button.style.border = "none";
                button.style.borderRadius = "8px";
                button.style.backgroundColor = "#ffffff";
                button.style.color = "#222222";
                button.style.fontSize = "26px";
                button.style.fontWeight = "bold";
                button.style.cursor = "pointer";
                button.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.25)";
            });

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

    showResetViewControl() {

        const mapContainer =
            this.map.getContainer();

        const resetButton =
            document.createElement(
                "button"
            );

        resetButton.type = "button";

        resetButton.textContent = "⌂";

        resetButton.title =
            "Return to original view";

        resetButton.setAttribute(
            "aria-label",
            "Return to original view"
        );

        resetButton.style.position =
            "absolute";

        resetButton.style.top =
            "50%";

        resetButton.style.right =
            "10px";

        resetButton.style.transform =
            "translateY(-50%)";

        resetButton.style.zIndex =
            "1000";

        resetButton.style.width =
            "46px";

        resetButton.style.height =
            "46px";

        resetButton.style.border =
            "none";

        resetButton.style.borderRadius =
            "50%";

        resetButton.style.backgroundColor =
            "#ffffff";

        resetButton.style.color =
            "#222222";

        resetButton.style.fontSize =
            "24px";

        resetButton.style.fontWeight =
            "bold";

        resetButton.style.cursor =
            "pointer";

        resetButton.style.boxShadow =
            "0 2px 8px rgba(0, 0, 0, 0.25)";

        resetButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                this.map.setView(
                    this.initialPosition,
                    this.initialZoom,
                    {
                        animate: true
                    }
                );
            }
        );

        mapContainer.appendChild(
            resetButton
        );
    }

    showMovementControls() {

        const movementControl =
            L.control({
                position: "bottomright"
            });

        movementControl.onAdd = () => {

            const container =
                L.DomUtil.create(
                    "div",
                    "movement-control"
                );

            container.style.display =
                "grid";

            container.style.gridTemplateColumns =
                "42px 42px 42px";

            container.style.gridTemplateRows =
                "42px 42px 42px";

            container.style.gap =
                "4px";

            container.innerHTML = `
                <button
                    type="button"
                    class="move-up-button"
                    aria-label="Move up"
                    title="Move up"
                >
                    ▲
                </button>

                <button
                    type="button"
                    class="move-left-button"
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
                    class="move-right-button"
                    aria-label="Move right"
                    title="Move right"
                >
                    ▶
                </button>

                <button
                    type="button"
                    class="move-down-button"
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

            const movementButtons =
                container.querySelectorAll(
                    "button"
                );

            movementButtons.forEach(
                (button) => {

                    button.style.width =
                        "42px";

                    button.style.height =
                        "42px";

                    button.style.border =
                        "none";

                    button.style.borderRadius =
                        "8px";

                    button.style.backgroundColor =
                        "#ffffff";

                    button.style.color =
                        "#222222";

                    button.style.fontSize =
                        "18px";

                    button.style.cursor =
                        "pointer";

                    button.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.25)";
                }
            );

            const upButton =
                container.querySelector(
                    ".move-up-button"
                );

            const leftButton =
                container.querySelector(
                    ".move-left-button"
                );

            const center =
                container.querySelector(
                    ".movement-center"
                );

            const rightButton =
                container.querySelector(
                    ".move-right-button"
                );

            const downButton =
                container.querySelector(
                    ".move-down-button"
                );

            upButton.style.gridColumn = "2";
            upButton.style.gridRow = "1";

            leftButton.style.gridColumn = "1";
            leftButton.style.gridRow = "2";

            center.style.gridColumn = "2";
            center.style.gridRow = "2";
            center.style.display = "flex";
            center.style.alignItems = "center";
            center.style.justifyContent = "center";
            center.style.borderRadius = "8px";
            center.style.backgroundColor =
                "rgba(255, 255, 255, 0.9)";

            rightButton.style.gridColumn = "3";
            rightButton.style.gridRow = "2";

            downButton.style.gridColumn = "2";
            downButton.style.gridRow = "3";

            const movementDistance = 150;

            const movements = [
                {
                    button: upButton,
                    x: 0,
                    y: -movementDistance
                },
                {
                    button: downButton,
                    x: 0,
                    y: movementDistance
                },
                {
                    button: leftButton,
                    x: -movementDistance,
                    y: 0
                },
                {
                    button: rightButton,
                    x: movementDistance,
                    y: 0
                }
            ];

            movements.forEach(
                (movement) => {

                    movement.button.addEventListener(
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

        const text =
            String(
                name || "No name"
            );

        let number = 0;

        for (
            let i = 0;
            i < text.length;
            i++
        ) {
            number +=
                text.charCodeAt(i);
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
            this.getVillageName(
                feature
            );

        const color =
            this.getVillageColor(
                name
            );

        return {
            color: color,
            weight: 2,
            opacity: 0.85,
            fillColor: color,
            fillOpacity: 0.18
        };
    }

    showVillageName(
        feature,
        layer
    ) {

        const name =
            this.getVillageName(
                feature
            );

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

        this.villages =
            L.geoJSON(
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

        fetch(
            "geosons/Veredas.geojson"
        )
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

const mapApp =
    new MapApp();
