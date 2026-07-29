// prices.js

class Prices {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;
    this.container = null;
    this.prices = [];
    this.selectedPrice = null;
    this.currency = "GBP";
    this.currencySymbol = "£";
  }

  init() {
    this.container = document.getElementById("wrap-prices-group");
    return Boolean(this.container);
  }

  renderPrice(data = []) {
    return this.renderPrices(data);
  }

  renderPrices(data = []) {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.prices = this.normalisePrices(data);
    this.container.innerHTML = "";

    if (this.prices.length === 0) {
      this.selectedPrice = null;
      this.hidePricesSection();
      this.resetPriceSummary();
      return false;
    }

    const groups = this.groupPrices(this.prices, 4);

    groups.forEach((group) => {
      const wrapper = document.createElement("div");
      wrapper.className = "wrap-price";

      group.forEach((price) => {
        wrapper.appendChild(this.createPriceButton(price));
      });

      this.container.appendChild(wrapper);
    });

    this.showPricesSection();

    const previouslySelected = this.findPreviouslySelectedPrice();
    const defaultPrice = previouslySelected || this.prices.find((price) => price.selected) || this.prices[0];

    this.selectPrice(defaultPrice.id);

    return true;
  }

  createPriceButton(price) {
    const button = document.createElement("button");
    const quantity = document.createElement("span");

    button.type = "button";
    button.className = "var-option js-scale-in";
    button.dataset.priceId = String(price.id);
    button.dataset.quantity = String(price.quantity);
    button.dataset.unitPrice = String(price.unitPrice);
    button.dataset.extraUnitPrice = String(price.extraUnitPrice);
    button.setAttribute("aria-pressed", "false");

    quantity.className = "opt-main";
    quantity.textContent = this.formatQuantity(price.quantity);

    button.appendChild(quantity);

    button.addEventListener("click", () => {
      this.selectPrice(price.id);
    });

    return button;
  }

  selectPrice(priceId) {
    const price = this.getPriceById(priceId);

    if (!price) return false;

    this.selectedPrice = price;
    this.updateSelectedButton();
    this.updatePriceSummary(price);
    this.notifyPreviewLogic(price);

    return true;
  }

  updateSelectedButton() {
    if (!this.container) return false;

    const buttons = this.container.querySelectorAll(".var-option");

    buttons.forEach((button) => {
      const isSelected = String(button.dataset.priceId) === String(this.selectedPrice?.id);

      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    return true;
  }

  updatePriceSummary(price) {
    if (!price) return false;

    const quantity = Number(price.quantity) || 0;
    const unitPrice = Number(price.unitPrice) || 0;
    const extraUnitPrice = Number(price.extraUnitPrice) || 0;
    const unitTotal = this.getUnitTotal(price);
    const extraTotal = this.getExtraTotal(price);
    const total = this.getTotal(price);

    this.setText("var_label_quantity", `${this.formatQuantity(quantity)} units`);
    this.setText("sp_currency_symbol", price.currencySymbol);
    this.setPriceElement("sp_price", unitPrice);
    this.setText("sp_unit_hint", `per ${this.formatQuantity(quantity)} units`);

    this.setText("bb_unit", this.formatMoney(unitPrice, price.currencySymbol));
    this.setText("bb_unit_quantity", this.formatQuantity(quantity));
    this.setText("bb_unit_total", this.formatMoney(unitTotal, price.currencySymbol));

    this.setText("bb_extra_unit", this.formatMoney(extraUnitPrice, price.currencySymbol));
    this.setText("bb_extra_quantity", this.formatQuantity(quantity));
    this.setText("bb_extra_total", this.formatMoney(extraTotal, price.currencySymbol));

    this.setText("bb_total", this.formatMoney(total, price.currencySymbol));

    return true;
  }

  resetPriceSummary() {
    this.setText("var_label_quantity", "0 units");
    this.setText("sp_currency_symbol", this.currencySymbol);
    this.setPriceElement("sp_price", 0);
    this.setText("sp_unit_hint", "per 0 units");

    this.setText("bb_unit", this.formatMoney(0));
    this.setText("bb_unit_quantity", "0");
    this.setText("bb_unit_total", this.formatMoney(0));

    this.setText("bb_extra_unit", this.formatMoney(0));
    this.setText("bb_extra_quantity", "0");
    this.setText("bb_extra_total", this.formatMoney(0));

    this.setText("bb_total", this.formatMoney(0));

    return true;
  }

  normalisePrices(data = []) {
    const prices = this.extractPrices(data);

    return prices.map((price, index) => {
      if (typeof price === "number" || typeof price === "string") {
        return {
          id: index,
          quantity: Number(price) || 0,
          unitPrice: 0,
          extraUnitPrice: 0,
          total: null,
          extraTotal: null,
          currency: this.currency,
          currencySymbol: this.currencySymbol,
          selected: index === 0,
          order: index
        };
      }

      const currency = price.currency || price.currency_code || price.currencyCode || this.currency;
      const currencySymbol = price.currency_symbol || price.currencySymbol || price.symbol || this.getCurrencySymbol(currency);
      const quantity = this.toNumber(price.quantity ?? price.qty ?? price.pack_size ?? price.packSize ?? price.units ?? price.minimum_quantity ?? 0);
      const unitPrice = this.toNumber(price.unit_price ?? price.unitPrice ?? price.price_per_unit ?? price.pricePerUnit ?? price.price ?? 0);
      const extraUnitPrice = this.toNumber(price.extra_unit_price ?? price.extraUnitPrice ?? price.extra_price ?? price.extraPrice ?? price.extras ?? 0);
      const total = this.getNullableNumber(price.total ?? price.total_price ?? price.totalPrice ?? price.price_total);
      const extraTotal = this.getNullableNumber(price.extra_total ?? price.extraTotal ?? price.extras_total ?? price.extrasTotal);

      return {
        id: price.id ?? price.price_id ?? price.product_price_id ?? price.quantity_id ?? index,
        quantity,
        unitPrice,
        extraUnitPrice,
        total,
        extraTotal,
        currency,
        currencySymbol,
        selected: Boolean(price.selected ?? price.is_selected ?? price.default ?? price.is_default),
        order: Number(price.order ?? price.position ?? price.sort_order ?? index)
      };
    }).filter((price) => price.quantity > 0).sort((firstPrice, secondPrice) => firstPrice.order - secondPrice.order);
  }

  extractPrices(data = []) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];

    if (Array.isArray(data.prices)) return data.prices;
    if (Array.isArray(data.price)) return data.price;
    if (Array.isArray(data.product_prices)) return data.product_prices;
    if (Array.isArray(data.quantities)) return data.quantities;
    if (Array.isArray(data.pack_sizes)) return data.pack_sizes;
    if (Array.isArray(data.packSizes)) return data.packSizes;
    if (Array.isArray(data.price_options)) return data.price_options;
    if (Array.isArray(data.priceOptions)) return data.priceOptions;

    if (data.data) return this.extractPrices(data.data);
    if (data.product) return this.extractPrices(data.product);

    return [];
  }

  groupPrices(prices = [], groupSize = 4) {
    const groups = [];

    for (let index = 0; index < prices.length; index += groupSize) {
      groups.push(prices.slice(index, index + groupSize));
    }

    return groups;
  }

  getUnitTotal(price = this.selectedPrice) {
    if (!price) return 0;
    if (price.total !== null) return Number(price.total) || 0;

    return (Number(price.unitPrice) || 0) * (Number(price.quantity) || 0);
  }

  getExtraTotal(price = this.selectedPrice) {
    if (!price) return 0;
    if (price.extraTotal !== null) return Number(price.extraTotal) || 0;

    return (Number(price.extraUnitPrice) || 0) * (Number(price.quantity) || 0);
  }

  getTotal(price = this.selectedPrice) {
    if (!price) return 0;

    return this.getUnitTotal(price) + this.getExtraTotal(price);
  }

  formatMoney(value, symbol = this.currencySymbol) {
    const amount = Number(value) || 0;

    return `${symbol}${amount.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  formatQuantity(quantity) {
    return (Number(quantity) || 0).toLocaleString("en-GB");
  }

  setPriceElement(elementId, value) {
    const element = document.getElementById(elementId);

    if (!element) return false;

    const amount = Number(value) || 0;
    const parts = amount.toFixed(2).split(".");

    element.innerHTML = `${parts[0]}<span class="sp-price-minor">.${parts[1]}</span>`;

    return true;
  }

  setText(elementId, value) {
    const element = document.getElementById(elementId);

    if (!element) return false;

    element.textContent = value;
    return true;
  }

  notifyPreviewLogic(price) {
    if (!this.previewLogic) return false;

    if (typeof this.previewLogic.setPriceSelected === "function") {
      this.previewLogic.setPriceSelected(price);
    } else {
      this.previewLogic.priceSelected = price;
    }

    return true;
  }

  findPreviouslySelectedPrice() {
    if (!this.selectedPrice) return null;

    return this.prices.find((price) => String(price.id) === String(this.selectedPrice.id)) || null;
  }

  getCurrencySymbol(currency = "") {
    const symbols = {
      GBP: "£",
      USD: "$",
      EUR: "€",
      COP: "$",
      CAD: "$",
      AUD: "$"
    };

    return symbols[String(currency).toUpperCase()] || this.currencySymbol;
  }

  toNumber(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (value === null || value === undefined || value === "") return 0;

    const normalisedValue = String(value).replace(/[^0-9.-]+/g, "");
    const number = Number(normalisedValue);

    return Number.isFinite(number) ? number : 0;
  }

  getNullableNumber(value) {
    if (value === null || value === undefined || value === "") return null;

    return this.toNumber(value);
  }

  showPricesSection() {
    if (!this.container) return false;

    const section = this.container.closest(".sp-packsize");

    if (section) section.hidden = false;

    return true;
  }

  hidePricesSection() {
    if (!this.container) return false;

    const section = this.container.closest(".sp-packsize");

    if (section) section.hidden = true;

    return true;
  }

  clearPrices() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.prices = [];
    this.selectedPrice = null;
    this.container.innerHTML = "";
    this.hidePricesSection();
    this.resetPriceSummary();

    return true;
  }

  clearPrice() {
    return this.clearPrices();
  }

  setPrices(data = []) {
    return this.renderPrices(data);
  }

  setPriceSelected(price) {
    if (!price) {
      this.selectedPrice = null;
      return false;
    }

    const priceId = typeof price === "object" ? price.id : price;

    return this.selectPrice(priceId);
  }

  getPrices() {
    return this.prices;
  }

  getPriceSelected() {
    return this.selectedPrice;
  }

  getPriceById(priceId) {
    return this.prices.find((price) => String(price.id) === String(priceId)) || null;
  }

  getPriceByQuantity(quantity) {
    return this.prices.find((price) => Number(price.quantity) === Number(quantity)) || null;
  }
}

window.Prices = Prices;
