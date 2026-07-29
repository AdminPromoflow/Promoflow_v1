// preview.js

class PreviewGallery {
  constructor() {
    this.imagesContainerId = "wrap-images-group";
    this.thumbnailsContainerId = "sp_thumbs";
    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.autoplayDelay = 5000;
    this.observer = null;
    this.initialised = false;
  }

  init() {
    if (this.initialised) return true;

    const container = this.getImagesContainer();

    if (!container) return false;

    this.initialised = true;

    this.observeImages();
    this.refreshGallery();

    return true;
  }

  getImagesContainer() {
    return document.getElementById(this.imagesContainerId);
  }

  getThumbnailsContainer() {
    return document.getElementById(this.thumbnailsContainerId);
  }

  getImages() {
    const container = this.getImagesContainer();

    if (!container) return [];

    return Array.from(container.querySelectorAll("img.preview-media"));
  }

  observeImages() {
    const container = this.getImagesContainer();

    if (!container) return false;

    this.observer?.disconnect();

    this.observer = new MutationObserver(() => {
      this.refreshGallery(true);
    });

    this.observer.observe(container, {
      childList: true,
      subtree: true
    });

    return true;
  }

  refreshGallery(keepIndex = false) {
    const images = this.getImages();

    if (images.length === 0) {
      this.clearGallery();
      return false;
    }

    if (!keepIndex || this.currentIndex >= images.length) {
      this.currentIndex = 0;
    }

    this.renderThumbnails();
    this.showImage(this.currentIndex, false);
    this.startAutoplay();

    return true;
  }

  showImage(index = 0, restartAutoplay = true) {
    const images = this.getImages();

    if (images.length === 0) return false;

    let safeIndex = Number(index);

    if (!Number.isInteger(safeIndex)) {
      safeIndex = 0;
    }

    if (safeIndex < 0) {
      safeIndex = images.length - 1;
    }

    if (safeIndex >= images.length) {
      safeIndex = 0;
    }

    this.currentIndex = safeIndex;

    images.forEach((image, imageIndex) => {
      const active = imageIndex === safeIndex;

      image.classList.toggle("is-active", active);
      image.hidden = !active;
      image.style.display = active ? "block" : "none";
      image.setAttribute("aria-hidden", active ? "false" : "true");
    });

    this.updateThumbnailState();

    if (restartAutoplay) {
      this.startAutoplay();
    }

    return true;
  }

  nextImage() {
    return this.showImage(this.currentIndex + 1);
  }

  previousImage() {
    return this.showImage(this.currentIndex - 1);
  }

  renderThumbnails() {
    const thumbnailsContainer = this.getThumbnailsContainer();
    const images = this.getImages();

    if (!thumbnailsContainer) return false;

    thumbnailsContainer.replaceChildren();

    images.forEach((image, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "sp-thumb";
      button.dataset.index = String(index);
      button.setAttribute("aria-label", `Show image ${index + 1}`);
      button.setAttribute("aria-pressed", "false");

      const thumbnail = document.createElement("img");

      thumbnail.src = image.currentSrc || image.src;
      thumbnail.alt = image.alt || `Preview image ${index + 1}`;
      thumbnail.loading = "lazy";
      thumbnail.decoding = "async";

      button.appendChild(thumbnail);

      button.addEventListener("click", () => {
        this.showImage(index);
      });

      thumbnailsContainer.appendChild(button);
    });

    this.updateThumbnailState();

    return true;
  }

  updateThumbnailState() {
    const thumbnailsContainer = this.getThumbnailsContainer();

    if (!thumbnailsContainer) return false;

    const buttons = thumbnailsContainer.querySelectorAll(".sp-thumb");

    buttons.forEach((button, index) => {
      const active = index === this.currentIndex;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    return true;
  }

  startAutoplay() {
    this.stopAutoplay();

    if (this.getImages().length <= 1) return false;

    this.autoplayTimer = window.setInterval(() => {
      this.showImage(this.currentIndex + 1, false);
    }, this.autoplayDelay);

    return true;
  }

  stopAutoplay() {
    if (!this.autoplayTimer) return false;

    window.clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;

    return true;
  }

  clearGallery() {
    this.stopAutoplay();
    this.currentIndex = 0;

    const thumbnailsContainer = this.getThumbnailsContainer();

    if (thumbnailsContainer) {
      thumbnailsContainer.replaceChildren();
    }

    return true;
  }

  updatePrice(preferredButton = null) {
    const selectedButton =
      preferredButton ||
      document.querySelector("#wrap-prices-group .js-price-option.is-selected") ||
      document.querySelector("#wrap-prices-group .js-price-option");

    if (!(selectedButton instanceof HTMLButtonElement)) {
      return false;
    }

    const prices = window.previewLogic?.prices;

    if (!prices) return false;

    return prices.selectPriceButton(
      selectedButton,
      selectedButton.closest(".wrap-price")
    );
  }
}

const previewGallery = new PreviewGallery();

window.PreviewGallery = PreviewGallery;
window.previewGallery = previewGallery;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    previewGallery.init();
  }, { once: true });
} else {
  previewGallery.init();
}
