// items.js

class Items {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;
    this.container = null;
    this.items = [];
  }

  init() {
    this.container = document.getElementById("wrap-items-group");
    return Boolean(this.container);
  }

  renderItem(data = [], typeVariation = {}) {
    return this.renderItems(data, typeVariation);
  }

  renderItems(itemsOnlyOfType = [], typeVariation = {}) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const selectedVariationId = Number(
      String(this.previewLogic?.variations?.getSelectVariation?.() ?? "")
        .replace(/^variation_id_/, "")
    );

    if (!Number.isFinite(selectedVariationId)) return false;

    const typeId = String(typeVariation?.type_id ?? "").trim();

    if (!typeId) return false;

    this.deleteItems(typeId);

    const wrapper = document.createElement("div");

    wrapper.className = "wrap-items";
    wrapper.id = `wrap-items-${typeId}`;
    wrapper.dataset.typeId = typeId;

    const normalisedItems = this.normaliseItems(itemsOnlyOfType)
      .filter((item) => Number(item.variationId) === selectedVariationId);

    for (const item of normalisedItems) {
      wrapper.appendChild(this.createItemElement(item));
    }

    if (wrapper.children.length === 0) return false;

    this.container.appendChild(wrapper);
    this.items = normalisedItems;
    this.showItemsSection();

    return true;
  }

  createItemElement(item = {}) {
    const itemElement = document.createElement("div");

    itemElement.className = "sp-item";
    itemElement.dataset.itemId = String(item.id ?? "");

    if (item.title) {
      const title = document.createElement("strong");

      title.className = "sp-item-subtitle";
      title.textContent = item.title;

      itemElement.appendChild(title);
    }

    if (item.description) {
      const description = document.createElement("span");

      description.textContent = item.description;

      itemElement.appendChild(description);
    }

    return itemElement;
  }

  normaliseItems(data = []) {
    if (!Array.isArray(data)) return [];

    return data
      .map((item, index) => {
        if (!item || typeof item !== "object") return null;

        return {
          id: item?.id ?? item?.item_id ?? index,
          title: String(item?.name ?? item?.title ?? "").trim(),
          description: String(item?.description ?? item?.text ?? "").trim(),
          variationId: String(item?.variation_id ?? "").trim(),
          order: Number(item?.order ?? item?.position ?? item?.sort_order ?? index)
        };
      })
      .filter((item) => item && (item.title || item.description))
      .sort((firstItem, secondItem) => firstItem.order - secondItem.order);
  }

  deleteItems(typeId) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const safeTypeId = String(typeId ?? "").trim();

    if (!safeTypeId) return false;

    document.getElementById(`wrap-items-${safeTypeId}`)?.remove();

    if (this.container.children.length === 0) {
      this.hideItemsSection();
    }

    return true;
  }

  clearItems() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.container.replaceChildren();
    this.items = [];
    this.hideItemsSection();

    return true;
  }

  clearItem() {
    return this.clearItems();
  }

  showItemsSection() {
    if (!this.container) return false;

    const section = this.container.closest(".sp-items-note");

    if (section) {
      section.hidden = false;
      section.removeAttribute("aria-hidden");
    }

    return true;
  }

  hideItemsSection() {
    if (!this.container) return false;

    const section = this.container.closest(".sp-items-note");

    if (section) {
      section.hidden = true;
      section.setAttribute("aria-hidden", "true");
    }

    return true;
  }

  getItems() {
    return [...this.items];
  }

  getItemById(itemId) {
    return this.items.find((item) => String(item.id) === String(itemId)) ?? null;
  }
}

window.Items = Items;
