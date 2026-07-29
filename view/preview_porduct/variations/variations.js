// variations.js

class Variations {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;
    this.container = null;
    this.variationSelected = null;
    this.shouldDeleteItems = false;
    this.requestVersion = 0;
    this.automaticSelections = new Set();
  }

  init() {
    this.container = document.getElementById("wrap-variations-group");

    if (!this.container) return false;

    this.bindEvents();
    return true;
  }

  reset() {
    this.requestVersion++;
    this.variationSelected = null;
    this.shouldDeleteItems = false;
    this.automaticSelections.clear();
  }

  bindEvents() {
    if (!this.container || this.container.dataset.bound === "1") return false;

    this.container.dataset.bound = "1";

    this.container.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const button = target.closest(".var-option[id^='variation_id_']");

      if (!button || !this.container.contains(button)) return;

      event.preventDefault();
      this.SelectVariation(button.id);
    });

    return true;
  }

  fetchChildVariationsById(variationId, version = this.requestVersion) {
    const safeVariationId = String(variationId ?? "").trim();

    if (!safeVariationId) {
      console.warn("No variation_id provided");
      return false;
    }

    const url = "../../controller/dot63/requests_63_api.php";

    const data = {
      action: "get_variation_children_by_id",
      variation_id: safeVariationId
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }

        return response.text();
      })
      .then((text) => {
        if (version !== this.requestVersion) return;

        const json = JSON.parse(text);

        const variationTypes = Array.isArray(json?.variationTypes) ? json.variationTypes : [];
        const childVariations = Array.isArray(json?.childVariations) ? json.childVariations : [];
        const variationTypesForDelete = Array.isArray(json?.variationTypesForDelete)
          ? json.variationTypesForDelete
          : [];

        const currentVariationData = json?.currentVariationData ?? {};
        const currentTypeId = variationTypesForDelete?.[0]?.type_id ?? null;

        this.shouldDeleteItems = variationTypesForDelete.length > 0;

        if (variationTypesForDelete.length > 0) {
          this.organizeVariationsForDelete(variationTypesForDelete, currentTypeId);
        }

        this.organizeCurrentVariation(currentVariationData);

        if (childVariations.length > 0 && variationTypes.length > 0) {
          this.organizeVariationsForRender(childVariations, variationTypes);
          this.selectFirstChildVariation(childVariations, variationTypes, safeVariationId, version);
          return;
        }

        this.previewLogic?.prices?.updateVariationPrices?.();
        this.previewLogic?.prices?.selectFirstAvailablePrice?.();

        window.loader?.hide?.();
      })
      .catch((error) => {
        if (version === this.requestVersion) {
          console.error("Error fetching preview variations:", error);
        }
      });

    return true;
  }

  organizeCurrentVariation(currentVariationData = {}) {
    try {
      const variation = currentVariationData?.variation ?? null;

      if (!variation) return false;

      const variationId = String(variation?.variation_id ?? "").trim();
      const typeId = String(variation?.type_id ?? "").trim();
      const typeName = String(variation?.type_name ?? "").trim();

      if (!variationId || !typeId || !typeName) return false;

      this.setSelectVariation(`variation_id_${variationId}`);

      const typeVariation = {
        type_id: typeId,
        type_name: typeName
      };

      const imagesOnlyOfType = Array.isArray(currentVariationData?.images)
        ? currentVariationData.images.map((image) => ({
            ...image,
            variation_id: variationId
          }))
        : [];

      const itemsOnlyOfType = Array.isArray(currentVariationData?.items)
        ? currentVariationData.items.map((item) => ({
            ...item,
            variation_id: variationId
          }))
        : [];

      const pricesOnlyOfType = Array.isArray(currentVariationData?.prices)
        ? currentVariationData.prices.map((price) => ({
            ...price,
            variation_id: variationId,
            price_display_mode: variation?.price_display_mode ?? null
          }))
        : [];

      const artworksOnlyOfType = [];
      const artwork = currentVariationData?.artwork ?? null;

      if (artwork) {
        const pdf = String(artwork?.pdf_artwork ?? "").trim();
        const name = String(artwork?.name_pdf_artwork ?? "").trim();

        if (pdf || name) {
          artworksOnlyOfType.push({
            ...artwork,
            variation_id: variationId
          });
        }
      }

      this.previewLogic?.items?.deleteItems?.(typeId);
      this.previewLogic?.images?.deleteImages?.(typeId);
      this.previewLogic?.prices?.deletePrices?.(typeId);
      this.previewLogic?.artwork?.deleteArtwork?.(typeId);

      if (imagesOnlyOfType.length > 0) {
        this.previewLogic?.images?.renderImages?.(imagesOnlyOfType, typeVariation);
      }

      if (itemsOnlyOfType.length > 0) {
        this.previewLogic?.items?.renderItems?.(itemsOnlyOfType, typeVariation);
      }

      if (pricesOnlyOfType.length > 0) {
        this.previewLogic?.prices?.renderPrices?.(pricesOnlyOfType, typeVariation);
      }

      if (artworksOnlyOfType.length > 0) {
        this.previewLogic?.artwork?.renderArtwork?.(artworksOnlyOfType, typeVariation);
      }

      return true;
    } catch (error) {
      console.error("Error in organizeCurrentVariation:", error);
      return false;
    }
  }

  organizeVariationsForDelete(variationTypes = [], currentTypeId = null) {
    if (!Array.isArray(variationTypes) || variationTypes.length === 0) return true;

    const current = String(currentTypeId ?? "");

    for (const variationType of variationTypes) {
      const typeId = String(variationType?.type_id ?? "").trim();

      if (!typeId) continue;

      this.previewLogic?.items?.deleteItems?.(typeId);
      this.previewLogic?.images?.deleteImages?.(typeId);
      this.previewLogic?.prices?.deletePrices?.(typeId);
      this.previewLogic?.artwork?.deleteArtwork?.(typeId);

      if (typeId !== current) {
        this.deleteVariations(typeId);
      }
    }

    return true;
  }

  organizeVariationsForRender(childVariations = [], variationTypes = []) {
    if (!Array.isArray(childVariations) || childVariations.length === 0) return false;
    if (!Array.isArray(variationTypes) || variationTypes.length === 0) return false;

    for (const typeVariation of variationTypes) {
      const typeId = String(typeVariation?.type_id ?? "").trim();
      const typeName = String(typeVariation?.type_name ?? "").trim();

      if (!typeId || !typeName) continue;

      const variationsOnlyOfType = [];
      const itemsOnlyOfType = [];
      const imagesOnlyOfType = [];
      const pricesOnlyOfType = [];
      const artworksOnlyOfType = [];

      for (const row of childVariations) {
        const variation = row?.variation;

        if (!variation) continue;

        const variationTypeId = String(variation?.type_id ?? "").trim();
        const variationTypeName = String(variation?.type_name ?? "").trim();

        if (variationTypeId !== typeId && variationTypeName !== typeName) continue;

        variationsOnlyOfType.push(variation);

        if (Array.isArray(row?.items)) {
          itemsOnlyOfType.push(...row.items.map((item) => ({
            ...item,
            variation_id: variation?.variation_id ?? null
          })));
        }

        if (Array.isArray(row?.images)) {
          imagesOnlyOfType.push(...row.images.map((image) => ({
            ...image,
            variation_id: variation?.variation_id ?? null
          })));
        }

        if (Array.isArray(row?.prices)) {
          pricesOnlyOfType.push(...row.prices.map((price) => ({
            ...price,
            variation_id: variation?.variation_id ?? null,
            price_display_mode: variation?.price_display_mode ?? null
          })));
        }

        const artwork = row?.artwork ?? null;

        if (artwork) {
          const pdf = String(artwork?.pdf_artwork ?? "").trim();
          const name = String(artwork?.name_pdf_artwork ?? "").trim();

          if (pdf || name) {
            artworksOnlyOfType.push({
              ...artwork,
              variation_id: variation?.variation_id ?? null
            });
          }
        }
      }

      if (variationsOnlyOfType.length === 0) continue;

      this.renderVariations(variationsOnlyOfType, typeVariation);

      if (imagesOnlyOfType.length > 0) {
        this.previewLogic?.images?.renderImages?.(imagesOnlyOfType, typeVariation);
      }

      if (itemsOnlyOfType.length > 0) {
        this.previewLogic?.items?.renderItems?.(itemsOnlyOfType, typeVariation);
      }

      if (pricesOnlyOfType.length > 0) {
        this.previewLogic?.prices?.renderPrices?.(pricesOnlyOfType, typeVariation);
      }

      if (artworksOnlyOfType.length > 0) {
        this.previewLogic?.artwork?.renderArtwork?.(artworksOnlyOfType, typeVariation);
      }
    }

    return true;
  }

  renderVariations(childVariationsOfType = [], typeVariation = {}) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const typeId = String(typeVariation?.type_id ?? "").trim();
    const typeName = String(typeVariation?.type_name ?? "").trim();

    if (!typeId || !typeName || childVariationsOfType.length === 0) return false;

    this.deleteVariations(typeId);

    const wrapper = document.createElement("div");

    wrapper.className = "wrap-variations";
    wrapper.dataset.typeId = typeId;

    const labelId = `var_label_size_${typeId}`;

    wrapper.setAttribute("aria-labelledby", labelId);

    const label = document.createElement("div");

    label.className = "var-label";

    const name = document.createElement("span");

    name.className = "var-name";
    name.textContent = typeName;

    const selectedLabel = document.createElement("strong");

    selectedLabel.id = labelId;
    selectedLabel.textContent = "";

    label.appendChild(name);
    label.appendChild(selectedLabel);

    const options = document.createElement("div");

    options.className = "var-options";
    options.id = `var-options-${typeId}`;

    for (const variation of childVariationsOfType) {
      const button = this.createVariationButton(variation);

      if (button) {
        options.appendChild(button);
      }
    }

    wrapper.appendChild(label);
    wrapper.appendChild(options);

    this.container.appendChild(wrapper);

    return true;
  }

  createVariationButton(variation = {}) {
    const variationId = String(variation?.variation_id ?? "").trim();

    if (!variationId) return null;

    const label = String(variation?.name ?? "").trim();
    const rawImage = String(variation?.image ?? "").trim().replace(/^\/+/, "");

    const imageSource = rawImage
      ? (
          rawImage.startsWith("http") ||
          rawImage.startsWith("data:") ||
          rawImage.startsWith("blob:")
            ? rawImage
            : (
                rawImage.startsWith("controller/")
                  ? `../../dot63/${rawImage}`
                  : `../../dot63/controller/${rawImage}`
              )
        )
      : "../../view/preview_porduct/img/icon_product.png";

    const button = document.createElement("button");

    button.type = "button";
    button.id = `variation_id_${variationId}`;
    button.className = "var-option js-scale-in";
    button.dataset.variationLabel = label;
    button.setAttribute("aria-pressed", "false");

    const image = document.createElement("img");

    image.className = "var-thumb";
    image.src = imageSource;
    image.alt = label || "Option sample";
    image.loading = "lazy";
    image.decoding = "async";

    const main = document.createElement("span");

    main.className = "opt-main";
    main.textContent = label;

    button.appendChild(image);
    button.appendChild(main);

    return button;
  }

  selectFirstChildVariation(childVariations = [], variationTypes = [], currentVariationId = "", version = this.requestVersion) {
    if (version !== this.requestVersion) return false;

    const firstTypeId = String(variationTypes?.[0]?.type_id ?? "").trim();

    const firstRow = childVariations.find((row) => {
      const variation = row?.variation;
      const variationId = String(variation?.variation_id ?? "").trim();
      const typeId = String(variation?.type_id ?? "").trim();

      if (!variationId || variationId === String(currentVariationId)) return false;
      if (firstTypeId && typeId !== firstTypeId) return false;

      return !this.automaticSelections.has(variationId);
    });

    const variationId = String(firstRow?.variation?.variation_id ?? "").trim();

    if (!variationId) return false;

    this.automaticSelections.add(variationId);

    const buttonId = `variation_id_${variationId}`;

    window.setTimeout(() => {
      if (version !== this.requestVersion) return;

      this.SelectVariation(buttonId, true);
    }, 0);

    return true;
  }

  SelectVariation(domId = "", automatic = false) {
    const id = String(domId ?? "").trim();

    if (!id) return false;

    const variationId = id.replace(/^variation_id_/, "").trim();
    const button = document.getElementById(id);

    if (!variationId || !button) return false;

    if (!automatic) {
      this.requestVersion++;
      this.automaticSelections.clear();
      this.automaticSelections.add(variationId);
    }

    this.setSelectVariation(id);
    this.markSelectedButton(button);

    this.fetchChildVariationsById(variationId, this.requestVersion);

    return true;
  }

  markSelectedButton(button) {
    const wrapper = button.closest(".wrap-variations");

    if (!wrapper) return false;

    const buttons = wrapper.querySelectorAll(".var-option");

    for (const item of buttons) {
      const selected = item === button;

      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", selected ? "true" : "false");
    }

    const selectedLabel = wrapper.querySelector(".var-label strong");

    if (selectedLabel) {
      selectedLabel.textContent =
        button.dataset.variationLabel ||
        button.querySelector(".opt-main")?.textContent?.trim() ||
        "";
    }

    return true;
  }

  deleteVariations(typeId) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const safeTypeId = String(typeId ?? "").trim();

    if (!safeTypeId) return false;

    const wrapper = this.container.querySelector(
      `.wrap-variations[data-type-id="${this.escapeCss(safeTypeId)}"]`
    );

    wrapper?.remove();

    return true;
  }

  clearVariations() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.container.replaceChildren();
    this.variationSelected = null;

    return true;
  }

  setSelectVariation(domId = "") {
    this.variationSelected = String(domId ?? "").trim() || null;
  }

  getSelectVariation() {
    return this.variationSelected;
  }

  getSelectedVariationId() {
    const selected = this.getSelectVariation();

    if (!selected) return null;

    const id = Number(String(selected).replace(/^variation_id_/, ""));

    return Number.isFinite(id) ? id : null;
  }

  getShouldDeleteItems() {
    return this.shouldDeleteItems;
  }

  escapeCss(value = "") {
    const text = String(value ?? "");

    if (window.CSS?.escape) {
      return window.CSS.escape(text);
    }

    return text.replace(/["\\]/g, "\\$&");
  }
}

window.Variations = Variations;
