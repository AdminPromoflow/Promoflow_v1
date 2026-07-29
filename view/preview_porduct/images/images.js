// images.js

class Images {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;
    this.container = null;
    this.images = [];
  }

  init() {
    this.container = document.getElementById("wrap-images-group");
    return Boolean(this.container);
  }

  renderImage(data = []) {
    return this.renderImages(data);
  }

  renderImages(data = []) {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.images = this.normaliseImages(data);
    this.container.innerHTML = "";

    if (this.images.length === 0) {
      this.hideGallery();
      this.refreshGallery();
      return false;
    }

    const fragment = document.createDocumentFragment();

    this.images.forEach((image, index) => {
      fragment.appendChild(this.createMediaElement(image, index));
    });

    this.container.appendChild(fragment);
    this.showGallery();
    this.refreshGallery();

    return true;
  }

  createMediaElement(image, index) {
    if (image.type === "video") return this.createVideoElement(image, index);
    return this.createImageElement(image, index);
  }

  createImageElement(image, index) {
    const element = document.createElement("img");

    element.className = "preview-media";
    element.src = image.url;
    element.alt = image.alt || `Product image ${index + 1}`;
    element.loading = index === 0 ? "eager" : "lazy";
    element.decoding = "async";
    element.draggable = false;
    element.hidden = index !== 0;
    element.style.display = index === 0 ? "block" : "none";

    if (index === 0) element.classList.add("is-active");

    element.addEventListener("error", () => {
      this.handleMediaError(element, image);
    });

    return element;
  }

  createVideoElement(image, index) {
    const element = document.createElement("video");

    element.className = "preview-media";
    element.src = image.url;
    element.controls = true;
    element.playsInline = true;
    element.preload = "metadata";
    element.hidden = index !== 0;
    element.style.display = index === 0 ? "block" : "none";

    if (image.poster) element.poster = image.poster;
    if (index === 0) element.classList.add("is-active");

    element.addEventListener("error", () => {
      this.handleMediaError(element, image);
    });

    return element;
  }

  handleMediaError(element, image) {
    console.error("Error loading product media:", image.url);

    if (element && element.parentNode) element.remove();

    this.images = this.images.filter((currentImage) => currentImage.url !== image.url);
    this.refreshGallery();
  }

  normaliseImages(data = []) {
    const images = this.extractImages(data);

    return images.map((image, index) => {
      if (typeof image === "string") {
        return {
          id: index,
          url: image,
          alt: `Product image ${index + 1}`,
          type: this.getMediaType(image),
          poster: ""
        };
      }

      const url = image.url || image.image_url || image.file_url || image.file || image.path || image.src || image.link || image.product_image || image.image || "";
      const poster = image.poster || image.poster_url || image.thumbnail || image.thumbnail_url || "";
      const type = image.type || image.media_type || image.file_type || this.getMediaType(url);
      const alt = image.alt || image.alt_text || image.title || image.name || image.description || `Product image ${index + 1}`;

      return {
        id: image.id || image.image_id || image.media_id || index,
        url,
        alt,
        type: this.normaliseMediaType(type, url),
        poster,
        order: Number(image.order ?? image.position ?? image.sort_order ?? index)
      };
    }).filter((image) => image.url).sort((firstImage, secondImage) => firstImage.order - secondImage.order);
  }

  extractImages(data = []) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];

    if (Array.isArray(data.images)) return data.images;
    if (Array.isArray(data.image)) return data.image;
    if (Array.isArray(data.media)) return data.media;
    if (Array.isArray(data.product_images)) return data.product_images;
    if (Array.isArray(data.product_media)) return data.product_media;
    if (Array.isArray(data.gallery)) return data.gallery;
    if (Array.isArray(data.files)) return data.files;

    if (data.data) return this.extractImages(data.data);
    if (data.product) return this.extractImages(data.product);

    return [];
  }

  normaliseMediaType(type = "", url = "") {
    const normalisedType = String(type).toLowerCase();

    if (normalisedType.includes("video")) return "video";
    if (normalisedType.includes("image")) return "image";

    return this.getMediaType(url);
  }

  getMediaType(url = "") {
    const cleanUrl = String(url).split("?")[0].split("#")[0].toLowerCase();
    const extension = cleanUrl.substring(cleanUrl.lastIndexOf(".") + 1);
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "m4v"];

    return videoExtensions.includes(extension) ? "video" : "image";
  }

  refreshGallery() {
    if (!(window.previewGallery instanceof PreviewGallery)) return false;

    window.requestAnimationFrame(() => {
      window.previewGallery.refreshGallery();
    });

    return true;
  }

  showGallery() {
    if (!this.container) return false;

    const gallery = this.container.closest(".sp-gallery");

    if (gallery) gallery.hidden = false;

    return true;
  }

  hideGallery() {
    if (!this.container) return false;

    const gallery = this.container.closest(".sp-gallery");

    if (gallery) gallery.hidden = true;

    return true;
  }

  clearImages() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.images = [];
    this.container.innerHTML = "";
    this.hideGallery();
    this.refreshGallery();

    return true;
  }

  clearImage() {
    return this.clearImages();
  }

  setImages(data = []) {
    return this.renderImages(data);
  }

  getImages() {
    return this.images;
  }

  getImageById(imageId) {
    return this.images.find((image) => String(image.id) === String(imageId)) || null;
  }
}

window.Images = Images;
