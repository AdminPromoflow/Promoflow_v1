// images.js

class Images {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;
    this.container = null;
  }

  init() {
    this.container = document.getElementById("wrap-images-group");
    return Boolean(this.container);
  }

  renderImage(data = [], typeVariation = {}) {
    return this.renderImages(data, typeVariation);
  }

  renderImages(imagesOnlyOfType = [], typeVariation = {}) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const selectedVariationId = Number(
      String(this.previewLogic?.variations?.getSelectVariation?.() ?? "")
        .replace(/^variation_id_/, "")
    );

    if (!Number.isFinite(selectedVariationId)) return false;

    const typeId = String(typeVariation?.type_id ?? "").trim();

    if (!typeId) return false;

    this.deleteImages(typeId);

    const wrapper = document.createElement("div");

    wrapper.className = "wrap-images";
    wrapper.id = `wrap-images-${typeId}`;
    wrapper.dataset.typeId = typeId;

    for (let index = 0; index < imagesOnlyOfType.length; index++) {
      const imageData = imagesOnlyOfType[index];

      if (Number(imageData?.variation_id) !== selectedVariationId) continue;

      const source = this.buildImageSource(imageData?.link);

      if (!source) continue;

      const image = document.createElement("img");

      image.className = "preview-media";
      image.src = source;
      image.alt = `Preview image ${index + 1}`;
      image.loading = "lazy";
      image.decoding = "async";

      wrapper.appendChild(image);
    }

    if (wrapper.children.length === 0) return false;

    this.container.appendChild(wrapper);

    window.previewGallery?.refreshGallery?.(true);

    return true;
  }

  buildImageSource(link = "") {
    const rawLink = String(link ?? "").trim().replace(/^\/+/, "");

    if (!rawLink) return "";

    if (
      rawLink.startsWith("http") ||
      rawLink.startsWith("data:") ||
      rawLink.startsWith("blob:")
    ) {
      return rawLink;
    }

    if (rawLink.startsWith("controller/")) {
      return `../../dot63/${rawLink}`;
    }

    return `../../dot63/controller/${rawLink}`;
  }

  deleteImages(typeId) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const safeTypeId = String(typeId ?? "").trim();

    if (!safeTypeId) return false;

    document.getElementById(`wrap-images-${safeTypeId}`)?.remove();

    window.previewGallery?.refreshGallery?.(true);

    return true;
  }

  clearImages() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.container.replaceChildren();

    window.previewGallery?.clearGallery?.();

    return true;
  }

  clearImage() {
    return this.clearImages();
  }
}

window.Images = Images;
