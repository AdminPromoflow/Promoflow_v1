// prices.js

class Prices {
  constructor() {
    this.maxQuantity = null;
    this.selectedPrice = null;
    this.requestVersion = 0;
  }

  /* ==========================================================================
    DELETE PRICES
  ========================================================================== */

  deletePrices(typeId) {
    const safeTypeId = String(typeId ?? "").trim();

    if (!safeTypeId) return false;

    const wrapper = document.getElementById(`wrap-price-${safeTypeId}`);

    if (!wrapper) return false;

    wrapper.remove();

    return true;
  }

  /* ==========================================================================
    RENDER PRICES
  ========================================================================== */

  renderPrices(pricesOnlyOfType = [], typeVariation = {}) {
    const selectedVariation = window.previewLogic?.getSelectVariation?.() ?? "";

    const selectedVariationId = Number(
      String(selectedVariation).replace(/^variation_id_/, "")
    );

    const parent = document.getElementById("wrap-prices-group");

    if (
      !parent ||
      !Number.isFinite(selectedVariationId) ||
      !Array.isArray(pricesOnlyOfType) ||
      pricesOnlyOfType.length === 0
    ) {
      return false;
    }

    const typeId = String(typeVariation?.type_id ?? "").trim();

    if (!typeId) return false;

    const wrapId = `wrap-price-${typeId}`;

    this.deletePrices(typeId);

    const wrapper = document.createElement("div");

    wrapper.className = "wrap-price";
    wrapper.id = wrapId;
    wrapper.dataset.typeId = typeId;

    for (const priceData of pricesOnlyOfType) {
      const variationId = Number(priceData?.variation_id);

      if (
        !Number.isFinite(variationId) ||
        variationId !== selectedVariationId
      ) {
        continue;
      }

      const priceDisplayMode = String(
        priceData?.price_display_mode ?? ""
      ).trim();

      if (priceDisplayMode !== "prices") continue;

      const priceId = String(priceData?.price_id ?? "").trim();
      const minQuantity = String(priceData?.min_quantity ?? "").trim();
      const maxQuantity = String(priceData?.max_quantity ?? "").trim();
      const price = String(priceData?.price ?? "").trim();

      if (!maxQuantity || !price) continue;

      const button = this.createPriceButton({
        priceId: priceId,
        minQuantity: minQuantity,
        maxQuantity: maxQuantity,
        price: price,
        variationId: variationId,
        priceDisplayMode: priceDisplayMode
      });

      wrapper.appendChild(button);
    }

    if (wrapper.children.length === 0) {
      return false;
    }

    parent.appendChild(wrapper);
    this.bindPriceButtons(wrapper);

    return true;
  }

  createPriceButton({
    priceId = "",
    minQuantity = "",
    maxQuantity = "",
    price = "",
    variationId = "",
    priceDisplayMode = ""
  } = {}) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "var-option js-scale-in js-price-option";
    button.value = String(price);
    button.dataset.priceId = String(priceId);
    button.dataset.minQuantity = String(minQuantity);
    button.dataset.maxQuantity = String(maxQuantity);
    button.dataset.price = String(price);
    button.dataset.variationId = String(variationId);
    button.dataset.priceDisplayMode = String(priceDisplayMode);
    button.setAttribute("aria-pressed", "false");

    const label = document.createElement("span");

    label.className = "opt-main";
    label.textContent = String(minQuantity);

    button.appendChild(label);

