// preview_logic.js

class PreviewLogic {
  constructor() {
    this.variations = new Variations(this);
    this.isPublishing = false;
  }

  init() {
    this.bindMainButtons();
    this.variations.init();
    this.getDataProduct();
  }

  bindMainButtons() {
    const backBtn = document.getElementById("btn_back_edit");
    const publishBtn = document.getElementById("btn_publish");

    if (backBtn && backBtn.dataset.bound !== "1") {
      backBtn.dataset.bound = "1";
      backBtn.addEventListener("click", () => this.backBtn());
    }

    if (publishBtn && publishBtn.dataset.bound !== "1") {
      publishBtn.dataset.bound = "1";
      publishBtn.addEventListener("click", () => this.publishBtn());
    }
  }

  async publishBtn() {
    if (this.isPublishing) return;

    const params = new URLSearchParams(window.location.search);
    const sku = String(params.get("sku") ?? "").trim();

    if (!sku) {
      console.warn("No SKU in URL.");
      return;
    }

    const publishBtn = document.getElementById("btn_publish");
    const url = "../../controller/products/product.php";

    const data = {
      action: "publish_product",
      sku: sku
    };

    this.isPublishing = true;

    if (publishBtn) {
      publishBtn.disabled = true;
      publishBtn.setAttribute("aria-busy", "true");
    }

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

      if (!responseData) {
        alert(text || "Invalid server response.");
        return;
      }

      alert(responseData.message || "Product published successfully.");

      if (responseData.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error publishing product:", error);
      alert("The product could not be published. Please try again.");
    } finally {
      this.isPublishing = false;

      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.removeAttribute("aria-busy");
      }
    }
  }

  backBtn() {
    const currentUrl = new URL(window.location.href);
    const destinationUrl = new URL("../../view/product_details/index.php", currentUrl);

    const sku = String(currentUrl.searchParams.get("sku") ?? "").trim();
    const skuVariation = String(currentUrl.searchParams.get("sku_variation") ?? "").trim();

    if (sku) destinationUrl.searchParams.set("sku", sku);
    if (skuVariation) destinationUrl.searchParams.set("sku_variation", skuVariation);

    window.location.assign(destinationUrl.href);
  }

  async getDataProduct() {
    const params = new URLSearchParams(window.location.search);
    const sku = String(params.get("sku") ?? "").trim();

    if (!sku) {
      console.warn("No SKU in URL.");
      return false;
    }

    const url = "../../controller/order/product.php";

    const data = {
      action: "get_preview_product_details",
      sku: sku
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

      if (!Array.isArray(json)) {
        throw new Error("Invalid product preview response.");
      }

      const companyName = this.findResponseValue(json, "company_name", "");
      const categoryName = this.findResponseValue(json, "category_name", "");
      const groupName = this.findResponseValue(json, "group_name", "");
      const defaultVariationId = this.findResponseValue(json, "default_variation_id", "");
      const productDetails = this.findResponseValue(json, "product_details", {});

      const safeProductDetails =
        productDetails && typeof productDetails === "object" && !Array.isArray(productDetails)
          ? productDetails
          : {};

      const productName = String(safeProductDetails.product_name ?? "");
      const descriptiveTagline = String(safeProductDetails.descriptive_tagline ?? "");
      const description = String(safeProductDetails.description ?? "");
      const status = Number(safeProductDetails.status ?? 0);
      const isApproved = Number(safeProductDetails.is_approved ?? 0) === 1;
      const isPublished = status === 2;

      this.updatePublishButton(isApproved, isPublished);
      this.renderBreadcrumb(categoryName, groupName);
      this.renderSectionLabel(categoryName);
      this.renderProductTitle(productName);
      this.renderBrandName(companyName);
      this.renderTagline(descriptiveTagline);
      this.renderDescription(description);

      this.variations.reset();
      this.deleteGroupsContent();

      const variationId = String(defaultVariationId ?? "").trim();

      if (variationId) {
        this.variations.fetchChildVariationsById(variationId);
      } else {
        console.warn("No default variation ID found.");
      }

      return true;
    } catch (error) {
      console.error("Error fetching preview:", error);
      return false;
    }
  }

  updatePublishButton(isApproved = false, isPublished = false) {
    const publishBtn = document.getElementById("btn_publish");

    if (!publishBtn) return;

    const shouldHide = Boolean(isApproved || isPublished);

    publishBtn.hidden = shouldHide;
    publishBtn.style.display = shouldHide ? "none" : "";
    publishBtn.disabled = shouldHide;
  }

  deleteGroupsContent() {
    const groupIds = [
      "wrap-variations-group",
      "wrap-images-group",
      "wrap-items-group",
      "wrap-prices-group",
      "wrap-artworks-group"
    ];

    for (const groupId of groupIds) {
      const group = document.getElementById(groupId);

      if (group) {
        group.replaceChildren();
      }
    }

    window.previewGallery?.clearGallery?.();
  }

  renderBreadcrumb(categoryName = "", groupName = "") {
    const breadcrumbs = document.getElementById("sp_breadcrumbs");

    if (!breadcrumbs) return;

    breadcrumbs.replaceChildren();

    if (categoryName) {
      breadcrumbs.appendChild(this.createBreadcrumbItem(categoryName));
    }

    if (groupName) {
      breadcrumbs.appendChild(this.createBreadcrumbItem(groupName));
    }
  }

  createBreadcrumbItem(label = "") {
    const item = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.textContent = String(label ?? "");

    link.addEventListener("click", (event) => {
      event.preventDefault();
    });

    item.appendChild(link);

    return item;
  }

  renderSectionLabel(categoryName = "") {
    this.setElementText("sp_category", categoryName);
  }

  renderProductTitle(productName = "") {
    this.setElementText("sp-title", productName);
  }

  renderBrandName(companyName = "") {
    this.setElementText("sp-brand", companyName);
  }

  renderTagline(descriptiveTagline = "") {
    this.setElementText("sp_subtitle", descriptiveTagline);
  }

  renderDescription(description = "") {
    this.setElementText("sp_desc", description);
  }

  setElementText(elementId, value = "") {
    const element = document.getElementById(elementId);

    if (element) {
      element.textContent = String(value ?? "");
    }
  }

  selectVariation(domId = "", automatic = false, variationRow = null) {
    return this.variations.selectVariation(domId, automatic, variationRow);
  }

  setSelectVariation(domId = "") {
    this.variations.setSelectVariation(domId);
  }

  getSelectVariation() {
    return this.variations.getSelectVariation();
  }

  getSelectedVariationId() {
    return this.variations.getSelectedVariationId();
  }

  getShouldDeleteItems() {
    return this.variations.getShouldDeleteItems();
  }

  findResponseValue(rows = [], property = "", fallback = null) {
    if (!Array.isArray(rows) || !property) return fallback;

    const row = rows.find((item) => {
      return item && typeof item === "object" &&
        Object.prototype.hasOwnProperty.call(item, property);
    });

    return row?.[property] ?? fallback;
  }

  parseJson(text = "") {
    try {
      return JSON.parse(String(text ?? ""));
    } catch (error) {
      console.error("Invalid JSON response:", error, text);
      return null;
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

let previewLogic = null;
let variations = null;

function createPreviewLogic() {
  if (window.previewLogic instanceof PreviewLogic) return;

  previewLogic = new PreviewLogic();
  variations = previewLogic.variations;

  window.previewLogic = previewLogic;
  window.variations = variations;

  previewLogic.init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createPreviewLogic, { once: true });
} else {
  createPreviewLogic();
}
