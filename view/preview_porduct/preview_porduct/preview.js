// preview.js

class PreviewGallery {
  constructor(options = {}) {
    this.rootId = options.rootId || "wrap-images-group";
    this.thumbsId = options.thumbsId || "sp_thumbs";
    this.intervalMs = Number(options.intervalMs || 5000);
    this.zoomScale = Number(options.zoomScale || 2);

    this.currentIndex = 0;
    this.autoTimer = null;
    this.observer = null;
    this.isInitialised = false;
  }

  /* ==========================================================================
    INITIALISE
  ========================================================================== */

  init() {
    if (this.isInitialised) return;

    const root = this.getRoot();

    if (!root) {
      console.warn(`Gallery root #${this.rootId} was not found.`);
      return;
    }

    this.isInitialised = true;
    this.setupObserver();
    this.setupZoomEvents();
    this.refreshGallery();
  }

  setupObserver() {
    const root = this.getRoot();

    if (!root) return false;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.observer = new MutationObserver((mutations) => {
      const hasRelevantChange = mutations.some((mutation) => {
        if (mutation.type === "childList") return true;

        return (
          mutation.type === "attributes" &&
          ["src", "poster"].includes(mutation.attributeName)
        );
      });

      if (hasRelevantChange) {
        this.refreshGallery(true);
      }
    });

    this.observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "poster"]
    });

    return true;
  }

  setupZoomEvents() {
    const root = this.getRoot();

    if (!root || root.dataset.zoomBound === "1") return false;

    root.dataset.zoomBound = "1";

    root.addEventListener("mousemove", (event) => {
      this.handleZoomMove(event);
    });

    root.addEventListener("mouseleave", () => {
      this.handleZoomLeave();
    });

    root.addEventListener("touchstart", () => {
      this.stopAutoplay();
    }, { passive: true });

    root.addEventListener("touchend", () => {
      this.startAutoplay();
    }, { passive: true });

    return true;
  }

  /* ==========================================================================
    ELEMENT HELPERS
  ========================================================================== */

  getRoot() {
    return document.getElementById(this.rootId);
  }

  getThumbsRoot() {
    return document.getElementById(this.thumbsId);
  }

  getMediaItems() {
    const root = this.getRoot();

    if (!root) return [];

    return Array.from(
      root.querySelectorAll(
        "img.preview-media, video.preview-media"
      )
    );
  }

  getCurrentMedia() {
    const items = this.getMediaItems();

    if (items.length === 0) return null;

    return items[this.currentIndex] || null;
  }

  hasMedia() {
    return this.getMediaItems().length > 0;
  }

  normaliseIndex(index, total) {
    if (total <= 0) return 0;
    if (index < 0) return total - 1;
    if (index >= total) return 0;

    return index;
  }

  /* ==========================================================================
    AUTOPLAY
  ========================================================================== */

  stopAutoplay() {
    if (!this.autoTimer) return;

    window.clearInterval(this.autoTimer);
    this.autoTimer = null;
  }

  startAutoplay() {
    this.stopAutoplay();

    const items = this.getMediaItems();

    if (items.length <= 1) return false;

    this.autoTimer = window.setInterval(() => {
      this.nextImage(false);
    }, this.intervalMs);

    return true;
  }

  clearGallery() {
    this.stopAutoplay();
    this.currentIndex = 0;

    const thumbsRoot = this.getThumbsRoot();

    if (thumbsRoot) {
      thumbsRoot.replaceChildren();
    }

    return true;
  }

  /* ==========================================================================
    ZOOM
  ========================================================================== */

  resetZoom(media = null) {
    const items = media ? [media] : this.getMediaItems();

    for (const item of items) {
      if (!(item instanceof HTMLElement)) continue;

      item.classList.remove("is-zooming");
      item.style.transformOrigin = "";
      item.style.transform = "";
    }
  }

  handleZoomMove(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const activeMedia = target.closest(
      ".preview-media.is-active"
    );

    if (!(activeMedia instanceof HTMLImageElement)) return;

    const rect = activeMedia.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return;

    const offsetX = Math.min(
      Math.max(event.clientX - rect.left, 0),
      rect.width
    );

    const offsetY = Math.min(
      Math.max(event.clientY - rect.top, 0),
      rect.height
    );

    const xPercent = (offsetX / rect.width) * 100;
    const yPercent = (offsetY / rect.height) * 100;

    activeMedia.classList.add("is-zooming");
    activeMedia.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    activeMedia.style.transform = `scale(${this.zoomScale})`;

    this.stopAutoplay();
  }

  handleZoomLeave() {
    const currentMedia = this.getCurrentMedia();

    if (currentMedia instanceof HTMLImageElement) {
      this.resetZoom(currentMedia);
    }

    this.startAutoplay();
  }

  /* ==========================================================================
    GALLERY REFRESH
  ========================================================================== */

  refreshGallery(keepIndex = false) {
    const items = this.getMediaItems();

    if (items.length === 0) {
      this.clearGallery();
      return false;
    }

    if (keepIndex) {
      this.currentIndex = this.normaliseIndex(
        this.currentIndex,
        items.length
      );
    } else {
      this.currentIndex = 0;
    }

    this.renderThumbs();
    this.showCurrentMedia();
    this.startAutoplay();

    return true;
  }

  showCurrentMedia() {
    const items = this.getMediaItems();

    if (items.length === 0) return false;

    this.currentIndex = this.normaliseIndex(
      this.currentIndex,
      items.length
    );

    for (let i = 0; i < items.length; i++) {
      const media = items[i];
      const isActive = i === this.currentIndex;

      this.resetZoom(media);

      media.classList.toggle("is-active", isActive);
      media.hidden = !isActive;
      media.style.display = isActive ? "block" : "none";
      media.setAttribute("aria-hidden", isActive ? "false" : "true");

      if (media instanceof HTMLVideoElement && !isActive) {
        media.pause();
        media.currentTime = 0;
      }
    }

    this.updateThumbStates();

    return true;
  }

  /* ==========================================================================
    NAVIGATION
  ========================================================================== */

  nextImage(restartAutoplay = true) {
    const items = this.getMediaItems();

    if (items.length <= 1) return false;

    this.currentIndex = this.normaliseIndex(
      this.currentIndex + 1,
      items.length
    );

    this.showCurrentMedia();

    if (restartAutoplay) {
      this.startAutoplay();
    }

    return true;
  }

  prevImage(restartAutoplay = true) {
    const items = this.getMediaItems();

    if (items.length <= 1) return false;

    this.currentIndex = this.normaliseIndex(
      this.currentIndex - 1,
      items.length
    );

    this.showCurrentMedia();

    if (restartAutoplay) {
      this.startAutoplay();
    }

    return true;
  }

  goToImage(index) {
    const items = this.getMediaItems();
    const numericIndex = Number(index);

    if (
      items.length === 0 ||
      !Number.isInteger(numericIndex)
    ) {
      return false;
    }

    this.currentIndex = this.normaliseIndex(
      numericIndex,
      items.length
    );

    this.showCurrentMedia();
    this.startAutoplay();

    return true;
  }

  /* ==========================================================================
    THUMBNAILS
  ========================================================================== */

  renderThumbs() {
    const thumbsRoot = this.getThumbsRoot();
    const items = this.getMediaItems();

    if (!thumbsRoot) return false;

    thumbsRoot.replaceChildren();

    for (let i = 0; i < items.length; i++) {
      const media = items[i];
      const button = document.createElement("button");

      button.type = "button";
      button.className = "sp-thumb";
      button.dataset.mediaIndex = String(i);
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-label", `Show media ${i + 1}`);
      button.setAttribute("aria-pressed", "false");

      if (media instanceof HTMLImageElement) {
        const thumbImage = document.createElement("img");

        thumbImage.src = media.currentSrc || media.src;
        thumbImage.alt = media.alt || `Preview image ${i + 1}`;
        thumbImage.loading = "lazy";
        thumbImage.decoding = "async";
        thumbImage.draggable = false;

        button.appendChild(thumbImage);
      } else if (media instanceof HTMLVideoElement) {
        this.renderVideoThumbnail(button, media, i);
      }

      button.addEventListener("click", () => {
        this.goToImage(i);
      });

      thumbsRoot.appendChild(button);
    }

    this.updateThumbStates();

    return true;
  }

  renderVideoThumbnail(button, media, index) {
    const poster = String(media.poster ?? "").trim();

    if (poster) {
      const thumbImage = document.createElement("img");

      thumbImage.src = poster;
      thumbImage.alt = `Video preview ${index + 1}`;
      thumbImage.loading = "lazy";
      thumbImage.decoding = "async";
      thumbImage.draggable = false;

      button.appendChild(thumbImage);
    }

    const videoLabel = document.createElement("span");

    videoLabel.className = "sp-thumb-video";
    videoLabel.textContent = "Video";

    button.appendChild(videoLabel);
  }

  updateThumbStates() {
    const thumbsRoot = this.getThumbsRoot();

    if (!thumbsRoot) return false;

    const thumbs = Array.from(
      thumbsRoot.querySelectorAll(".sp-thumb")
    );

    for (let i = 0; i < thumbs.length; i++) {
      const isActive = i === this.currentIndex;

      thumbs[i].classList.toggle("is-active", isActive);
      thumbs[i].setAttribute(
        "aria-pressed",
        isActive ? "true" : "false"
      );
    }

    return true;
  }

  /* ==========================================================================
    PRICE COMPATIBILITY
  ========================================================================== */

  updatePrice(preferredButton = null) {
    const selectedButton =
      preferredButton ||
      document.querySelector(
        "#wrap-prices-group .js-price-option.is-selected"
      ) ||
      document.querySelector(
        "#wrap-prices-group .js-price-option"
      );

    if (!selectedButton) return false;

    if (
      window.prices &&
      typeof window.prices.selectPriceButton === "function"
    ) {
      const scope = selectedButton.closest(".wrap-price");

      return window.prices.selectPriceButton(
        selectedButton,
        scope
      );
    }

    return false;
  }

  destroy() {
    this.stopAutoplay();
    this.resetZoom();

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    const root = this.getRoot();

    if (root) {
      delete root.dataset.zoomBound;
    }

    this.isInitialised = false;
  }
}

/* ==========================================================================
  GLOBAL INSTANCE
========================================================================== */

const previewGallery = new PreviewGallery({
  rootId: "wrap-images-group",
  thumbsId: "sp_thumbs",
  intervalMs: 5000,
  zoomScale: 2
});

window.previewGallery = previewGallery;

/* ==========================================================================
  INITIALISE ONCE
========================================================================== */

function initialisePreviewGallery() {
  window.previewGallery?.init?.();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initialisePreviewGallery,
    { once: true }
  );
} else {
  initialisePreviewGallery();
}
