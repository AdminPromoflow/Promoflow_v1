// variations.js

class Variations {
  constructor(previewLogic) {
    this.previewLogic = previewLogic;
    this.variationSelected = null;
    this.shouldDeleteItems = false;
    this.autoLoadedVariationIds = new Set();
    this.requestVersion = 0;
    this.loadedVariationTypes = new Set();
    this.isInitialised = false;
  }

  /* ==========================================================================
    INITIALISE
  ========================================================================== */

  init() {
    if (this.isInitialised) return;

    const parent = this.getVariationsParent();

    if (!parent) {
      console.warn("Variation group container was not found.");
      return;
    }

    this.isInitialised = true;
    this.bindVariationEvents();
  }

  reset() {
    this.requestVersion++;
    this.variationSelected = null;
    this.shouldDeleteItems = false;
    this.autoLoadedVariationIds.clear();
    this.loadedVariationTypes.clear();
  }

  getVariationsParent() {
    return document.getElementById("wrap-variations-group");
  }

  /* ==========================================================================
    EVENT DELEGATION
  ========================================================================== */

  bindVariationEvents() {
    const parent = this.getVariationsParent();

    if (!parent || parent.dataset.variationsBound === "1") return false;

    parent.dataset.variationsBound = "1";

    parent.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const optionButton = target.closest(
        ".var-option[id^='variation_id_']"
      );

      if (optionButton && parent.contains(optionButton)) {
        event.preventDefault();
        event.stopPropagation();

        this.selectVariation(optionButton.id);
        return;
      }

      const collapseHeader = target.closest(".var-collapse-header");

      if (
        collapseHeader &&
        parent.contains(collapseHeader)
      ) {
        event.preventDefault();

        const group = collapseHeader.closest(".wrap-variations");

        this.toggleVariationGroup(group);
      }
    });

    return true;
  }

  toggleVariationGroup(group) {
    if (!group) return false;

    const isOpen = group.classList.contains("is-open");

    if (isOpen) {
      this.closeVariationGroup(group);
    } else {
      this.openVariationGroup(group);
    }

    return true;
  }

  openVariationGroup(group) {
    if (!group) return false;

    const groups = document.querySelectorAll(
      "#wrap-variations-group .wrap-variations.is-collapsible"
    );

    for (const item of groups) {
      if (item === group) continue;

      this.closeVariationGroup(item);
    }

    group.classList.add("is-open");

    const header = group.querySelector(".var-collapse-header");

    if (header) {
      header.setAttribute("aria-expanded", "true");
    }

    return true;
  }

  closeVariationGroup(group) {
    if (!group) return false;

    group.classList.remove("is-open");

    const header = group.querySelector(".var-collapse-header");

    if (header) {
      header.setAttribute("aria-expanded", "false");
    }

    return true;
  }

  updateVariationHeader(group, selectedText = "") {
    if (!group) return false;

    const safeText = String(selectedText ?? "").trim();
    const selectedLabel = group.querySelector(
      ".js-selected-variation-label"
    );

    const summaryPill = group.querySelector(
      ".variation-summary-pill"
    );

    if (selectedLabel) {
      selectedLabel.textContent = safeText || "Select option";
    }

    if (summaryPill) {
      summaryPill.textContent = safeText
        ? `Selected: ${safeText}`
        : "Select an option";
    }

    return true;
  }

  /* ==========================================================================
    FETCH VARIATIONS
  ========================================================================== */

  async fetchChildVariationsById(variationId, version = this.requestVersion) {
    const currentVariationId = String(variationId ?? "").trim();

    if (!currentVariationId) {
      console.warn("No variation_id provided.");
      return false;
    }

    const url = "../../controller/order/product.php";

    const data = {
      action: "get_variation_children_by_id",
      variation_id: currentVariationId
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      const text = await response.text();
      const json = this.parseJson(text);

      if (!json || typeof json !== "object") {
        throw new Error("Invalid variation response.");
      }

      if (version !== this.requestVersion) {
        return false;
      }

      const variationTypes = Array.isArray(json.variationTypes)
        ? json.variationTypes
        : [];

      const childVariations = Array.isArray(json.childVariations)
        ? json.childVariations
        : [];

      const variationTypesForDelete = Array.isArray(
        json.variationTypesForDelete
      )
        ? json.variationTypesForDelete
        : [];

      const currentVariationData =
        json.currentVariationData &&
        typeof json.currentVariationData === "object" &&
        !Array.isArray(json.currentVariationData)
          ? json.currentVariationData
          : {};

      this.shouldDeleteItems = variationTypesForDelete.length > 0;

      this.organizeCurrentVariation(currentVariationData);

      if (
        childVariations.length > 0 &&
        variationTypes.length > 0
      ) {
        this.organizeVariationsForRender(
          childVariations,
          variationTypes
        );

        this.autoLoadFirstChildVariation(
          childVariations,
          variationTypes,
          currentVariationId,
          version
        );

        return true;
      }

      this.finishPrices();

      return true;
    } catch (error) {
      if (version === this.requestVersion) {
        console.error(
          "Error fetching child variations:",
          error
        );
      }

      return false;
    }
  }

  /* ==========================================================================
    AUTOMATIC SELECTION
  ========================================================================== */

  autoLoadFirstChildVariation(
    childVariations = [],
    variationTypes = [],
    currentVariationId = "",
    version = this.requestVersion
  ) {
    if (
      version !== this.requestVersion ||
      !Array.isArray(childVariations) ||
      childVariations.length === 0
    ) {
      return false;
    }

    const currentId = String(currentVariationId ?? "").trim();
    const firstTypeName = String(
      variationTypes?.[0]?.type_name ?? ""
    ).trim();

    let selectedRow = null;

    for (const row of childVariations) {
      const variation = row?.variation;

      if (!variation) continue;

      const childVariationId = String(
        variation.variation_id ?? ""
      ).trim();

      const childTypeName = String(
        variation.type_name ?? ""
      ).trim();

      if (!childVariationId) continue;
      if (childVariationId === currentId) continue;
      if (this.autoLoadedVariationIds.has(childVariationId)) continue;

      if (
        firstTypeName &&
        childTypeName !== firstTypeName
      ) {
        continue;
      }

      selectedRow = row;
      break;
    }

    if (!selectedRow) {
      for (const row of childVariations) {
        const childVariationId = String(
          row?.variation?.variation_id ?? ""
        ).trim();

        if (!childVariationId) continue;
        if (childVariationId === currentId) continue;
        if (this.autoLoadedVariationIds.has(childVariationId)) continue;

        selectedRow = row;
        break;
      }
    }

    const nextVariationId = String(
      selectedRow?.variation?.variation_id ?? ""
    ).trim();

    if (!nextVariationId) return false;

    const domId = `variation_id_${nextVariationId}`;
    const button = document.getElementById(domId);

    if (!button) return false;

    this.autoLoadedVariationIds.add(nextVariationId);

    window.setTimeout(() => {
      if (version !== this.requestVersion) return;

      this.selectVariation(
        domId,
        true,
        selectedRow,
        version
      );
    }, 0);

    return true;
  }

  /* ==========================================================================
    CURRENT VARIATION
  ========================================================================== */

  organizeCurrentVariation(currentVariationData = {}) {
    try {
      const variation = currentVariationData?.variation;

      if (!variation) return false;

      const variationId = String(
        variation.variation_id ?? ""
      ).trim();

      const typeId = String(
        variation.type_id ?? ""
      ).trim();

      const typeName = String(
        variation.type_name ?? ""
      ).trim();

      if (!variationId || !typeId || !typeName) {
        return false;
      }

      this.setSelectVariation(
        `variation_id_${variationId}`
      );

      return this.renderVariationAssets({
        variation: variation,
        images: Array.isArray(currentVariationData.images)
          ? currentVariationData.images
          : [],
        items: Array.isArray(currentVariationData.items)
          ? currentVariationData.items
          : [],
        prices: Array.isArray(currentVariationData.prices)
          ? currentVariationData.prices
          : [],
        artwork: currentVariationData.artwork ?? null
      });
    } catch (error) {
      console.error(
        "Error organising current variation:",
        error
      );

      return false;
    }
  }

  /* ==========================================================================
    VARIATION ASSETS
  ========================================================================== */

  renderVariationAssets(row = {}) {
    try {
      const variation = row?.variation;

      if (!variation) return false;

      const variationId = String(
        variation.variation_id ?? ""
      ).trim();

      const typeId = String(
        variation.type_id ?? ""
      ).trim();

      const typeName = String(
        variation.type_name ?? ""
      ).trim();

      if (!variationId || !typeId || !typeName) {
        return false;
      }

      const typeVariation = {
        type_id: typeId,
        type_name: typeName
      };

      const imagesOnlyOfType = Array.isArray(row.images)
        ? row.images.map((imageData) => ({
            ...imageData,
            variation_id: variationId
          }))
        : [];

      const itemsOnlyOfType = Array.isArray(row.items)
        ? row.items.map((itemData) => ({
            ...itemData,
            variation_id: variationId
          }))
        : [];

      const pricesOnlyOfType = Array.isArray(row.prices)
        ? row.prices.map((priceData) => ({
            ...priceData,
            variation_id: variationId,
            price_display_mode:
              variation.price_display_mode ?? null
          }))
        : [];

      const artworksOnlyOfType = [];
      const artworkData = row.artwork ?? null;

      if (
        artworkData &&
        typeof artworkData === "object"
      ) {
        const pdf = String(
          artworkData.pdf_artwork ?? ""
        ).trim();

        const name = String(
          artworkData.name_pdf_artwork ?? ""
        ).trim();

        if (pdf || name) {
          artworksOnlyOfType.push({
            ...artworkData,
            variation_id: variationId
          });
        }
      }

      this.deleteAssetsByType(typeId);

      if (
        imagesOnlyOfType.length > 0 &&
        window.images &&
        typeof window.images.renderImages === "function"
      ) {
        window.images.renderImages(
          imagesOnlyOfType,
          typeVariation
        );
      }

      if (
        itemsOnlyOfType.length > 0 &&
        window.items &&
        typeof window.items.renderItems === "function"
      ) {
        window.items.renderItems(
          itemsOnlyOfType,
          typeVariation
        );
      }

      if (
        pricesOnlyOfType.length > 0 &&
        window.prices &&
        typeof window.prices.renderPrices === "function"
      ) {
        window.prices.renderPrices(
          pricesOnlyOfType,
          typeVariation
        );
      }

      if (
        artworksOnlyOfType.length > 0 &&
        window.artwork &&
        typeof window.artwork.renderArtwork === "function"
      ) {
        window.artwork.renderArtwork(
          artworksOnlyOfType,
          typeVariation
        );
      }

      window.previewGallery?.refreshGallery?.(true);

      return true;
    } catch (error) {
      console.error(
        "Error rendering variation assets:",
        error
      );

      return false;
    }
  }

  deleteAssetsByType(typeId) {
    if (
      window.images &&
      typeof window.images.deleteImages === "function"
    ) {
      window.images.deleteImages(typeId);
    }

    if (
      window.items &&
      typeof window.items.deleteItems === "function"
    ) {
      window.items.deleteItems(typeId);
    }

    if (
      window.prices &&
      typeof window.prices.deletePrices === "function"
    ) {
      window.prices.deletePrices(typeId);
    }

    if (
      window.artwork &&
      typeof window.artwork.deleteArtwork === "function"
    ) {
      window.artwork.deleteArtwork(typeId);
    }
  }

  /* ==========================================================================
    ORGANISE VARIATIONS
  ========================================================================== */

  organizeVariationsForRender(
    childVariations = [],
    variationTypes = []
  ) {
    if (
      !Array.isArray(childVariations) ||
      childVariations.length === 0 ||
      !Array.isArray(variationTypes) ||
      variationTypes.length === 0
    ) {
      return false;
    }

    for (const typeVariation of variationTypes) {
      const typeId = String(
        typeVariation?.type_id ?? ""
      ).trim();

      const typeName = String(
        typeVariation?.type_name ?? ""
      ).trim();

      if (!typeId || !typeName) continue;

      const variationsOnlyOfType = [];

      for (const row of childVariations) {
        const variation = row?.variation;

        if (!variation) continue;

        const variationTypeId = String(
          variation.type_id ?? ""
        ).trim();

        const variationTypeName = String(
          variation.type_name ?? ""
        ).trim();

        const sameType =
          variationTypeId === typeId ||
          variationTypeName === typeName;

        if (!sameType) continue;

        variationsOnlyOfType.push(variation);
      }

      if (variationsOnlyOfType.length === 0) continue;

      this.renderVariations(
        variationsOnlyOfType,
        typeVariation
      );
    }

    return true;
  }

  /* ==========================================================================
    RENDER VARIATION GROUP
  ========================================================================== */

  renderVariations(
    childVariationsOfType = [],
    typeVariation = {}
  ) {
    try {
      const parent = this.getVariationsParent();

      if (
        !parent ||
        !Array.isArray(childVariationsOfType) ||
        childVariationsOfType.length === 0
      ) {
        return false;
      }

      const typeId = String(
        typeVariation?.type_id ?? ""
      ).trim();

      const typeName = String(
        typeVariation?.type_name ?? ""
      ).trim();

      if (!typeId || !typeName) return false;

      const safeTypeId = this.escapeCss(typeId);
      const labelId = `var-label-${typeId}`;
      const optionsId = `var-options-${typeId}`;
      const bodyId = `var-collapse-body-${typeId}`;

      const existing = parent.querySelector(
        `.wrap-variations[data-type-id="${safeTypeId}"]`
      );

      if (existing) {
        existing.remove();
      }

      const group = document.createElement("div");

      group.className = "wrap-variations is-collapsible";
      group.dataset.typeId = typeId;
      group.setAttribute("aria-labelledby", labelId);

      const header = document.createElement("button");

      header.type = "button";
      header.className = "var-collapse-header";
      header.setAttribute("aria-expanded", "false");
      header.setAttribute("aria-controls", bodyId);

      const left = document.createElement("span");
      left.className = "var-collapse-left";

      const title = document.createElement("span");
      title.className = "var-collapse-title";

      const name = document.createElement("span");
      name.className = "var-name";
      name.textContent = typeName;

      const selectedLabel = document.createElement("strong");
      selectedLabel.id = labelId;
      selectedLabel.className = "js-selected-variation-label";
      selectedLabel.textContent = "Select option";

      title.appendChild(name);
      title.appendChild(selectedLabel);

      const summaryPill = document.createElement("span");
      summaryPill.className = "variation-summary-pill";
      summaryPill.textContent = "Select an option";

      const hint = document.createElement("span");
      hint.className = "var-collapse-hint";
      hint.textContent = "Click to view available options";

      left.appendChild(title);
      left.appendChild(summaryPill);
      left.appendChild(hint);

      const icon = document.createElement("span");
      icon.className = "var-collapse-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "⌄";

      header.appendChild(left);
      header.appendChild(icon);

      const body = document.createElement("div");
      body.className = "var-collapse-body";
      body.id = bodyId;

      const inner = document.createElement("div");
      inner.className = "var-collapse-inner";

      const options = document.createElement("div");
      options.className = "var-options";
      options.id = optionsId;

      for (const variation of childVariationsOfType) {
        const button = this.createVariationButton(
          variation
        );

        if (button) {
          options.appendChild(button);
        }
      }

      if (options.children.length === 0) {
        return false;
      }

      inner.appendChild(options);
      body.appendChild(inner);

      group.appendChild(header);
      group.appendChild(body);

      parent.appendChild(group);
      this.loadedVariationTypes.add(typeId);

      const groupsCount = parent.querySelectorAll(
        ".wrap-variations.is-collapsible"
      ).length;

      if (groupsCount === 1) {
        this.openVariationGroup(group);
      }

      return true;
    } catch (error) {
      console.error(
        "Error rendering variations:",
        error
      );

      return false;
    }
  }

  createVariationButton(variation = {}) {
    const variationId = String(
      variation?.variation_id ?? ""
    ).trim();

    const label = String(
      variation?.name ?? ""
    ).trim();

    if (!variationId) return null;

    const rawImage = String(
      variation?.image ?? ""
    )
      .trim()
      .replace(/^\/+/, "");

    const imageSource = this.buildControllerAssetUrl(
      rawImage,
      "../../view/preview_porduct/img/icon_product.png"
    );

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
    image.draggable = false;

    const main = document.createElement("span");

    main.className = "opt-main";
    main.textContent = label;

    button.appendChild(image);
    button.appendChild(main);

    return button;
  }

  /* ==========================================================================
    SELECT VARIATION
  ========================================================================== */

  selectVariation(
    domId = "",
    automatic = false,
    variationRow = null,
    version = this.requestVersion
  ) {
    const id = String(domId ?? "").trim();

    if (!id || version !== this.requestVersion) {
      return false;
    }

    const variationId = id
      .replace(/^variation_id_/, "")
      .trim();

    if (!variationId) return false;

    const button = document.getElementById(id);

    if (!button) return false;

    if (!automatic) {
      this.requestVersion++;
      version = this.requestVersion;

      this.autoLoadedVariationIds.clear();
      this.autoLoadedVariationIds.add(variationId);
    }

    const group = button.closest(".wrap-variations");

    if (group) {
      const variationButtons = group.querySelectorAll(
        ".var-option[id^='variation_id_']"
      );

      for (const item of variationButtons) {
        const isSelected = item === button;

        item.classList.toggle(
          "is-selected",
          isSelected
        );

        item.setAttribute(
          "aria-pressed",
          isSelected ? "true" : "false"
        );
      }

      const selectedText =
        button.dataset.variationLabel ||
        button.querySelector(".opt-main")?.textContent?.trim() ||
        "";

      this.updateVariationHeader(
        group,
        selectedText
      );
    }

    this.setSelectVariation(id);

    if (
      variationRow &&
      typeof variationRow === "object"
    ) {
      this.renderVariationAssets(variationRow);
    }

    this.fetchChildVariationsById(
      variationId,
      version
    );

    return true;
  }

  /* ==========================================================================
    PRICE FINALISATION
  ========================================================================== */

  finishPrices() {
    if (
      window.prices &&
      typeof window.prices.updateVariationPrices === "function"
    ) {
      window.prices.updateVariationPrices();
    }

    window.setTimeout(() => {
      if (!window.prices) return;

      if (
        typeof window.prices.selectFirstAvailablePrice === "function"
      ) {
        window.prices.selectFirstAvailablePrice();
        return;
      }

      if (
        typeof window.prices.selectFirstPrice === "function"
      ) {
        window.prices.selectFirstPrice();
      }
    }, 500);
  }

  /* ==========================================================================
    SELECTED VARIATION STATE
  ========================================================================== */

  setSelectVariation(domId = "") {
    this.variationSelected =
      String(domId ?? "").trim() || null;
  }

  getSelectVariation() {
    return this.variationSelected;
  }

  getSelectedVariationId() {
    const selectedVariation = this.getSelectVariation();

    if (!selectedVariation) return null;

    const variationId = Number(
      String(selectedVariation).replace(
        /^variation_id_/,
        ""
      )
    );

    return Number.isFinite(variationId)
      ? variationId
      : null;
  }

  getShouldDeleteItems() {
    return this.shouldDeleteItems;
  }

  /* ==========================================================================
    HELPERS
  ========================================================================== */

  parseJson(text = "") {
    try {
      return JSON.parse(String(text ?? ""));
    } catch (error) {
      console.error(
        "Invalid JSON response:",
        error,
        text
      );

      return null;
    }
  }

  escapeCss(value = "") {
    const text = String(value ?? "");

    if (
      window.CSS &&
      typeof window.CSS.escape === "function"
    ) {
      return window.CSS.escape(text);
    }

    return text.replace(
      /["\\]/g,
      "\\$&"
    );
  }

  escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  buildControllerAssetUrl(rawPath, fallback = "") {
    const path = String(rawPath ?? "")
      .trim()
      .replace(/^\/+/, "");

    if (!path) return fallback;

    if (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("data:") ||
      path.startsWith("blob:")
    ) {
      return path;
    }

    if (path.startsWith("controller/")) {
      return `../../${path}`;
    }

    return `../../controller/${path}`;
  }
}
