// prices.js

class Prices {
  constructor(previewLogic = null) {
    this.previewLogic = previewLogic;
    this.container = null;
    this.maxQuantity = null;
    this.priceSelected = null;
    this.requestVersion = 0;
  }

  init() {
    this.container = document.getElementById("wrap-prices-group");
    return Boolean(this.container);
  }

  renderPrice(data = [], typeVariation = {}) {
    return this.renderPrices(data, typeVariation);
  }

  renderPrices(pricesOnlyOfType = [], typeVariation = {}) {
    if (!this.container) this.init();
    if (!this.container) return false;

    window.loader?.show?.();

    const selectedVariationId = Number(
      String(this.previewLogic?.variations?.getSelectVariation?.() ?? "")
        .replace(/^variation_id_/, "")
    );

    if (!Number.isFinite(selectedVariationId)) return false;

    const typeId = String(typeVariation?.type_id ?? "").trim();

    if (!typeId) return false;

    this.deletePrices(typeId);

    const wrapper = document.createElement("div");

    wrapper.className = "wrap-price";
    wrapper.id = `wrap-price-${typeId}`;
    wrapper.dataset.typeId = typeId;

    for (const priceData of pricesOnlyOfType) {
      if (Number(priceData?.variation_id) !== selectedVariationId) continue;
      if (String(priceData?.price_display_mode ?? "").trim() !== "prices") continue;

      const priceId = String(priceData?.price_id ?? "").trim();
      const minQuantity = String(priceData?.min_quantity ?? "").trim();
      const maxQuantity = String(priceData?.max_quantity ?? "").trim();
      const price = String(priceData?.price ?? "").trim();

      if (!maxQuantity) continue;

      const button = document.createElement("button");

      button.type = "button";
      button.className = "var-option js-scale-in js-price-option";
      button.value = price;
      button.dataset.priceId = priceId;
      button.dataset.minQuantity = minQuantity;
      button.dataset.maxQuantity = maxQuantity;
      button.dataset.price = price;
      button.dataset.variationId = String(priceData?.variation_id ?? "");
      button.dataset.priceDisplayMode = String(priceData?.price_display_mode ?? "");
      button.setAttribute("aria-pressed", "false");

      const main = document.createElement("span");

      main.className = "opt-main";
      main.textContent = minQuantity;

      button.appendChild(main);
      wrapper.appendChild(button);
    }

    if (wrapper.children.length === 0) return false;

    this.container.appendChild(wrapper);
    this.bindPriceButtons(wrapper);

    return true;
  }

  bindPriceButtons(scope) {
    const container = scope instanceof HTMLElement
      ? scope
      : document.querySelector(String(scope ?? ""));

    if (!container) return false;

    const buttons = Array.from(container.querySelectorAll(".js-price-option"));

    if (buttons.length === 0) return false;

    for (const button of buttons) {
      if (button.dataset.bound === "1") continue;

      button.dataset.bound = "1";

      button.addEventListener("click", () => {
        this.selectPriceButton(button, container);
        this.updateProductSummaryBox(button.dataset.minQuantity, button.value);
      });
    }

    this.selectPriceButton(buttons[0], container);
    this.updateProductSummaryBox(buttons[0].dataset.minQuantity, buttons[0].value);

    return true;
  }

  selectFirstAvailablePrice() {
    const firstButton = document.querySelector(
      "#wrap-prices-group .js-price-option"
    );

    if (!(firstButton instanceof HTMLButtonElement)) {
      window.loader?.hide?.();
      return false;
    }

    const scope = firstButton.closest(".wrap-price");

    this.selectPriceButton(firstButton, scope);
    this.updateProductSummaryBox(firstButton.dataset.minQuantity, firstButton.value);

    window.loader?.hide?.();

    return true;
  }

  selectPriceButton(button, scope = null) {
    if (!(button instanceof HTMLButtonElement)) return false;

    const container = scope instanceof HTMLElement
      ? scope
      : button.closest(".wrap-price");

    if (!container) return false;

    const buttons = container.querySelectorAll(".js-price-option");

    for (const currentButton of buttons) {
      const selected = currentButton === button;

      currentButton.classList.toggle("is-selected", selected);
      currentButton.setAttribute("aria-pressed", selected ? "true" : "false");
    }

    const payload = {
      price_id: String(button.dataset.priceId ?? ""),
      min_quantity: String(button.dataset.minQuantity ?? ""),
      max_quantity: String(button.dataset.maxQuantity ?? ""),
      price: String(button.dataset.price ?? ""),
      value: String(button.value ?? "")
    };

    this.setSelectedPrice(payload);
    this.setMaxQuantity(payload.max_quantity);
    this.onPriceSelected(payload, button);
    this.updateVariationPrices();

    return true;
  }

