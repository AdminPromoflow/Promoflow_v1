// variations.js

class Variations {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;

    this.topContainer = null;
    this.bottomContainer = null;

    this.variations = [];
    this.variationSelected = null;
    this.selectedOptions = {};
    this.maxQuantity = null;
    this.shouldDeleteItems = false;

    this.images = typeof Images === "function" ? new Images(previewLogic) : null;
    this.items = typeof Items === "function" ? new Items(previewLogic) : null;
    this.prices = typeof Prices === "function" ? new Prices(previewLogic) : null;
    this.artwork = typeof Artwork === "function" ? new Artwork(previewLogic) : null;
  }

  init() {
    this.topContainer = document.querySelector(".wrap-variations-group");
    this.bottomContainer = document.getElementById("wrap-variations-group");

    this.images?.init();
    this.items?.init();
    this.prices?.init();
    this.artwork?.init();

    return Boolean(this.topContainer || this.bottomContainer);
  }

  /* ==========================================================================
    RENDER VARIATIONS
  ========================================================================== */

  renderVariation(data = []) {
    return this.renderVariations(data);
  }

  renderVariations(data = []) {
    this.init();

    this.variations = this.normaliseVariations(data);
    this.selectedOptions = {};
    this.variationSelected = null;
    this.maxQuantity = null;
    this.shouldDeleteItems = false;

    this.clearVariationContainers();

    if (this.variations.length === 0) {
      this.hideVariationContainers();
      this.renderIndependentResources(data);
      return false;
    }

    const groups = this.getVariationGroups(this.variations);

    groups.forEach((group, index) => {
      const container = index < 2 || !this.bottomContainer ? this.topContainer : this.bottomContainer;

      if (!container) return;

      container.appendChild(this.createVariationGroup(group, index));
    });

    this.showVariationContainers();
    this.selectDefaultOptions(groups);
    this.resolveSelectedVariation();

    return true;
  }

  createVariationGroup(group, groupIndex) {
    const section = document.createElement("div");
    const label = document.createElement("div");
    const name = document.createElement("span");
    const selectedValue = document.createElement("strong");
    const options = document.createElement("div");

    section.className = "var-group";
    section.dataset.groupKey = group.key;

    label.className = "var-label";
    name.className = "var-name";
    selectedValue.className = "var-selected-value";
    options.className = "var-options";

    name.textContent = group.name;
    selectedValue.id = `variation_selected_${this.normaliseKey(group.key)}`;
    selectedValue.textContent = "";

    label.appendChild(name);
    label.appendChild(selectedValue);

    group.options.forEach((option, optionIndex) => {
      options.appendChild(this.createVariationButton(group, option, groupIndex, optionIndex));
    });

    section.appendChild(label);
    section.appendChild(options);

    return section;
  }

  createVariationButton(group, option, groupIndex, optionIndex) {
    const button = document.createElement("button");
    const text = document.createElement("span");

    button.type = "button";
    button.className = "var-option js-scale-in";
    button.dataset.groupKey = group.key;
    button.dataset.optionId = String(option.id);
    button.dataset.optionValue = option.value;
    button.dataset.groupIndex = String(groupIndex);
    button.dataset.optionIndex = String(optionIndex);
    button.setAttribute("aria-pressed", "false");

    text.className = "opt-main";
    text.textContent = option.label;

    if (option.image) {
      const image = document.createElement("img");

      image.src = option.image;
      image.alt = option.label;
      image.loading = "lazy";
      image.decoding = "async";
      image.className = "variation-option-image";

      button.appendChild(image);
    }

    button.appendChild(text);

    button.addEventListener("click", () => {
      this.selectOption(group.key, option.id);
    });

    return button;
  }

  /* ==========================================================================
    SELECT OPTIONS
  ========================================================================== */

  selectDefaultOptions(groups = []) {
    groups.forEach((group) => {
      const selectedOption = group.options.find((option) => option.selected && !option.disabled);
      const firstOption = group.options.find((option) => !option.disabled);
      const option = selectedOption || firstOption;

      if (option) this.selectedOptions[group.key] = option.id;
    });

    this.updateOptionButtons();
    this.updateSelectedLabels();

    return true;
  }

  selectOption(groupKey, optionId) {
    const group = this.getGroupByKey(groupKey);

    if (!group) return false;

    const option = group.options.find((currentOption) => String(currentOption.id) === String(optionId));

    if (!option || option.disabled) return false;

    this.selectedOptions[group.key] = option.id;

    this.updateOptionButtons();
    this.updateSelectedLabels();
    this.resolveSelectedVariation();

    return true;
  }

  selectVariation(variation) {
    if (variation === null || variation === undefined) return false;

    if (typeof variation === "object") {
      const normalisedVariation = this.normaliseVariation(variation, 0);

      this.applyVariationOptions(normalisedVariation);
      this.setSelectVariation(normalisedVariation);
      this.applyVariationResources(normalisedVariation);

      return true;
    }

    const foundVariation = this.getVariationById(variation);

    if (!foundVariation) return false;

    this.applyVariationOptions(foundVariation);
    this.setSelectVariation(foundVariation);
    this.applyVariationResources(foundVariation);

    return true;
  }

  applyVariationOptions(variation) {
    if (!variation?.options) return false;

    Object.entries(variation.options).forEach(([groupKey, optionValue]) => {
      const group = this.getGroupByKey(groupKey);

      if (!group) return;

      const option = group.options.find((currentOption) => {
        return String(currentOption.id) === String(optionValue) || String(currentOption.value) === String(optionValue);
      });

      if (option) this.selectedOptions[group.key] = option.id;
    });

    this.updateOptionButtons();
    this.updateSelectedLabels();

    return true;
  }

  resolveSelectedVariation() {
    const variation = this.findMatchingVariation();

    if (!variation) {
      this.setSelectVariation(null);
      this.updateAvailableOptions();
      this.clearDependentResources();
      return false;
    }

    this.setSelectVariation(variation);
    this.updateAvailableOptions();
    this.applyVariationResources(variation);

    return true;
  }

  findMatchingVariation() {
    return this.variations.find((variation) => {
      const entries = Object.entries(variation.options);

      if (entries.length === 0) return this.variations.length === 1;

      return entries.every(([groupKey, optionValue]) => {
        const selectedOptionId = this.selectedOptions[groupKey];
        const group = this.getGroupByKey(groupKey);

        if (!group || selectedOptionId === undefined) return false;

        const selectedOption = group.options.find((option) => String(option.id) === String(selectedOptionId));

        if (!selectedOption) return false;

        return String(selectedOption.id) === String(optionValue) || String(selectedOption.value) === String(optionValue);
      });
    }) || null;
  }

  updateOptionButtons() {
    const containers = [this.topContainer, this.bottomContainer].filter(Boolean);

    containers.forEach((container) => {
      container.querySelectorAll(".var-option[data-group-key]").forEach((button) => {
        const groupKey = button.dataset.groupKey;
        const optionId = button.dataset.optionId;
        const selected = String(this.selectedOptions[groupKey]) === String(optionId);

        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", selected ? "true" : "false");
      });
    });

    return true;
  }

  updateSelectedLabels() {
    const groups = this.getVariationGroups(this.variations);

    groups.forEach((group) => {
      const optionId = this.selectedOptions[group.key];
      const option = group.options.find((currentOption) => String(currentOption.id) === String(optionId));
      const label = document.getElementById(`variation_selected_${this.normaliseKey(group.key)}`);

      if (label) label.textContent = option?.label || "";
    });

    return true;
  }

  updateAvailableOptions() {
    const groups = this.getVariationGroups(this.variations);

    groups.forEach((group) => {
      group.options.forEach((option) => {
        const available = this.isOptionAvailable(group.key, option);
        const buttons = document.querySelectorAll(`.var-option[data-group-key="${this.escapeSelector(group.key)}"][data-option-id="${this.escapeSelector(String(option.id))}"]`);

        buttons.forEach((button) => {
          button.disabled = !available;
          button.classList.toggle("is-disabled", !available);
          button.setAttribute("aria-disabled", available ? "false" : "true");
        });
      });
    });

    return true;
  }

  isOptionAvailable(groupKey, option) {
    return this.variations.some((variation) => {
      return Object.entries(this.selectedOptions).every(([selectedGroupKey, selectedOptionId]) => {
        const group = this.getGroupByKey(selectedGroupKey);

        if (!group) return true;

        const selectedOption = selectedGroupKey === groupKey
          ? option
          : group.options.find((currentOption) => String(currentOption.id) === String(selectedOptionId));

        if (!selectedOption) return true;

        const variationValue = variation.options[selectedGroupKey];

        if (variationValue === undefined) return true;

        return String(variationValue) === String(selectedOption.id) || String(variationValue) === String(selectedOption.value);
      });
    });
  }

  /* ==========================================================================
    APPLY SELECTED VARIATION
  ========================================================================== */

  applyVariationResources(variation) {
    if (!variation) return false;

    this.maxQuantity = variation.maxQuantity;
    this.shouldDeleteItems = variation.shouldDeleteItems;

    this.images?.renderImages(variation.images);

    if (variation.shouldDeleteItems) {
      this.items?.clearItems();
    } else {
      this.items?.renderItems(variation.items);
    }

    this.prices?.renderPrices(variation.prices);
    this.artwork?.renderArtworks(variation.artworks);

    this.notifyPreviewLogic(variation);

    return true;
  }

  renderIndependentResources(data = {}) {
    const source = data?.data || data?.product || data;

    if (!source || typeof source !== "object") return false;

    this.images?.renderImages(source.images || source.product_images || source.media || []);
    this.items?.renderItems(source.items || source.product_items || []);
    this.prices?.renderPrices(source.prices || source.product_prices || []);
    this.artwork?.renderArtworks(source.artworks || source.artwork || source.templates || []);

    return true;
  }

  clearDependentResources() {
    this.images?.clearImages();
    this.items?.clearItems();
    this.prices?.clearPrices();
    this.artwork?.clearArtworks();

    return true;
  }

  notifyPreviewLogic(variation) {
    if (!this.previewLogic) return false;

    this.previewLogic.variationSelected = variation;
    this.previewLogic.max_quantity = variation.maxQuantity;
    this.previewLogic.shouldDeleteItems = variation.shouldDeleteItems;

    if (typeof this.previewLogic.setSelectVariation === "function") {
      this.previewLogic.setSelectVariation(variation);
    }

    if (typeof this.previewLogic.setMaxQuantity === "function") {
      this.previewLogic.setMaxQuantity(variation.maxQuantity);
    }

    if (typeof this.previewLogic.setShouldDeleteItems === "function") {
      this.previewLogic.setShouldDeleteItems(variation.shouldDeleteItems);
    }

    return true;
  }

  /* ==========================================================================
    NORMALISE DATA
  ========================================================================== */

  normaliseVariations(data = []) {
    const variations = this.extractVariations(data);

    return variations.map((variation, index) => {
      return this.normaliseVariation(variation, index);
    }).filter((variation) => variation.active).sort((firstVariation, secondVariation) => firstVariation.order - secondVariation.order);
  }

  normaliseVariation(variation = {}, index = 0) {
    const options = this.normaliseVariationOptions(
      variation.options ||
      variation.selected_options ||
      variation.selectedOptions ||
      variation.attributes ||
      variation.values ||
      variation.variation_values ||
      variation.variationValues ||
      {}
    );

    const resources = variation.resources || variation.content || variation.data || variation;

    return {
      id: variation.id ?? variation.variation_id ?? variation.product_variation_id ?? variation.id_variation ?? index,
      sku: variation.sku || variation.product_sku || variation.variation_sku || "",
      name: variation.name || variation.title || variation.variation_name || `Variation ${index + 1}`,
      options,
      images: resources.images || resources.product_images || resources.media || resources.gallery || [],
      items: resources.items || resources.product_items || resources.items_information || resources.notes || [],
      prices: resources.prices || resources.product_prices || resources.price_options || resources.quantities || [],
      artworks: resources.artworks || resources.artwork || resources.templates || resources.artwork_templates || [],
      maxQuantity: this.toNullableNumber(
        variation.max_quantity ??
        variation.maxQuantity ??
        resources.max_quantity ??
        resources.maxQuantity
      ),
      shouldDeleteItems: this.toBoolean(
        variation.should_delete_items ??
        variation.shouldDeleteItems ??
        resources.should_delete_items ??
        resources.shouldDeleteItems
      ),
      selected: this.toBoolean(variation.selected ?? variation.is_selected ?? variation.default ?? variation.is_default),
      active: variation.active === undefined ? true : this.toBoolean(variation.active),
      order: Number(variation.order ?? variation.position ?? variation.sort_order ?? index)
    };
  }

  normaliseVariationOptions(options = {}) {
    if (Array.isArray(options)) {
      return options.reduce((result, option, index) => {
        if (typeof option !== "object" || option === null) return result;

        const key = option.group_key || option.groupKey || option.attribute_key || option.attributeKey || option.variation_name || option.name || option.key || `group_${index}`;
        const value = option.option_id ?? option.optionId ?? option.value_id ?? option.valueId ?? option.id ?? option.value ?? option.label ?? "";

        result[String(key)] = value;
        return result;
      }, {});
    }

    if (!options || typeof options !== "object") return {};

    return Object.entries(options).reduce((result, [key, value]) => {
      if (value && typeof value === "object") {
        result[key] = value.id ?? value.option_id ?? value.value_id ?? value.value ?? value.label ?? "";
      } else {
        result[key] = value;
      }

      return result;
    }, {});
  }

  extractVariations(data = []) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];

    if (Array.isArray(data.variations)) return data.variations;
    if (Array.isArray(data.variation)) return data.variation;
    if (Array.isArray(data.product_variations)) return data.product_variations;
    if (Array.isArray(data.productVariations)) return data.productVariations;
    if (Array.isArray(data.combinations)) return data.combinations;
    if (Array.isArray(data.variation_combinations)) return data.variation_combinations;

    if (data.data) return this.extractVariations(data.data);
    if (data.product) return this.extractVariations(data.product);

    return [];
  }

  /* ==========================================================================
    GROUPS AND OPTIONS
  ========================================================================== */

  getVariationGroups(variations = this.variations) {
    const groups = new Map();

    variations.forEach((variation) => {
      Object.entries(variation.options).forEach(([groupKey, optionValue]) => {
        if (!groups.has(groupKey)) {
          groups.set(groupKey, {
            key: groupKey,
            name: this.formatGroupName(groupKey),
            options: []
          });
        }

        const group = groups.get(groupKey);
        const optionData = this.findOptionData(variation, groupKey, optionValue);
        const exists = group.options.some((option) => {
          return String(option.id) === String(optionData.id) || String(option.value) === String(optionData.value);
        });

        if (!exists) group.options.push(optionData);
      });
    });

    return Array.from(groups.values());
  }

  findOptionData(variation, groupKey, optionValue) {
    const sourceOptions =
      variation.rawOptions ||
      variation.optionsData ||
      variation.optionDetails ||
      [];

    if (Array.isArray(sourceOptions)) {
      const foundOption = sourceOptions.find((option) => {
        const key = option.group_key || option.groupKey || option.name || option.key;
        const value = option.option_id ?? option.id ?? option.value;

        return String(key) === String(groupKey) && String(value) === String(optionValue);
      });

      if (foundOption) {
        return {
          id: foundOption.id ?? foundOption.option_id ?? optionValue,
          value: foundOption.value ?? foundOption.option_value ?? optionValue,
          label: foundOption.label || foundOption.name || foundOption.option_name || String(optionValue),
          image: foundOption.image || foundOption.image_url || "",
          selected: this.toBoolean(foundOption.selected),
          disabled: this.toBoolean(foundOption.disabled)
        };
      }
    }

    return {
      id: optionValue,
      value: optionValue,
      label: this.formatOptionLabel(optionValue),
      image: "",
      selected: variation.selected,
      disabled: false
    };
  }

  getGroupByKey(groupKey) {
    return this.getVariationGroups(this.variations).find((group) => String(group.key) === String(groupKey)) || null;
  }

  formatGroupName(value = "") {
    return String(value)
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
      .trim();
  }

  formatOptionLabel(value = "") {
    return String(value)
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
      .trim();
  }

  normaliseKey(value = "") {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  escapeSelector(value = "") {
    if (window.CSS?.escape) return CSS.escape(String(value));

    return String(value).replace(/["\\]/g, "\\$&");
  }

  /* ==========================================================================
    STATE
  ========================================================================== */

  setSelectVariation(variation) {
    this.variationSelected = variation || null;
    return Boolean(this.variationSelected);
  }

  getSelectVariation() {
    return this.variationSelected;
  }

  setVariationSelected(variation) {
    return this.setSelectVariation(variation);
  }

  getVariationSelected() {
    return this.getSelectVariation();
  }

  setSelectedOptions(options = {}) {
    if (!options || typeof options !== "object") return false;

    this.selectedOptions = { ...options };
    this.updateOptionButtons();
    this.updateSelectedLabels();
    this.resolveSelectedVariation();

    return true;
  }

  getSelectedOptions() {
    return { ...this.selectedOptions };
  }

  setMaxQuantity(quantity) {
    this.maxQuantity = this.toNullableNumber(quantity);
    return true;
  }

  getMaxQuantity() {
    return this.maxQuantity;
  }

  setShouldDeleteItems(value) {
    this.shouldDeleteItems = this.toBoolean(value);
    return true;
  }

  getShouldDeleteItems() {
    return this.shouldDeleteItems;
  }

  getVariations() {
    return this.variations;
  }

  getVariationById(variationId) {
    return this.variations.find((variation) => String(variation.id) === String(variationId)) || null;
  }

  /* ==========================================================================
    CLEAR AND DISPLAY
  ========================================================================== */

  clearVariationContainers() {
    if (this.topContainer) this.topContainer.innerHTML = "";
    if (this.bottomContainer && this.bottomContainer !== this.topContainer) this.bottomContainer.innerHTML = "";

    return true;
  }

  clearVariations() {
    this.variations = [];
    this.selectedOptions = {};
    this.variationSelected = null;
    this.maxQuantity = null;
    this.shouldDeleteItems = false;

    this.clearVariationContainers();
    this.hideVariationContainers();
    this.clearDependentResources();

    return true;
  }

  clearVariation() {
    return this.clearVariations();
  }

  showVariationContainers() {
    if (this.topContainer) this.topContainer.hidden = false;
    if (this.bottomContainer) this.bottomContainer.hidden = false;

    return true;
  }

  hideVariationContainers() {
    if (this.topContainer) this.topContainer.hidden = true;
    if (this.bottomContainer) this.bottomContainer.hidden = true;

    return true;
  }

  /* ==========================================================================
    HELPERS
  ========================================================================== */

  toNullableNumber(value) {
    if (value === null || value === undefined || value === "") return null;

    const number = Number(String(value).replace(/[^0-9.-]+/g, ""));

    return Number.isFinite(number) ? number : null;
  }

  toBoolean(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;

    return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
  }
}

window.Variations = Variations;
