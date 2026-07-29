// items.js

class Items {
  constructor() {
    this.selectedItems = new Map();
    this.isInitialised = false;
  }

  /* ==========================================================================
    INITIALISE
  ========================================================================== */

  init() {
    if (this.isInitialised) return;

    const parent = this.getItemsParent();

    if (!parent) {
      console.warn("Items group container was not found.");
      return;
    }

    this.isInitialised = true;
    this.bindItemEvents();
  }

  getItemsParent() {
    return document.getElementById("wrap-items-group");
  }

  /* ==========================================================================
    EVENT DELEGATION
  ========================================================================== */

  bindItemEvents() {
    const parent = this.getItemsParent();

    if (!parent || parent.dataset.itemsBound === "1") {
      return false;
    }

    parent.dataset.itemsBound = "1";

    parent.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const itemButton = target.closest(".js-item-option");

      if (itemButton && parent.contains(itemButton)) {
        event.preventDefault();

        this.selectItemButton(itemButton);
        return;
      }

      const collapseHeader = target.closest(".item-collapse-header");

      if (collapseHeader && parent.contains(collapseHeader)) {
        event.preventDefault();

        const group = collapseHeader.closest(".wrap-items");

        this.toggleItemGroup(group);
      }
    });

    return true;
  }

  /* ==========================================================================
    DELETE ITEMS
  ========================================================================== */

  deleteItems(typeId) {
    const safeTypeId = String(typeId ?? "").trim();

    if (!safeTypeId) return false;

    const wrapper = document.getElementById(
      `wrap-item-${safeTypeId}`
    );

    if (!wrapper) return false;

    const selectedItemId = this.selectedItems.get(safeTypeId);

    if (selectedItemId) {
      this.selectedItems.delete(safeTypeId);
    }

    wrapper.remove();

    this.updatePrices();

    return true;
  }

  clearItems() {
    const parent = this.getItemsParent();

    if (!parent) return false;

    parent.replaceChildren();
    this.selectedItems.clear();

    this.updatePrices();

    return true;
  }

  /* ==========================================================================
    RENDER ITEMS
  ========================================================================== */

  renderItems(itemsOnlyOfType = [], typeVariation = {}) {
    const parent = this.getItemsParent();

    if (
      !parent ||
      !Array.isArray(itemsOnlyOfType) ||
      itemsOnlyOfType.length === 0
    ) {
      return false;
    }

    const typeId = String(
      typeVariation?.type_id ?? ""
    ).trim();

    const typeName = String(
      typeVariation?.type_name ?? ""
    ).trim();

    if (!typeId) return false;

    this.deleteItems(typeId);

    const wrapper = document.createElement("section");

    wrapper.id = `wrap-item-${typeId}`;
    wrapper.className = "wrap-items is-collapsible";
    wrapper.dataset.typeId = typeId;
    wrapper.dataset.typeName = typeName;

    const headingId = `item-heading-${typeId}`;
    const bodyId = `item-body-${typeId}`;

    wrapper.setAttribute("aria-labelledby", headingId);

    const header = this.createItemHeader({
      typeId: typeId,
      typeName: typeName,
      headingId: headingId,
      bodyId: bodyId
    });

    const body = document.createElement("div");

    body.id = bodyId;
    body.className = "item-collapse-body";

    const inner = document.createElement("div");

    inner.className = "item-collapse-inner";

    const options = document.createElement("div");

    options.className = "item-options";

    for (const itemData of itemsOnlyOfType) {
      const button = this.createItemButton(
        itemData,
        typeId
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

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    parent.appendChild(wrapper);

    this.openItemGroup(wrapper);
    this.selectDefaultItem(wrapper);

    return true;
  }

  createItemHeader({
    typeId = "",
    typeName = "",
    headingId = "",
    bodyId = ""
  } = {}) {
    const header = document.createElement("button");

    header.type = "button";
    header.className = "item-collapse-header";
    header.setAttribute("aria-expanded", "true");
    header.setAttribute("aria-controls", bodyId);

    const left = document.createElement("span");

    left.className = "item-collapse-left";

    const title = document.createElement("span");

    title.className = "item-collapse-title";

    const name = document.createElement("span");

    name.className = "item-name";
    name.textContent = typeName || "Items";

    const selectedLabel = document.createElement("strong");

    selectedLabel.id = headingId;
    selectedLabel.className = "js-selected-item-label";
    selectedLabel.textContent = "Select an item";

    title.appendChild(name);
    title.appendChild(selectedLabel);

    const summary = document.createElement("span");

    summary.className = "item-summary-pill";
    summary.textContent = "Select an item";

    const hint = document.createElement("span");

    hint.className = "item-collapse-hint";
    hint.textContent = "Click to view available items";

    left.appendChild(title);
    left.appendChild(summary);
    left.appendChild(hint);

    const icon = document.createElement("span");

    icon.className = "item-collapse-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "⌄";

    header.appendChild(left);
    header.appendChild(icon);

    return header;
  }

  createItemButton(itemData = {}, typeId = "") {
    const itemId = String(
      itemData?.item_id ??
      itemData?.id ??
      ""
    ).trim();

    const itemName = String(
      itemData?.item_name ??
      itemData?.name ??
      itemData?.title ??
      ""
    ).trim();

    const itemDescription = String(
      itemData?.description ??
      itemData?.item_description ??
      ""
    ).trim();

    const itemPrice = this.parseNumber(
      itemData?.price ??
      itemData?.extra_price ??
      itemData?.additional_price ??
      0
    );

    const variationId = String(
      itemData?.variation_id ?? ""
    ).trim();

    if (!itemId) return null;

    const button = document.createElement("button");

    button.type = "button";
    button.id = `item_id_${itemId}`;
    button.className = "item-option js-item-option js-scale-in";
    button.dataset.itemId = itemId;
    button.dataset.typeId = String(typeId);
    button.dataset.variationId = variationId;
    button.dataset.itemName = itemName;
    button.dataset.itemPrice = String(itemPrice);
    button.setAttribute("aria-pressed", "false");

    const content = document.createElement("span");

    content.className = "item-option-content";

    const main = document.createElement("span");

    main.className = "item-option-main";

    const name = document.createElement("strong");

    name.className = "item-option-name";
    name.textContent = itemName || "Item";

    main.appendChild(name);

    if (itemDescription) {
      const description = document.createElement("small");

      description.className = "item-option-description";
      description.textContent = itemDescription;

      main.appendChild(description);
    }

    content.appendChild(main);

    if (itemPrice > 0) {
      const price = document.createElement("span");

      price.className = "item-option-price";
      price.textContent = `+£${this.formatPrice(itemPrice)}`;

      content.appendChild(price);
    }

    const indicator = document.createElement("span");

    indicator.className = "item-option-indicator";
    indicator.setAttribute("aria-hidden", "true");

    button.appendChild(content);
    button.appendChild(indicator);

    return button;
  }

  /* ==========================================================================
    ITEM SELECTION
  ========================================================================== */

  selectDefaultItem(wrapper) {
    if (!(wrapper instanceof HTMLElement)) {
      return false;
    }

    const selectedButton = wrapper.querySelector(
      ".js-item-option.is-selected"
    );

    if (selectedButton instanceof HTMLButtonElement) {
      return this.selectItemButton(selectedButton);
    }

    const firstButton = wrapper.querySelector(
      ".js-item-option"
    );

    if (!(firstButton instanceof HTMLButtonElement)) {
      return false;
    }

    return this.selectItemButton(firstButton);
  }

  selectItemButton(button) {
    if (!(button instanceof HTMLButtonElement)) {
      return false;
    }

    const wrapper = button.closest(".wrap-items");

    if (!wrapper) return false;

    const typeId = String(
      wrapper.dataset.typeId ??
      button.dataset.typeId ??
      ""
    ).trim();

    if (!typeId) return false;

    const buttons = wrapper.querySelectorAll(
      ".js-item-option"
    );

    for (const item of buttons) {
      const isSelected = item === button;

      item.classList.toggle("is-selected", isSelected);
      item.setAttribute(
        "aria-pressed",
        isSelected ? "true" : "false"
      );
    }

    const itemId = String(
      button.dataset.itemId ?? ""
    ).trim();

    const itemName = String(
      button.dataset.itemName ?? ""
    ).trim();

    if (itemId) {
      this.selectedItems.set(typeId, itemId);
    }

    this.updateItemHeader(wrapper, itemName);
    this.updatePrices();

    return true;
  }

  updateItemHeader(wrapper, selectedText = "") {
    if (!(wrapper instanceof HTMLElement)) {
      return false;
    }

    const safeText = String(selectedText ?? "").trim();

    const selectedLabel = wrapper.querySelector(
      ".js-selected-item-label"
    );

    const summary = wrapper.querySelector(
      ".item-summary-pill"
    );

    if (selectedLabel) {
      selectedLabel.textContent =
        safeText || "Select an item";
    }

    if (summary) {
      summary.textContent = safeText
        ? `Selected: ${safeText}`
        : "Select an item";
    }

    return true;
  }

  /* ==========================================================================
    COLLAPSE
  ========================================================================== */

  toggleItemGroup(group) {
    if (!(group instanceof HTMLElement)) {
      return false;
    }

    const isOpen = group.classList.contains("is-open");

    if (isOpen) {
      return this.closeItemGroup(group);
    }

    return this.openItemGroup(group);
  }

  openItemGroup(group) {
    if (!(group instanceof HTMLElement)) {
      return false;
    }

    group.classList.add("is-open");

    const header = group.querySelector(
      ".item-collapse-header"
    );

    if (header) {
      header.setAttribute("aria-expanded", "true");
    }

    return true;
  }

  closeItemGroup(group) {
    if (!(group instanceof HTMLElement)) {
      return false;
    }

    group.classList.remove("is-open");

    const header = group.querySelector(
      ".item-collapse-header"
    );

    if (header) {
      header.setAttribute("aria-expanded", "false");
    }

    return true;
  }

  /* ==========================================================================
    SELECTED ITEMS
  ========================================================================== */

  getSelectedItems() {
    const selectedButtons = document.querySelectorAll(
      "#wrap-items-group .js-item-option.is-selected"
    );

    return Array.from(selectedButtons)
      .map((button) => {
        const itemId = String(
          button.dataset.itemId ?? ""
        ).trim();

        const typeId = String(
          button.dataset.typeId ?? ""
        ).trim();

        const variationId = String(
          button.dataset.variationId ?? ""
        ).trim();

        const itemName = String(
          button.dataset.itemName ?? ""
        ).trim();

        const itemPrice = this.parseNumber(
          button.dataset.itemPrice
        );

        if (!itemId) return null;

        return {
          item_id: itemId,
          type_id: typeId,
          variation_id: variationId,
          name: itemName,
          price: itemPrice
        };
      })
      .filter(Boolean);
  }

  getSelectedItemsTotal() {
    return this.getSelectedItems().reduce(
      (total, item) => total + this.parseNumber(item.price),
      0
    );
  }

  getSelectedItemByType(typeId) {
    const safeTypeId = String(typeId ?? "").trim();

    if (!safeTypeId) return null;

    const button = document.querySelector(
      `#wrap-item-${this.escapeCss(safeTypeId)} .js-item-option.is-selected`
    );

    if (!(button instanceof HTMLButtonElement)) {
      return null;
    }

    return {
      item_id: String(button.dataset.itemId ?? ""),
      type_id: String(button.dataset.typeId ?? ""),
      variation_id: String(button.dataset.variationId ?? ""),
      name: String(button.dataset.itemName ?? ""),
      price: this.parseNumber(button.dataset.itemPrice)
    };
  }

  /* ==========================================================================
    PRICE COMPATIBILITY
  ========================================================================== */

  updatePrices() {
    const selectedPrice =
      window.prices?.getSelectedPrice?.();

    if (
      selectedPrice &&
      typeof window.prices?.updateProductSummaryBox === "function"
    ) {
      window.prices.updateProductSummaryBox(
        selectedPrice.min_quantity,
        selectedPrice.price
      );
    }

    return true;
  }

  /* ==========================================================================
    HELPERS
  ========================================================================== */

  parseNumber(value) {
    const normalised = String(value ?? "")
      .trim()
      .replace(/,/g, "");

    const number = Number(normalised);

    return Number.isFinite(number)
      ? number
      : 0;
  }

  formatPrice(value) {
    const number = Number(value);

    return Number.isFinite(number)
      ? number.toFixed(2)
      : "0.00";
  }

  escapeCss(value = "") {
    const text = String(value ?? "");

    if (
      window.CSS &&
      typeof window.CSS.escape === "function"
    ) {
      return window.CSS.escape(text);
    }

    return text.replace(/["\\]/g, "\\$&");
  }

  escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

/* ==========================================================================
  GLOBAL INSTANCE
========================================================================== */

const items = new Items();

window.items = items;

/* ==========================================================================
  INITIALISE ONCE
========================================================================== */

function initialiseItems() {
  window.items?.init?.();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initialiseItems,
    { once: true }
  );
} else {
  initialiseItems();
}