  updateProductSummaryBox(quantity, price) {
    const selectedVariations = document.querySelectorAll(
      "#wrap-variations-group .var-option.is-selected"
    );

    let totalExtraPrice = 0;

    for (const selectedVariation of selectedVariations) {
      const extraPriceElement = selectedVariation.querySelector(".opt-price-extra");

      if (!extraPriceElement) continue;

      const rawPrice =
        extraPriceElement.dataset.extraPrice ||
        extraPriceElement.textContent
          .replace("+", "")
          .replace("p/u", "")
          .trim();

      const extraPrice = this.parseNumber(rawPrice);

      totalExtraPrice += extraPrice;
    }

    const numericQuantity = this.parseNumber(quantity);
    const numericPrice = this.parseNumber(price);

    const unitTotal = numericPrice * numericQuantity;
    const extraQuantity = totalExtraPrice === 0 ? 0 : numericQuantity;
    const extrasTotal = totalExtraPrice * numericQuantity;
    const total = unitTotal + extrasTotal;

    this.setText("bb_unit", `£${this.formatPrice(numericPrice)}`);
    this.setText("bb_unit_quantity", numericQuantity);
    this.setText("bb_unit_total", `£${this.formatPrice(unitTotal)}`);

    this.setText("bb_extra_unit", `£${this.formatPrice(totalExtraPrice)}`);
    this.setText("bb_extra_quantity", extraQuantity);
    this.setText("bb_extra_total", `£${this.formatPrice(extrasTotal)}`);

    this.setText("bb_total", `£${this.formatPrice(total)}`);
    this.setText("sp_price", this.formatPrice(numericPrice));
    this.setText("var_label_quantity", numericQuantity);
    this.setText("sp_unit_hint", `per ${numericQuantity} units`);

    return true;
  }

  updateVariationPrices() {
    const variationButtons = document.querySelectorAll(
      "#wrap-variations-group .var-option[id^='variation_id_']"
    );

    const ids = Array.from(variationButtons)
      .map((button) => Number(button.id.replace(/^variation_id_/, "")))
      .filter((id) => Number.isFinite(id) && id > 0);

    const maxQuantity = this.getMaxQuantity();

    if (ids.length === 0 || !maxQuantity) return false;

    const requestVersion = ++this.requestVersion;

    const url = "../../controller/dot63/requests_63_api.php";

    const data = {
      action: "get_variation_prices",
      ids: [...new Set(ids)],
      max_quantity: maxQuantity
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
        if (requestVersion !== this.requestVersion) return;

        const json = JSON.parse(text);
        const prices = Array.isArray(json?.prices) ? json.prices : [];

        this.drawExtraVariationPrices(prices);
      })
      .catch((error) => {
        if (requestVersion === this.requestVersion) {
          console.error("Error fetching variation prices:", error);
        }
      });

    return true;
  }

  drawExtraVariationPrices(data = []) {
    const existingPrices = document.querySelectorAll(
      "#wrap-variations-group .opt-price-extra"
    );

    existingPrices.forEach((element) => element.remove());

    if (!Array.isArray(data)) return false;

    for (const row of data) {
      const variationId = String(row?.variation_id ?? "").trim();
      const button = document.getElementById(`variation_id_${variationId}`);

      if (!button) continue;

      const rawPrice = row?.price?.price ?? row?.price ?? "";
      const numericPrice = this.parseNumber(rawPrice);

      const priceElement = document.createElement("span");

      priceElement.className = "opt-price-extra";
      priceElement.dataset.extraPrice = String(numericPrice);
      priceElement.textContent = `+${this.formatPrice(numericPrice)} p/u`;

      button.appendChild(priceElement);
    }

    const selectedPrice = this.getSelectedPrice();

    if (selectedPrice) {
      this.updateProductSummaryBox(
        selectedPrice.min_quantity,
        selectedPrice.price
      );
    }

    return true;
  }

  deletePrices(typeId) {
    if (!this.container) this.init();
    if (!this.container) return false;

    const safeTypeId = String(typeId ?? "").trim();

    if (!safeTypeId) return false;

    document.getElementById(`wrap-price-${safeTypeId}`)?.remove();

    return true;
  }

  clearPrices() {
    if (!this.container) this.init();
    if (!this.container) return false;

    this.container.replaceChildren();
    this.priceSelected = null;
    this.maxQuantity = null;
    this.requestVersion++;

    return true;
  }

  setSelectedPrice(payload = null) {
    this.priceSelected = payload;
  }

  getSelectedPrice() {
    return this.priceSelected;
  }

  setMaxQuantity(maxQuantity) {
    this.maxQuantity = String(maxQuantity ?? "").trim() || null;
  }

  getMaxQuantity() {
    return this.maxQuantity;
  }

  onPriceSelected(payload, button = null) {
    window.previewGallery?.updatePrice?.(button);
  }

  parseNumber(value) {
    const number = Number(
      String(value ?? "")
        .trim()
        .replace(/,/g, "")
    );

    return Number.isFinite(number) ? number : 0;
  }

  formatPrice(value) {
    const number = Number(value);

    return Number.isFinite(number) ? number.toFixed(2) : "0.00";
  }

  setText(elementId, value = "") {
    const element = document.getElementById(elementId);

    if (element) {
      element.textContent = String(value ?? "");
    }
  }
}

window.Prices = Prices;
