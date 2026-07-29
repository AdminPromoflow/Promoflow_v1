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

    this.init();
  }

  /* ============================================================================
    INITIALISE
  ============================================================================ */

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.setupObserver();
        this.setupZoomEvents();
        this.refreshGallery();
      });
    } else {
      this.setupObserver();
      this.setupZoomEvents();
      this.refreshGallery();
    }
  }

  /* ============================================================================
    OBSERVER
  ============================================================================ */

  setupObserver() {
    const root = this.getRoot();

    if (!root) return false;

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver(() => {
      this.refreshGallery(true);
    });

    this.observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "poster"]
    });

    return true;
  }

  /* ============================================================================
    ZOOM EVENTS
  ============================================================================ */

  setupZoomEvents() {
    const root = this.getRoot();

    if (!root) return false;
    if (root.dataset.zoomBound === "1") return true;

    root.dataset.zoomBound = "1";

    root.addEventListener("mousemove", (event) => {
      this.handleZoomMove(event);
    });

    root.addEventListener("mouseleave", () => {
      this.handleZoomLeave();
    });

    return true;
  }

  handleZoomMove(event) {
    const activeMedia = event.target.closest(".preview-media.is-active");

    if (!activeMedia) return false;
    if (activeMedia.tagName !== "IMG") return false;

    const rect = activeMedia.getBoundingClientRect();

    if (!rect.width || !rect.height) return false;

    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const xPercent = (offsetX / rect.width) * 100;
    const yPercent = (offsetY / rect.height) * 100;

    activeMedia.classList.add("is-zooming");
    activeMedia.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    activeMedia.style.transform = `scale(${this.zoomScale})`;

    this.stopAutoplay();

    return true;
  }

  handleZoomLeave() {
    const currentMedia = this.getCurrentMedia();

    if (currentMedia && currentMedia.tagName === "IMG") {
      this.resetZoom(currentMedia);
    }

    this.startAutoplay();

    return true;
  }

  resetZoom(media = null) {
    const mediaItems = media ? [media] : this.getMediaItems();

    for (const item of mediaItems) {
      if (!(item instanceof HTMLElement)) continue;

      item.classList.remove("is-zooming");
      item.style.transformOrigin = "50% 50%";
      item.style.transform = "scale(1)";
    }

    return true;
  }

  /* ============================================================================
    DOM HELPERS
  ============================================================================ */

  getRoot() {
    return document.getElementById(this.rootId);
  }

  getThumbsRoot() {
    return document.getElementById(this.thumbsId);
  }

  getMediaItems() {
    const root = this.getRoot();

    if (!root) return [];

    return Array.from(root.querySelectorAll(".preview-media"));
  }

  getCurrentMedia() {
    const mediaItems = this.getMediaItems();

    if (mediaItems.length === 0) return null;

    return mediaItems[this.currentIndex] || null;
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

  /* ============================================================================
    AUTOPLAY
  ============================================================================ */

  stopAutoplay() {
    if (!this.autoTimer) return false;

    clearInterval(this.autoTimer);
    this.autoTimer = null;

    return true;
  }

  startAutoplay() {
    this.stopAutoplay();

    const mediaItems = this.getMediaItems();

    if (mediaItems.length <= 1) return false;

    this.autoTimer = window.setInterval(() => {
      this.nextImage();
    }, this.intervalMs);

    return true;
  }

  /* ============================================================================
    GALLERY
  ============================================================================ */

  refreshGallery(keepIndex = false) {
    const mediaItems = this.getMediaItems();

    if (mediaItems.length === 0) {
      this.clearGallery();
      return false;
    }

    if (keepIndex) {
      this.currentIndex = this.normaliseIndex(
        this.currentIndex,
        mediaItems.length
      );
    } else {
      this.currentIndex = 0;
    }

    this.renderThumbs();
    this.showCurrentMedia();
    this.startAutoplay();

    return true;
  }

  clearGallery() {
    this.stopAutoplay();
    this.currentIndex = 0;

    const thumbsRoot = this.getThumbsRoot();

    if (thumbsRoot) {
      thumbsRoot.innerHTML = "";
    }

    return true;
  }

  showCurrentMedia() {
    const mediaItems = this.getMediaItems();

    if (mediaItems.length === 0) return false;

    this.currentIndex = this.normaliseIndex(
      this.currentIndex,
      mediaItems.length
    );

    for (let index = 0; index < mediaItems.length; index++) {
      const media = mediaItems[index];
      const isActive = index === this.currentIndex;

      this.resetZoom(media);

      media.classList.toggle("is-active", isActive);
      media.hidden = !isActive;
      media.style.display = isActive ? "block" : "none";

      if (media.tagName === "VIDEO" && !isActive) {
        media.pause();
      }
    }

    this.updateThumbStates();

    return true;
  }

  /* ============================================================================
    NAVIGATION
  ============================================================================ */

  nextImage() {
    const mediaItems = this.getMediaItems();

    if (mediaItems.length <= 1) return false;

    this.currentIndex = this.normaliseIndex(
      this.currentIndex + 1,
      mediaItems.length
    );

    this.showCurrentMedia();
    this.startAutoplay();

    return true;
  }

  prevImage() {
    const mediaItems = this.getMediaItems();

    if (mediaItems.length <= 1) return false;

    this.currentIndex = this.normaliseIndex(
      this.currentIndex - 1,
      mediaItems.length
    );

    this.showCurrentMedia();
    this.startAutoplay();

    return true;
  }

  goToImage(index) {
    const mediaItems = this.getMediaItems();

    if (mediaItems.length === 0) return false;

    this.currentIndex = this.normaliseIndex(
      Number(index),
      mediaItems.length
    );

    this.showCurrentMedia();
    this.startAutoplay();

    return true;
  }

  /* ============================================================================
    THUMBNAILS
  ============================================================================ */

  renderThumbs() {
    const thumbsRoot = this.getThumbsRoot();
    const mediaItems = this.getMediaItems();

    if (!thumbsRoot) return false;

    thumbsRoot.innerHTML = "";

    for (let index = 0; index < mediaItems.length; index++) {
      const media = mediaItems[index];
      const button = document.createElement("button");

      button.type = "button";
      button.className = "sp-thumb";
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-label", `Show media ${index + 1}`);
      button.setAttribute("aria-pressed", "false");

      if (media.tagName === "IMG") {
        const thumbnail = document.createElement("img");

        thumbnail.src = media.currentSrc || media.src;
        thumbnail.alt = media.alt || `Preview image ${index + 1}`;
        thumbnail.loading = "lazy";
        thumbnail.decoding = "async";
        thumbnail.draggable = false;

        button.appendChild(thumbnail);
      } else if (media.tagName === "VIDEO") {
        const videoLabel = document.createElement("span");

        videoLabel.className = "sp-thumb-video";
        videoLabel.textContent = `Video ${index + 1}`;

        button.appendChild(videoLabel);
      } else {
        button.textContent = `Media ${index + 1}`;
      }

      button.addEventListener("click", () => {
        this.goToImage(index);
      });

      thumbsRoot.appendChild(button);
    }

    this.updateThumbStates();

    return true;
  }

  updateThumbStates() {
    const thumbsRoot = this.getThumbsRoot();

    if (!thumbsRoot) return false;

    const thumbnails = Array.from(
      thumbsRoot.querySelectorAll(".sp-thumb")
    );

    for (let index = 0; index < thumbnails.length; index++) {
      const isActive = index === this.currentIndex;

      thumbnails[index].classList.toggle("is-active", isActive);
      thumbnails[index].setAttribute(
        "aria-pressed",
        isActive ? "true" : "false"
      );
    }

    return true;
  }
}

/* ============================================================================
  GLOBAL INSTANCE
============================================================================ */

let previewGallery = null;

function createPreviewGallery() {
  if (window.previewGallery instanceof PreviewGallery) {
    previewGallery = window.previewGallery;
    return;
  }

  previewGallery = new PreviewGallery({
    rootId: "wrap-images-group",
    thumbsId: "sp_thumbs",
    intervalMs: 5000,
    zoomScale: 2
  });

  window.previewGallery = previewGallery;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createPreviewGallery);
} else {
  createPreviewGallery();
}
