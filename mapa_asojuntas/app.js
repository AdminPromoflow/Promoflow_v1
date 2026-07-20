async function descargarMapaPDF() {
    const figurasDibujadas =
        obtenerFigurasDibujadas();

    if (figurasDibujadas.length === 0) {
        alert(
            "Primero debes dibujar al menos una figura."
        );

        return;
    }

    let limitesTodasLasFiguras;

    try {
        /*
         * Calcular los límites usando todos
         * los vértices de todos los polígonos.
         */
        limitesTodasLasFiguras =
            obtenerLimitesTodasLasFiguras();

        /*
         * Cerrar cualquier popup para que no
         * aparezca en la captura.
         */
        map.closePopup();

        /*
         * Ajustar inmediatamente el mapa para
         * mostrar todos los polígonos.
         */
        await ajustarMapaATodasLasFiguras(
            limitesTodasLasFiguras
        );
    } catch (error) {
        console.error(
            "Error ajustando el mapa:",
            error
        );

        alert(
            error.message ||
            "No fue posible mostrar todas las figuras."
        );

        return;
    }

    /*
     * Pedir los datos después de haber
     * mostrado todas las figuras.
     */
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

        /*
         * Volver a ajustar el mapa justo antes
         * de capturarlo.
         */
        const zoomImpresion =
            await ajustarMapaATodasLasFiguras(
                limitesTodasLasFiguras
            );

        /*
         * Colocar las figuras dibujadas por
         * encima de las demás capas.
         */
        poligonosDibujados.eachLayer(
            (figura) => {
                if (
                    typeof figura.bringToFront ===
                    "function"
                ) {
                    figura.bringToFront();
                }
            }
        );

        await esperar(300);
        await esperarCargaMapa();

        const coordenadas =
            obtenerCoordenadasConjunto(
                limitesTodasLasFiguras,
                zoomImpresion
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

        /*
         * Capturar el mapa con todos los
         * polígonos visibles.
         */
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
                            return (
                                elemento.classList &&
                                elemento.classList
                                    .contains(
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

        /* =====================================
           TÍTULO DEL PDF
        ===================================== */

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(16);

        pdf.text(
            figurasDibujadas.length === 1
                ? "Mapa del área dibujada"
                : "Mapa de las áreas dibujadas",
            margen,
            12
        );

        /* =====================================
           ENCABEZADO
        ===================================== */

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

        pdf.text(
            `Figuras incluidas: ${figurasDibujadas.length}`,
            110,
            18
        );

        /* =====================================
           IMAGEN DEL MAPA
        ===================================== */

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

        /* =====================================
           INFORMACIÓN DEL SOLICITANTE
        ===================================== */

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

        pdf.text(
            `Cantidad de figuras: ${figurasDibujadas.length}`,
            margen,
            posicionDatos + 28
        );

        /* =====================================
           CENTRO GENERAL
        ===================================== */

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
            `Z - Zoom de impresión: ${zoomImpresion}`,
            105,
            posicionDatos + 21
        );

        /* =====================================
           FECHA Y SISTEMA
        ===================================== */

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

        /* =====================================
           NOMBRE DEL ARCHIVO
        ===================================== */

        const nombreArchivo =
            `areas-${
                crearNombreArchivo(
                    nombreVereda
                ) || "vereda"
            }.pdf`;

        const pdfBlob =
            pdf.output("blob");

        /* =====================================
           PREPARAR FORMULARIO
        ===================================== */

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
            String(zoomImpresion)
        );

        formulario.append(
            "cantidad_figuras",
            String(
                figurasDibujadas.length
            )
        );

        /* =====================================
           DESCARGAR PDF
        ===================================== */

        pdf.save(
            nombreArchivo
        );

        /* =====================================
           ENVIAR PDF
        ===================================== */

        try {
            if (textoBoton) {
                textoBoton.textContent =
                    "Enviando...";
            }

            const respuesta =
                await fetch(
                    "send_mail.php",
                    {
                        method: "POST",
                        body: formulario
                    }
                );

            const textoRespuesta =
                await respuesta.text();

            let resultado;

            try {
                resultado =
                    JSON.parse(
                        textoRespuesta
                    );
            } catch (errorJSON) {
                console.error(
                    "Respuesta del servidor:",
                    textoRespuesta
                );

                throw new Error(
                    "El servidor no devolvió una respuesta JSON válida."
                );
            }

            if (
                !respuesta.ok ||
                !resultado.ok
            ) {
                throw new Error(
                    resultado.mensaje ||
                    "No se pudo enviar el correo."
                );
            }

            alert(
                figurasDibujadas.length === 1
                    ? "La figura fue incluida en el PDF. El archivo fue descargado y enviado correctamente."
                    : `Las ${figurasDibujadas.length} figuras fueron incluidas en el PDF. El archivo fue descargado y enviado correctamente.`
            );
        } catch (errorCorreo) {
            console.error(
                "Error enviando PDF:",
                errorCorreo
            );

            alert(
                "El PDF se descargó con todas las figuras, pero no se pudo enviar por correo."
            );
        }
    } catch (error) {
        console.error(
            "Error generando PDF:",
            error
        );

        alert(
            error.message ||
            "No fue posible generar el PDF."
        );
    } finally {
        /*
         * Mantener exactamente el encuadre
         * que contiene todos los polígonos.
         */
        try {
            await ajustarMapaATodasLasFiguras(
                limitesTodasLasFiguras
            );
        } catch (errorAjuste) {
            console.error(
                "No se pudo conservar el zoom:",
                errorAjuste
            );
        }

        botonDescargarPDF.disabled =
            false;

        if (textoBoton) {
            textoBoton.textContent =
                textoOriginal;
        }
    }
}
