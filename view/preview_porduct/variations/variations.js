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

  /* ============================================================================
    INITIALISE
  ============================================================================ */

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

    return true;
  }

  /* ============================================================================
    EVENTS
  ============================================================================ */

  bindEvents() {
    if (!this.container || this.container.dataset.bound === "1") return false;

    this.container.dataset.bound = "1";

    this.container.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const collapseHeader = target.closest(".var-collapse-header");

      if (collapseHeader && this.container.contains(collapseHeader)) {
        event.preventDefault();

        const group = collapseHeader.closest(".wrap-variations");

        if (!group) return;

        this.toggleVariationGroup(group);
        return;
      }

      const variationButton = target.closest(".var-option[id^='variation_id_']");

      if (!variationButton || !this.container.contains(variationButton)) return;

      event.preventDefault();
      this.SelectVariation(variationButton.id);
    });

    return true;
  }

  /* ============================================================================
    COLLAPSE
  ============================================================================ */

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
    if (!group || !this.container) return false;

    const groups = this.container.querySelectorAll(
      ".wrap-variations.is-collapsible"
    );

    groups.forEach((item) => {
      if (item === group) return;

      this.closeVariationGroup(item);
    });

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

    const safeSelectedText = String(selectedText ?? "").trim();
    const selectedLabel = group.querySelector(".js-selected-variation-label");
    const summaryPill = group.querySelector(".variation-summary-pill");

    if (selectedLabel) {
      selectedLabel.textContent = safeSelectedText || "Select option";
    }

    if (summaryPill) {
      summaryPill.textContent = safeSelectedText
        ? `Selected: ${safeSelectedText}`
        : "Select an option";
    }

    return true;
  }

  openFirstVariationGroup() {
    if (!this.container) return false;

    const firstGroup = this.container.querySelector(
      ".wrap-variations.is-collapsible"
    );

    if (!firstGroup) return false;

    this.openVariationGroup(firstGroup);

    return true;
  }

  /* ============================================================================
    FETCH CHILD VARIATIONS
  ============================================================================ */

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

        let json;

        try {
          json = JSON.parse(text);
        } catch (error) {
          console.error("Invalid variations JSON:", error);
          console.error("Server response:", text);
          throw new Error("Invalid variations response.");
        }

        const variationTypes = Array.isArray(json?.variationTypes)
          ? json.variationTypes
          : [];

        const childVariations = Array.isArray(json?.childVariations)
          ? json.childVariations
          : [];

        const variationTypesForDelete = Array.isArray(
          json?.variationTypesForDelete
        )
          ? json.variationTypesForDelete
          : [];

        const currentVariationData =
          json?.currentVariationData &&
          typeof json.currentVariationData === "object"
            ? json.currentVariationData
            : {};

        const currentTypeId =
          variationTypesForDelete?.[0]?.type_id ?? null;

        this.shouldDeleteItems = variationTypesForDelete.length > 0;

        if (variationTypesForDelete.length > 0) {
          this.organizeVariationsForDelete(
            variationTypesForDelete,
            currentTypeId
          );
        }

        this.organizeCurrentVariation(currentVariationData);

        if (childVariations.length > 0 && variationTypes.length > 0) {
          this.organizeVariationsForRender(
            childVariations,
            variationTypes
          );

          this.selectFirstChildVariation(
            childVariations,
            variationTypes,
            safeVariationId,
            version
          );

          return;
        }

        this.finishPrices();
      })
      .catch((error) => {
        if (version !== this.requestVersion) return;

        console.error("Error fetching preview variations:", error);
        this.previewLogic?.hideLoader?.();
        window.loader?.hide?.();
      });

    return true;
  }

  /* ============================================================================
    CURRENT VARIATION
  ============================================================================ */

  organizeCurrentVariation(currentVariationData = {}) {
    try {
      const variation = currentVariationData?.variation ?? null;

      if (!variation) return false;

      const variationId = String(
        variation?.variation_id ?? ""
      ).trim();

      const typeId = String(
        variation?.type_id ?? ""
      ).trim();

      const typeName = String(
        variation?.type_name ?? ""
      ).trim();

      if (!variationId || !typeId || !typeName) return false;

      this.setSelectVariation(`variation_id_${variationId}`);

      const typeVariation = {
        type_id: typeId,
        type_name: typeName
      };

      const imagesOnlyOfType = Array.isArray(
        currentVariationData?.images
      )
        ? currentVariationData.images.map((image) => ({
            ...image,
            variation_id: variationId
          }))
        : [];

      const itemsOnlyOfType = Array.isArray(
        currentVariationData?.items
      )
        ? currentVariationData.items.map((item) => ({
            ...item,
            variation_id: variationId
          }))
        : [];

      const pricesOnlyOfType = Array.isArray(
        currentVariationData?.prices
      )
        ? currentVariationData.prices.map((price) => ({
            ...price,
            variation_id: variationId,
            price_display_mode:
              variation?.price_display_mode ?? null
          }))
        : [];

      const artworksOnlyOfType = [];
      const artworkData = currentVariationData?.artwork ?? null;

      if (artworkData) {
        const pdf = String(
          artworkData?.pdf_artwork ?? ""
        ).trim();

        const name = String(
          artworkData?.name_pdf_artwork ?? ""
        ).trim();

        if (pdf || name) {
          artworksOnlyOfType.push({
            ...artworkData,
            variation_id: variationId
          });
        }
      }

      this.previewLogic?.items?.deleteItems?.(typeId);
      this.previewLogic?.images?.deleteImages?.(typeId);
      this.previewLogic?.prices?.deletePrices?.(typeId);
      this.previewLogic?.artwork?.deleteArtwork?.(typeId);

      if (imagesOnlyOfType.length > 0) {
        this.previewLogic?.images?.renderImages?.(
          imagesOnlyOfType,
          typeVariation
        );
      }

      if (itemsOnlyOfType.length > 0) {
        this.previewLogic?.items?.renderItems?.(
          itemsOnlyOfType,
          typeVariation
        );
      }

      if (pricesOnlyOfType.length > 0) {
        this.previewLogic?.prices?.renderPrices?.(
          pricesOnlyOfType,
          typeVariation
        );
      }

      if (artworksOnlyOfType.length > 0) {
        this.previewLogic?.artwork?.renderArtwork?.(
          artworksOnlyOfType,
          typeVariation
        );
      }

      window.previewGallery?.refreshGallery?.(true);

      return true;
    } catch (error) {
      console.error("Error in organizeCurrentVariation:", error);
      return false;
    }
  }

  /* ============================================================================
    DELETE VARIATION RESOURCES
  ============================================================================ */

  organizeVariationsForDelete(
    variationTypes = [],
    currentTypeId = null
  ) {
    if (
      !Array.isArray(variationTypes) ||
      variationTypes.length === 0
    ) {
      return true;
    }

    const current = String(currentTypeId ?? "").trim();

    for (const variationType of variationTypes) {
      const typeId = String(
        variationType?.type_id ?? ""
      ).trim();

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

  /* ============================================================================
    ORGANISE VARIATIONS
  ============================================================================ */

  organizeVariationsForRender(
    childVariations = [],
    variationTypes = []
  ) {
    if (
      !Array.isArray(childVariations) ||
      childVariations.length === 0
    ) {
      return false;
    }

    if (
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
          variation?.type_id ?? ""
        ).trim();

        const variationTypeName = String(
          variation?.type_name ?? ""
        ).trim();

        if (
          variationTypeId !== typeId &&
          variationTypeName !== typeName
        ) {
          continue;
        }

        variationsOnlyOfType.push(variation);
      }

      if (variationsOnlyOfType.length === 0) continue;

      /*
       * Only render the variation buttons here.
       * Images, items, prices and artwork are rendered
       * when an option is selected.
       */
      this.renderVariations(
        variationsOnlyOfType,
        typeVariation
      );
    }

    return true;
  }

  /* ============================================================================
    RENDER COLLAPSIBLE VARIATIONS
  ============================================================================ */

  renderVariations(
    childVariationsOfType = [],
    typeVariation = {}
  ) {
    if (!this.container) {
      this.init();
    }

    if (!this.container) return false;

    if (
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

    this.deleteVariations(typeId);

    const labelId = `var-label-size-${typeId}`;
    const optionsId = `var-options-${typeId}`;
    const bodyId = `var-collapse-body-${typeId}`;

    const wrapper = document.createElement("div");

    wrapper.className = "wrap-variations is-collapsible";
    wrapper.dataset.typeId = typeId;
    wrapper.setAttribute("aria-labelledby", labelId);

    const collapseHeader = document.createElement("button");

    collapseHeader.type = "button";
    collapseHeader.className = "var-collapse-header";
    collapseHeader.setAttribute("aria-expanded", "false");
    collapseHeader.setAttribute("aria-controls", bodyId);

    const collapseLeft = document.createElement("span");

    collapseLeft.className = "var-collapse-left";

    const collapseTitle = document.createElement("span");

    collapseTitle.className = "var-collapse-title";

    const variationName = document.createElement("span");

    variationName.className = "var-name";
    variationName.textContent = typeName;

    const selectedLabel = document.createElement("strong");

    selectedLabel.id = labelId;
    selectedLabel.className = "js-selected-variation-label";
    selectedLabel.textContent = "Select option";

    collapseTitle.appendChild(variationName);
    collapseTitle.appendChild(selectedLabel);

    const summaryPill = document.createElement("span");

    summaryPill.className = "variation-summary-pill";
    summaryPill.textContent = "Select an option";

    const collapseHint = document.createElement("span");

    collapseHint.className = "var-collapse-hint";
    collapseHint.textContent = "Click to view available options";

    collapseLeft.appendChild(collapseTitle);
    collapseLeft.appendChild(summaryPill);
    collapseLeft.appendChild(collapseHint);

    const collapseIcon = document.createElement("span");

    collapseIcon.className = "var-collapse-icon";
    collapseIcon.setAttribute("aria-hidden", "true");
    collapseIcon.textContent = "⌄";

    collapseHeader.appendChild(collapseLeft);
    collapseHeader.appendChild(collapseIcon);

    const collapseBody = document.createElement("div");

    collapseBody.className = "var-collapse-body";
    collapseBody.id = bodyId;

    const collapseInner = document.createElement("div");

    collapseInner.className = "var-collapse-inner";

    const options = document.createElement("div");

    options.className = "var-options";
    options.id = optionsId;

    for (const variation of childVariationsOfType) {
      const button = this.createVariationButton(variation);

      if (button) {
        options.appendChild(button);
      }
    }

    collapseInner.appendChild(options);
    collapseBody.appendChild(collapseInner);

    wrapper.appendChild(collapseHeader);
    wrapper.appendChild(collapseBody);

    this.container.appendChild(wrapper);

    const groupCount = this.container.querySelectorAll(
      ".wrap-variations.is-collapsible"
    ).length;

    if (groupCount === 1) {
      this.openVariationGroup(wrapper);
    }

    return true;
  }

  /* ============================================================================
    CREATE VARIATION BUTTON
  ============================================================================ */

  createVariationButton(variation = {}) {
    const variationId = String(
      variation?.variation_id ?? ""
    ).trim();

    if (!variationId) return null;

    const label = String(
      variation?.name ?? ""
    ).trim();

    const rawImage = String(
      variation?.image ?? ""
    )
      .trim()
      .replace(/^\/+/, "");

    const imageSource = this.buildAssetUrl(
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

    image.addEventListener("error", () => {
      image.src =
        "../../view/preview_porduct/img/icon_product.png";
    }, { once: true });

    const main = document.createElement("span");

    main.className = "opt-main";
    main.textContent = label;

    button.appendChild(image);
    button.appendChild(main);

    return button;
  }

  /* ============================================================================
    AUTOMATIC SELECTION
  ============================================================================ */

  selectFirstChildVariation(
    childVariations = [],
    variationTypes = [],
    currentVariationId = "",
    version = this.requestVersion
  ) {
    if (version !== this.requestVersion) return false;

    const currentId = String(
      currentVariationId ?? ""
    ).trim();

    const firstTypeId = String(
      variationTypes?.[0]?.type_id ?? ""
    ).trim();

    let firstRow = childVariations.find((row) => {
      const variation = row?.variation;

      if (!variation) return false;

      const variationId = String(
        variation?.variation_id ?? ""
      ).trim();

      const typeId = String(
        variation?.type_id ?? ""
      ).trim();

      if (!variationId) return false;
      if (variationId === currentId) return false;
      if (firstTypeId && typeId !== firstTypeId) return false;

      return !this.automaticSelections.has(variationId);
    });

    if (!firstRow) {
      firstRow = childVariations.find((row) => {
        const variationId = String(
          row?.variation?.variation_id ?? ""
        ).trim();

        if (!variationId) return false;
        if (variationId === currentId) return false;

        return !this.automaticSelections.has(variationId);
      });
    }

    const variationId = String(
      firstRow?.variation?.variation_id ?? ""
    ).trim();

    if (!variationId) {
      this.finishPrices();
      return false;
    }

    this.automaticSelections.add(variationId);

    const buttonId = `variation_id_${variationId}`;

    window.setTimeout(() => {
      if (version !== this.requestVersion) return;

      const button = document.getElementById(buttonId);

      if (!button) {
        this.finishPrices();
        return;
      }

      this.SelectVariation(
        buttonId,
        true,
        firstRow
      );
    }, 0);

    return true;
  }

  /* ============================================================================
    SELECT VARIATION
  ============================================================================ */

  selectVariation(
    domId = "",
    automatic = false,
    variationRow = null
  ) {
    return this.SelectVariation(
      domId,
      automatic,
      variationRow
    );
  }

  SelectVariation(
    domId = "",
    automatic = false,
    variationRow = null
  ) {
    const id = String(domId ?? "").trim();

    if (!id) return false;

    const variationId = id
      .replace(/^variation_id_/, "")
      .trim();

    const button = document.getElementById(id);

    if (!variationId || !button) return false;

    if (!automatic) {
      this.requestVersion++;
      this.automaticSelections.clear();
      this.automaticSelections.add(variationId);
    }

    this.setSelectVariation(id);
    this.markSelectedButton(button);

    /*
     * When a child is automatically selected,
     * variationRow already contains its assets.
     */
    if (
      variationRow &&
      typeof variationRow === "object"
    ) {
      this.renderVariationAssets(variationRow);
    }

    this.fetchChildVariationsById(
      variationId,
      this.requestVersion
    );

    return true;
  }

  markSelectedButton(button) {
    if (!button) return false;

    const wrapper = button.closest(".wrap-variations");

    if (!wrapper) return false;

    const buttons = wrapper.querySelectorAll(
      ".var-option[id^='variation_id_']"
    );

    buttons.forEach((item) => {
      const selected = item === button;

      item.classList.toggle("is-selected", selected);
      item.setAttribute(
        "aria-pressed",
        selected ? "true" : "false"
      );
    });

    const selectedText =
      button.dataset.variationLabel ||
      button.querySelector(".opt-main")?.textContent?.trim() ||
      "";

    this.updateVariationHeader(
      wrapper,
      selectedText
    );

    return true;
  }

  /* ============================================================================
    RENDER SELECTED VARIATION ASSETS
  ============================================================================ */

  renderVariationAssets(row = {}) {
    try {
      const variation = row?.variation ?? null;

      if (!variation) return false;

      const variationId = String(
        variation?.variation_id ?? ""
      ).trim();

      const typeId = String(
        variation?.type_id ?? ""
      ).trim();

      const typeName = String(
        variation?.type_name ?? ""
      ).trim();

      if (!variationId || !typeId || !typeName) {
        return false;
      }

      const typeVariation = {
        type_id: typeId,
        type_name: typeName
      };

      const imagesOnlyOfType = Array.isArray(row?.images)
        ? row.images.map((image) => ({
            ...image,
            variation_id: variationId
          }))
        : [];

      const itemsOnlyOfType = Array.isArray(row?.items)
        ? row.items.map((item) => ({
            ...item,
            variation_id: variationId
          }))
        : [];

      const pricesOnlyOfType = Array.isArray(row?.prices)
        ? row.prices.map((price) => ({
            ...price,
            variation_id: variationId,
            price_display_mode:
              variation?.price_display_mode ?? null
          }))
        : [];

      const artworksOnlyOfType = [];
      const artworkData = row?.artwork ?? null;

      if (artworkData) {
        const pdf = String(
          artworkData?.pdf_artwork ?? ""
        ).trim();

        const name = String(
          artworkData?.name_pdf_artwork ?? ""
        ).trim();

        if (pdf || name) {
          artworksOnlyOfType.push({
            ...artworkData,
            variation_id: variationId
          });
        }
      }

      this.previewLogic?.images?.deleteImages?.(typeId);
      this.previewLogic?.items?.deleteItems?.(typeId);
      this.previewLogic?.prices?.deletePrices?.(typeId);
      this.previewLogic?.artwork?.deleteArtwork?.(typeId);

      if (imagesOnlyOfType.length > 0) {
        this.previewLogic?.images?.renderImages?.(
          imagesOnlyOfType,
          typeVariation
        );
      }

      if (itemsOnlyOfType.length > 0) {
        this.previewLogic?.items?.renderItems?.(
          itemsOnlyOfType,
          typeVariation
        );
      }

      if (pricesOnlyOfType.length > 0) {
        this.previewLogic?.prices?.renderPrices?.(
          pricesOnlyOfType,
          typeVariation
        );
      }

      if (artworksOnlyOfType.length > 0) {
        this.previewLogic?.artwork?.renderArtwork?.(
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

  /* ============================================================================
    PRICE COMPLETION
  ============================================================================ */

  finishPrices() {
    this.previewLogic?.prices?.updateVariationPrices?.();

    window.setTimeout(() => {
      if (
        typeof this.previewLogic?.prices
          ?.selectFirstAvailablePrice === "function"
      ) {
        this.previewLogic.prices.selectFirstAvailablePrice();
      } else {
        this.previewLogic?.prices?.selectFirstPrice?.();
      }

      this.previewLogic?.hideLoader?.();
      window.loader?.hide?.();
    }, 500);

    return true;
  }

  /* ============================================================================
    DELETE AND CLEAR
  ============================================================================ */

  deleteVariations(typeId) {
    if (!this.container) {
      this.init();
    }

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
    if (!this.container) {
      this.init();
    }

    if (!this.container) return false;

    this.container.replaceChildren();
    this.variationSelected = null;
    this.shouldDeleteItems = false;
    this.automaticSelections.clear();

    return true;
  }

  /* ============================================================================
    STATE
  ============================================================================ */

  setSelectVariation(domId = "") {
    this.variationSelected =
      String(domId ?? "").trim() || null;

    return this.variationSelected;
  }

  getSelectVariation() {
    return this.variationSelected;
  }

  getSelectedVariationId() {
    const selected = this.getSelectVariation();

    if (!selected) return null;

    const id = Number(
      String(selected).replace(/^variation_id_/, "")
    );

    return Number.isFinite(id) ? id : null;
  }

  getShouldDeleteItems() {
    return this.shouldDeleteItems;
  }

  /* ============================================================================
    HELPERS
  ============================================================================ */

  buildAssetUrl(rawPath = "", fallback = "") {
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
      return `../../dot63/${path}`;
    }

    return `../../dot63/controller/${path}`;
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
