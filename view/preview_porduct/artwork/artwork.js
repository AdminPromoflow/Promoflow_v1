// artwork.js

class Artwork {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;
    this.container = null;
    this.artworks = [];
  }

  init() {
    this.container = document.getElementById("wrap-artworks-group");
    return Boolean(this.container);
  }

  renderArtwork(data = []) {
    return this.renderArtworks(data);
  }

  renderArtworks(data = []) {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.artworks = this.normaliseArtworks(data);
    this.container.innerHTML = "";

    if (this.artworks.length === 0) {
      this.hideArtworkSection();
      return false;
    }

    const groups = this.groupArtworks(this.artworks, 3);

    groups.forEach((group) => {
      const wrapper = document.createElement("div");
      wrapper.className = "wrap-artworks";

      group.forEach((artwork) => {
        wrapper.appendChild(this.createArtworkLink(artwork));
      });

      this.container.appendChild(wrapper);
    });

    this.showArtworkSection();
    return true;
  }

  createArtworkLink(artwork) {
    const link = document.createElement("a");

    link.className = "btn btn-artwork";
    link.href = artwork.url;
    link.textContent = artwork.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    if (artwork.download) link.setAttribute("download", "");

    return link;
  }

  normaliseArtworks(data = []) {
    const artworks = this.extractArtworks(data);

    return artworks.map((artwork, index) => {
      if (typeof artwork === "string") {
        return {
          id: index,
          name: this.getFileName(artwork),
          url: artwork,
          download: true
        };
      }

      const url = artwork.url || artwork.file_url || artwork.file || artwork.path || artwork.link || artwork.artwork_url || artwork.template_url || "";
      const name = artwork.name || artwork.title || artwork.label || artwork.file_name || artwork.filename || artwork.artwork_name || artwork.template_name || this.getFileName(url) || `Artwork template ${index + 1}`;

      return {
        id: artwork.id || artwork.artwork_id || artwork.template_id || index,
        name,
        url,
        download: artwork.download !== false
      };
    }).filter((artwork) => artwork.url);
  }

  extractArtworks(data = []) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];

    if (Array.isArray(data.artworks)) return data.artworks;
    if (Array.isArray(data.artwork)) return data.artwork;
    if (Array.isArray(data.templates)) return data.templates;
    if (Array.isArray(data.artwork_templates)) return data.artwork_templates;
    if (Array.isArray(data.product_artworks)) return data.product_artworks;

    if (data.data) return this.extractArtworks(data.data);
    if (data.product) return this.extractArtworks(data.product);

    return [];
  }

  groupArtworks(artworks = [], groupSize = 3) {
    const groups = [];

    for (let index = 0; index < artworks.length; index += groupSize) {
      groups.push(artworks.slice(index, index + groupSize));
    }

    return groups;
  }

  getFileName(url = "") {
    if (!url) return "";

    try {
      const cleanUrl = url.split("?")[0].split("#")[0];
      const fileName = decodeURIComponent(cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1));
      const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

      return nameWithoutExtension.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    } catch (error) {
      console.error("Error getting artwork file name:", error);
      return "Artwork template";
    }
  }

  showArtworkSection() {
    if (!this.container) return false;

    const section = this.container.closest(".sp-artwork-downloads");

    if (section) section.hidden = false;

    return true;
  }

  hideArtworkSection() {
    if (!this.container) return false;

    const section = this.container.closest(".sp-artwork-downloads");

    if (section) section.hidden = true;

    return true;
  }

  clearArtwork() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.artworks = [];
    this.container.innerHTML = "";
    this.hideArtworkSection();

    return true;
  }

  clearArtworks() {
    return this.clearArtwork();
  }

  setArtwork(data = []) {
    return this.renderArtworks(data);
  }

  getArtwork() {
    return this.artworks;
  }
}

window.Artwork = Artwork;
