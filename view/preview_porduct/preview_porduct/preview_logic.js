// preview_logic.js

class PreviewLogic {
  constructor() {
    this.variations = new Variations(this);
    this.images = new Images(this);
    this.items = new Items(this);
    this.prices = new Prices(this);
    this.artwork = new Artwork(this);

    this.bindMainButtons();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init(), { once: true });
    } else {
      this.init();
    }
  }

  init() {
    this.variations.init();
    this.images.init();
    this.items.init();
    this.prices.init();
    this.artwork.init();

    window.previewGallery?.init?.();

    this.getDataProduct();
  }

  bindMainButtons() {
    const backBtn = document.getElementById("btn_back_edit");
    const publishBtn = document.getElementById("btn_publish");
    const btnMsnSupplier = document.getElementById("btn_msn_supplier");

    if (backBtn && backBtn.dataset.bound !== "1") {
      backBtn.dataset.bound = "1";
      backBtn.addEventListener("click", () => this.backBtn());
    }

    if (publishBtn && publishBtn.dataset.bound !== "1") {
      publishBtn.dataset.bound = "1";
      publishBtn.addEventListener("click", () => this.publishBtn());
    }

    if (btnMsnSupplier && btnMsnSupplier.dataset.bound !== "1") {
      btnMsnSupplier.dataset.bound = "1";
      btnMsnSupplier.addEventListener("click", () => this.MsnSupplier());
    }
  }

  MsnSupplier() {
    const params = new URLSearchParams(window.location.search);
    const sku = String(params.get("sku") ?? "").trim();

    if (!sku) {
      console.warn("No SKU in URL");
      return false;
    }

    window.location.href = `../../view/messages/index.php?sku=${encodeURIComponent(sku)}`;
    return true;
  }

  publishBtn() {
    const params = new URLSearchParams(window.location.search);
    const sku = String(params.get("sku") ?? "").trim();

    if (!sku) {
      console.warn("No SKU in URL");
      return false;
    }

    const url = "../../controller/dot63/requests_63_api.php";

    const data = {
      action: "publish_product",
      sku: sku
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
        alert(text);

        try {
          JSON.parse(text);
        } catch (error) {
          console.warn("The publish response is not valid JSON.", error);
        }
      })
      .catch((error) => {
        console.error("Error publishing product:", error);
      });

    return true;
  }

  backBtn() {
    window.location.href = "../../view/overview/index.php";
  }

  /* ==========================================================================
    PRODUCT DATA
  ========================================================================== */

  getDataProduct() {
    const params = new URLSearchParams(window.location.search);
    const sku = String(params.get("sku") ?? "").trim();

    if (!sku) {
      console.warn("No SKU in URL");
      return false;
    }

    const url = "../../controller/dot63/requests_63_api.php";

    const data = {
      action: "get_preview_product_details",
      sku: sku
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
        const json = JSON.parse(text);

        if (!Array.isArray(json)) {
          throw new Error("Invalid product preview response.");
        }

        const companyName = json.find((row) => row?.company_name)?.company_name ?? "";
        const categoryName = json.find((row) => row?.category_name)?.category_name ?? "";
        const groupName = json.find((row) => row?.group_name)?.group_name ?? "";
        const defaultVariationId = json.find((row) => row?.default_variation_id)?.default_variation_id ?? "";
        const productDetails = json.find((row) => row?.product_details)?.product_details ?? {};

        const productName = productDetails?.product_name ?? "";
        const descriptiveTagline = productDetails?.descriptive_tagline ?? "";
        const description = productDetails?.description ?? "";

        this.renderBreadcrumb(categoryName, groupName);
        this.renderSectionLabel(categoryName);
        this.renderProductTitle(productName);
        this.renderBrandName(companyName);
        this.renderTagline(descriptiveTagline);
        this.renderDescription(description);

        this.deleteGroupsContent();
        this.variations.reset();
        this.variations.fetchChildVariationsById(defaultVariationId);
      })
      .catch((error) => {
        console.error("Error fetching preview:", error);
      });

    return true;
  }

  /* ==========================================================================
    GROUP CLEANUP
  ========================================================================== */

  deleteGroupsContent() {
    this.variations.clearVariations();
    this.images.clearImages();
    this.items.clearItems();
    this.prices.clearPrices();
    this.artwork.clearArtwork();

    window.previewGallery?.clearGallery?.();
  }

  /* ==========================================================================
    BASIC RENDER HELPERS
  ========================================================================== */

  renderBreadcrumb(categoryName = "", groupName = "") {
    const breadcrumbs = document.getElementById("sp_breadcrumbs");

    if (!breadcrumbs) return false;

    breadcrumbs.replaceChildren();

    const categoryItem = this.createBreadcrumbItem(categoryName);
    const groupItem = this.createBreadcrumbItem(groupName);

    breadcrumbs.appendChild(categoryItem);
    breadcrumbs.appendChild(groupItem);

    return true;
  }

  createBreadcrumbItem(text = "") {
    const item = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.textContent = String(text ?? "");

    link.addEventListener("click", (event) => {
      event.preventDefault();
    });

    item.appendChild(link);

    return item;
  }

  renderSectionLabel(categoryName = "") {
    return this.setText("sp_category", categoryName);
  }

  renderProductTitle(productName = "") {
    return this.setText("sp-title", productName);
  }

  renderBrandName(companyName = "") {
    return this.setText("sp-brand", companyName);
  }

  renderTagline(descriptiveTagline = "") {
    return this.setText("sp_subtitle", descriptiveTagline);
  }

  renderDescription(description = "") {
    return this.setText("sp_desc", description);
  }

  setText(elementId, value = "") {
    const element = document.getElementById(elementId);

    if (!element) return false;

    element.textContent = String(value ?? "");
    return true;
  }

  /* ==========================================================================
    COMPATIBILITY METHODS
  ========================================================================== */

  fetchChildVariationsById(variationId) {
    return this.variations.fetchChildVariationsById(variationId);
  }

  organizeCurrentVariation(currentVariationData = {}) {
    return this.variations.organizeCurrentVariation(currentVariationData);
  }

  organizeVariationsForRender(childVariations = [], variationTypes = []) {
    return this.variations.organizeVariationsForRender(childVariations, variationTypes);
  }

  organizeVariationsForDelete(variationTypes = [], currentTypeId = null) {
    return this.variations.organizeVariationsForDelete(variationTypes, currentTypeId);
  }

  renderVariations(childVariations = [], typeVariation = {}) {
    return this.variations.renderVariations(childVariations, typeVariation);
  }

  SelectVariation(domId = "") {
    return this.variations.SelectVariation(domId);
  }

  setSelectVariation(domId = "") {
    return this.variations.setSelectVariation(domId);
  }

  getSelectVariation() {
    return this.variations.getSelectVariation();
  }

  renderImages(data = [], typeVariation = {}) {
    return this.images.renderImages(data, typeVariation);
  }

  deleteImages(typeId) {
    return this.images.deleteImages(typeId);
  }

  renderItems(data = [], typeVariation = {}) {
    return this.items.renderItems(data, typeVariation);
  }

  deleteItems(typeId) {
    return this.items.deleteItems(typeId);
  }

  renderPrices(data = [], typeVariation = {}) {
    return this.prices.renderPrices(data, typeVariation);
  }

  deletePrices(typeId) {
    return this.prices.deletePrices(typeId);
  }

  updateVariationPrices() {
    return this.prices.updateVariationPrices();
  }

  updateProductSummaryBox(quantity, price) {
    return this.prices.updateProductSummaryBox(quantity, price);
  }

  drawExtraVariationPrices(data = []) {
    return this.prices.drawExtraVariationPrices(data);
  }

  setSelectedPrice(payload = null) {
    return this.prices.setSelectedPrice(payload);
  }

  getSelectedPrice() {
    return this.prices.getSelectedPrice();
  }

  setMaxQuantity(maxQuantity) {
    return this.prices.setMaxQuantity(maxQuantity);
  }

  getMaxQuantity() {
    return this.prices.getMaxQuantity();
  }

  renderArtwork(data = [], typeVariation = {}) {
    return this.artwork.renderArtwork(data, typeVariation);
  }

  deleteArtwork(typeId) {
    return this.artwork.deleteArtwork(typeId);
  }
}

const previewLogic = new PreviewLogic();

window.previewLogic = previewLogic;