    return button;
  }

  /* ==========================================================================
    PRICE EVENTS
  ========================================================================== */

  bindPriceButtons(scope) {
    const container =
      scope instanceof HTMLElement
        ? scope
        : document.querySelector(String(scope ?? ""));

    if (!container) return false;

    const buttons = Array.from(
      container.querySelectorAll(".js-price-option")
    );

    if (buttons.length === 0) return false;

    for (const button of buttons) {
      if (button.dataset.bound === "1") continue;

      button.dataset.bound = "1";

      button.addEventListener("click", (event) => {
        const selectedButton = event.currentTarget;

        if (!(selectedButton instanceof HTMLButtonElement)) return;

        this.selectPriceButton(selectedButton, container);
      });
    }

    this.selectPriceButton(buttons[0], container);

    return true;
  }

  selectFirstAvailablePrice() {
    const selectedButton = document.querySelector(
      "#wrap-prices-group .js-price-option.is-selected"
    );

    if (selectedButton instanceof HTMLButtonElement) {
      return this.selectPriceButton(
        selectedButton,
        selectedButton.closest(".wrap-price")
      );
    }

    const firstButton = document.querySelector(
      "#wrap-prices-group .js-price-option"
    );

    if (!(firstButton instanceof HTMLButtonElement)) {
      return false;
    }

    return this.selectPriceButton(
      firstButton,
      firstButton.closest(".wrap-price")
    );
  }

  selectFirstPrice() {
    return this.selectFirstAvailablePrice();
  }

  selectPriceButton(button, scope = null) {
    if (!(button instanceof HTMLButtonElement)) {
      return false;
    }

    const container =
      scope instanceof HTMLElement
        ? scope
        : button.closest(".wrap-price");

    if (!container || !container.contains(button)) {
      return false;
    }

    const buttons = container.querySelectorAll(
      ".js-price-option"
    );

    for (const item of buttons) {
      const isSelected = item === button;

      item.classList.toggle("is-selected", isSelected);
      item.setAttribute(
        "aria-pressed",
        isSelected ? "true" : "false"
      );
    }

    const payload = this.getPricePayload(button);

    if (!payload) return false;

    this.setSelectedPrice(payload);
    this.setMaxQuantity(payload.max_quantity);
    this.onPriceSelected(payload, button);
    this.updateProductSummaryBox(
      payload.min_quantity,
      payload.price
    );

    this.updateVariationPrices();

    return true;
  }

  getPricePayload(button) {
    if (!(button instanceof HTMLButtonElement)) {
      return null;
    }

    const price = String(
      button.dataset.price ?? button.value ?? ""
    ).trim();

    const minQuantity = String(
      button.dataset.minQuantity ?? ""
    ).trim();

    const maxQuantity = String(
      button.dataset.maxQuantity ?? ""
    ).trim();

    if (!price || !maxQuantity) {
      return null;
    }

    return {
      price_id: String(button.dataset.priceId ?? ""),
      min_quantity: minQuantity,
      max_quantity: maxQuantity,
      price: price,
      variation_id: String(button.dataset.variationId ?? ""),
      price_display_mode: String(
        button.dataset.priceDisplayMode ?? ""
      ),
      value: String(button.value ?? "")
    };
  }

  /* ==========================================================================
    PRODUCT SUMMARY
  ========================================================================== */

  updateProductSummaryBox(quantity, price) {
    const totalExtraPrice = this.getSelectedExtraPriceTotal();

    const numericQuantity = this.parseNumber(quantity);
    const numericPrice = this.parseNumber(price);

    const safeQuantity = numericQuantity > 0
      ? numericQuantity
      : 0;

    const safePrice = numericPrice >= 0
      ? numericPrice
      : 0;

    const unitTotal = safePrice * safeQuantity;
    const extrasQuantity = totalExtraPrice === 0
      ? 0
      : safeQuantity;

    const extrasTotal = totalExtraPrice * safeQuantity;
    const grandTotal = unitTotal + extrasTotal;

    this.setText(
      "bb_unit",
      `£${this.formatPrice(safePrice)}`
    );

    this.setText(
      "bb_unit_quantity",
      this.formatQuantity(safeQuantity)
    );

    this.setText(
      "bb_unit_total",
      `£${this.formatPrice(unitTotal)}`
    );

    this.setText(
      "bb_extra_unit",
      `£${this.formatPrice(totalExtraPrice)}`
    );

    this.setText(
      "bb_extra_quantity",
      this.formatQuantity(extrasQuantity)
    );

    this.setText(
      "bb_extra_total",
      `£${this.formatPrice(extrasTotal)}`
    );

    this.setText(
      "bb_total",
      `£${this.formatPrice(grandTotal)}`
    );

    this.setText(
      "sp_price",
      this.formatPrice(safePrice)
    );

    this.setText(
      "var_label_quantity",
      this.formatQuantity(safeQuantity)
    );

    this.setText(
      "sp_unit_hint",
      `per ${this.formatQuantity(safeQuantity)} units`
    );

    return true;
  }

  getSelectedExtraPriceTotal() {
    const selectedVariationButtons = document.querySelectorAll(
      "#wrap-variations-group .var-option.is-selected"
    );

    let total = 0;

    for (const button of selectedVariationButtons) {
      const extraPriceElement = button.querySelector(
        ".opt-price-extra"
      );

      if (!extraPriceElement) continue;

      const datasetPrice = String(
        extraPriceElement.dataset.extraPrice ?? ""
      ).trim();

      const visiblePrice = String(
        extraPriceElement.textContent ?? ""
      )
        .replace("+", "")
        .replace("p/u", "")
        .trim();

      const price = this.parseNumber(
        datasetPrice || visiblePrice
      );

      if (price >= 0) {
        total += price;
      }
    }

    return total;
  }

  /* ==========================================================================
    VARIATION EXTRA PRICES
  ========================================================================== */

  async updateVariationPrices() {
    const variationButtons = document.querySelectorAll(
      "#wrap-variations-group .var-option[id^='variation_id_']"
    );

    const ids = Array.from(variationButtons)
      .map((button) => {
        return Number(
          String(button.id).replace(/^variation_id_/, "")
        );
      })
      .filter((id) => {
        return Number.isFinite(id) && id > 0;
      });

    if (ids.length === 0) {
      return false;
    }

    const maxQuantity = String(
      this.getMaxQuantity() ?? ""
    ).trim();

    if (!maxQuantity) {
      return false;
    }

    const requestVersion = ++this.requestVersion;

    const url = "../../controller/order/product.php";

    const data = {
      action: "get_variation_prices",
      ids: [...new Set(ids)],
      max_quantity: maxQuantity
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
      const responseData = this.parseJson(text);

      if (
        requestVersion !== this.requestVersion ||
        !responseData ||
        typeof responseData !== "object"
      ) {
        return false;
      }

      const variationPrices = Array.isArray(
        responseData.prices
      )
        ? responseData.prices
        : [];

      this.drawExtraVariationPrices(variationPrices);

      return true;
    } catch (error) {
      if (requestVersion === this.requestVersion) {
        console.error(
          "Error fetching variation prices:",
          error
        );
      }

      return false;
    }
  }

  drawExtraVariationPrices(data = []) {
    if (!Array.isArray(data)) return false;

    this.clearExtraVariationPrices();

    for (const row of data) {
      const variationId = String(
        row?.variation_id ?? ""
      ).trim();

      if (!variationId) continue;

      const button = document.getElementById(
        `variation_id_${variationId}`
      );

      if (!button) continue;

      const rawExtraPrice =
        row?.price?.price ??
        row?.price ??
        null;

      if (
        rawExtraPrice === null ||
        rawExtraPrice === undefined ||
        String(rawExtraPrice).trim() === ""
      ) {
        continue;
      }

      const numericExtraPrice = this.parseNumber(
        rawExtraPrice
      );

      if (numericExtraPrice < 0) continue;

      const priceElement = document.createElement("span");

      priceElement.className = "opt-price-extra";
      priceElement.dataset.extraPrice = String(
        numericExtraPrice
      );

      priceElement.textContent =
        `+${this.formatPrice(numericExtraPrice)} p/u`;

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

  clearExtraVariationPrices() {
    const priceElements = document.querySelectorAll(
      "#wrap-variations-group .opt-price-extra"
    );

    for (const element of priceElements) {
      element.remove();
    }
  }

  /* ==========================================================================
    STATE
  ========================================================================== */

  setSelectedPrice(payload = null) {
    this.selectedPrice =
      payload && typeof payload === "object"
        ? payload
        : null;
  }

  getSelectedPrice() {
    return this.selectedPrice;
  }

  setMaxQuantity(maxQuantity) {
    const value = String(maxQuantity ?? "").trim();

    this.maxQuantity = value || null;
  }

  getMaxQuantity() {
    return this.maxQuantity;
  }

  onPriceSelected(payload, button = null) {
    // Optional hook.
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

  formatQuantity(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return Number.isInteger(number)
      ? String(number)
      : String(number);
  }

  setText(elementId, value = "") {
    const element = document.getElementById(elementId);

    if (element) {
      element.textContent = String(value ?? "");
    }
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

const prices = new Prices();

window.prices = prices;
