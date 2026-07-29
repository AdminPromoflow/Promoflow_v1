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

  renderItem(data = []) {
    return this.renderItems(data);
  }

  renderItems(data = []) {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.items = this.normaliseItems(data);
    this.container.innerHTML = "";

    if (this.items.length === 0) {
      this.hideItemsSection();
      return false;
    }

    const groups = this.groupItems(this.items, 2);

    groups.forEach((group) => {
      const wrapper = document.createElement("div");
      wrapper.className = "wrap-items";

      group.forEach((item) => {
        wrapper.appendChild(this.createItemElement(item));
      });

      this.container.appendChild(wrapper);
    });

    this.showItemsSection();
    return true;
  }

  createItemElement(item) {
    const itemElement = document.createElement("div");
    itemElement.className = "sp-item";

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
    const items = this.extractItems(data);

    return items.map((item, index) => {
      if (typeof item === "string") {
        return {
          id: index,
          title: "",
          description: item,
          order: index
        };
      }

      const title = item.title || item.name || item.subtitle || item.item_title || item.heading || item.label || "";
      const description = item.description || item.text || item.content || item.item_description || item.value || item.details || "";

      return {
        id: item.id || item.item_id || index,
        title,
        description,
        order: Number(item.order ?? item.position ?? item.sort_order ?? index)
      };
    }).filter((item) => item.title || item.description).sort((firstItem, secondItem) => firstItem.order - secondItem.order);
  }

  extractItems(data = []) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];

    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.item)) return data.item;
    if (Array.isArray(data.product_items)) return data.product_items;
    if (Array.isArray(data.items_information)) return data.items_information;
    if (Array.isArray(data.item_information)) return data.item_information;
    if (Array.isArray(data.notes)) return data.notes;
    if (Array.isArray(data.information)) return data.information;

    if (data.data) return this.extractItems(data.data);
    if (data.product) return this.extractItems(data.product);

    return [];
  }

  groupItems(items = [], groupSize = 2) {
    const groups = [];

    for (let index = 0; index < items.length; index += groupSize) {
      groups.push(items.slice(index, index + groupSize));
    }

    return groups;
  }

  showItemsSection() {
    if (!this.container) return false;

    const section = this.container.closest(".sp-items-note");

    if (section) section.hidden = false;

    return true;
  }

  hideItemsSection() {
    if (!this.container) return false;

    const section = this.container.closest(".sp-items-note");

    if (section) section.hidden = true;

    return true;
  }

  clearItems() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.items = [];
    this.container.innerHTML = "";
    this.hideItemsSection();

    return true;
  }

  clearItem() {
    return this.clearItems();
  }

  setItems(data = []) {
    return this.renderItems(data);
  }

  getItems() {
    return this.items;
  }

  getItemById(itemId) {
    return this.items.find((item) => String(item.id) === String(itemId)) || null;
  }
}

window.Items = Items;
