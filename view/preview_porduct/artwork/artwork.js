// artwork.js

class Artwork {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;
    this.container = null;
  }

  init() {
    this.container = document.getElementById("wrap-artworks-group");
    return Boolean(this.container);
  }

  renderArtworks(data = [], typeVariation = {}) {
    return this.renderArtwork(data, typeVariation);
  }

  renderArtwork(artworksOnlyOfType = [], typeVariation = {}) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const selectedVariationId = Number(
      String(this.previewLogic?.variations?.getSelectVariation?.() ?? "")
        .replace(/^variation_id_/, "")
    );

    if (!Number.isFinite(selectedVariationId)) return false;

    const typeId = String(typeVariation?.type_id ?? "").trim();

    if (!typeId) return false;

    this.deleteArtwork(typeId);

    const wrapper = document.createElement("div");

    wrapper.className = "wrap-artworks";
    wrapper.id = `wrap-artworks-${typeId}`;
    wrapper.dataset.typeId = typeId;

    for (const artworkData of artworksOnlyOfType) {
      if (Number(artworkData?.variation_id) !== selectedVariationId) continue;

      const name = String(artworkData?.name_pdf_artwork ?? "").trim();
      const pdfSource = this.buildPdfSource(artworkData?.pdf_artwork);

      if (!name && !pdfSource) continue;

      const artworkElement = document.createElement("div");

      artworkElement.className = "sp-artwork";

      if (name) {
        const artworkName = document.createElement("strong");

        artworkName.className = "sp-artwork-name";
        artworkName.textContent = name;

        artworkElement.appendChild(artworkName);
      }

      if (pdfSource) {
        const artworkLink = document.createElement("a");

        artworkLink.className = "sp-artwork-link";
        artworkLink.href = pdfSource;
        artworkLink.target = "_blank";
        artworkLink.rel = "noopener";
        artworkLink.textContent = "Open PDF";

        artworkElement.appendChild(artworkLink);
      }

      wrapper.appendChild(artworkElement);
    }

    if (wrapper.children.length === 0) return false;

    this.container.appendChild(wrapper);

    return true;
  }

  buildPdfSource(pdf = "") {
    const rawPdf = String(pdf ?? "").trim().replace(/^\/+/, "");

    if (!rawPdf) return "";

    if (
      rawPdf.startsWith("http") ||
      rawPdf.startsWith("data:") ||
      rawPdf.startsWith("blob:")
    ) {
      return rawPdf;
    }

    if (rawPdf.startsWith("controller/")) {
      return `../../${rawPdf}`;
    }

    return `../../controller/${rawPdf}`;
  }

  deleteArtwork(typeId) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const safeTypeId = String(typeId ?? "").trim();

    if (!safeTypeId) return false;

    document.getElementById(`wrap-artworks-${safeTypeId}`)?.remove();

    return true;
  }

  clearArtwork() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.container.replaceChildren();

    return true;
  }

  clearArtworks() {
    return this.clearArtwork();
  }
}

window.Artwork = Artwork;
