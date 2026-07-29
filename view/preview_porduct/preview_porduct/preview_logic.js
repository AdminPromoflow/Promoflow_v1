// preview_logic.js

class PreviewLogic {
  constructor() {
    this.variations = new Variations(this);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  /* ============================================================================
    INITIALISE
  ============================================================================ */

  init() {
    this.bindMainButtons();
    this.variations.init();
    this.getDataProduct();
  }

  bindMainButtons() {
    const backBtn = document.getElementById("btn_back_edit");
    const publishBtn = document.getElementById("btn_publish");
    const messageSupplierBtn = document.getElementById("btn_msn_supplier");

    if (backBtn && backBtn.dataset.bound !== "1") {
      backBtn.dataset.bound = "1";
      backBtn.addEventListener("click", () => this.backBtn());
    }

    if (publishBtn && publishBtn.dataset.bound !== "1") {
      publishBtn.dataset.bound = "1";
      publishBtn.addEventListener("click", () => this.publishBtn());
    }

    if (messageSupplierBtn && messageSupplierBtn.dataset.bound !== "1") {
      messageSupplierBtn.dataset.bound = "1";
      messageSupplierBtn.addEventListener("click", () => this.messageSupplier());
    }
  }

  /* ============================================================================
    MAIN BUTTONS
  ============================================================================ */

  messageSupplier() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

    if (!sku) {
      console.warn("No SKU in URL");
      return false;
    }

    const destination = `../../view/messages/index.php?sku=${encodeURIComponent(sku)}`;
    window.location.assign(destination);

    return true;
  }

  MsnSupplier() {
    return this.messageSupplier();
  }

  publishBtn() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

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
          throw new Error("Network error.");
        }

        return response.text();
      })
      .then((text) => {
        let responseData;

        try {
          responseData = JSON.parse(text);
        } catch (error) {
          console.error("Invalid JSON response:", error);
          alert(text);
          return;
        }

        alert(responseData?.message || "Product published successfully.");

        if (responseData?.success) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error publishing product:", error);
      });

    return true;
  }

  backBtn() {
    const destination = "../../view/overview/index.php";
    window.location.assign(destination);

    return true;
  }

  /* ============================================================================
    PRODUCT DATA
  ============================================================================ */

  getDataProduct() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

    if (!sku) {
      console.warn("No SKU in URL");
      return false;
    }

    const url = "../../controller/dot63/requests_63_api.php";

    const data = {
      action: "get_preview_product_details",
      sku: sku
    };

    this.showLoader();

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error.");
        }

        return response.text();
      })
      .then((text) => {
        let json;

        try {
          json = JSON.parse(text);
        } catch (error) {
          console.error("Invalid product preview JSON:", error);
          console.error("Server response:", text);
          throw new Error("Invalid product preview response.");
        }

        if (!Array.isArray(json)) {
          throw new Error("Invalid product preview response.");
        }

        const companyName =
          json.find((row) => row?.company_name)?.company_name ?? "";

        const categoryName =
          json.find((row) => row?.category_name)?.category_name ?? "";

        const groupName =
          json.find((row) => row?.group_name)?.group_name ?? "";

        const defaultVariationId =
          json.find((row) => row?.default_variation_id)?.default_variation_id ?? "";

        const productDetails =
          json.find((row) => row?.product_details)?.product_details ?? {};

        const productName = productDetails?.product_name ?? "";
        const descriptiveTagline = productDetails?.descriptive_tagline ?? "";
        const description = productDetails?.description ?? "";
        const status = String(productDetails?.status ?? "");
        const isApprovedValue = String(productDetails?.is_approved ?? "");

        this.updatePublishButton(status, isApprovedValue);
        this.renderBreadcrumb(categoryName, groupName);
        this.renderSectionLabel(categoryName);
        this.renderProductTitle(productName);
        this.renderBrandName(companyName);
        this.renderTagline(descriptiveTagline);
        this.renderDescription(description);

        this.variations.reset();
        this.deleteGroupsContent();

        if (!defaultVariationId) {
          console.warn("No default variation id returned.");
          this.hideLoader();
          return;
        }

        this.fetchChildVariationsById(defaultVariationId);
      })
      .catch((error) => {
        console.error("Error fetching preview:", error);
        this.hideLoader();
      });

    return true;
  }

  updatePublishButton(status, isApprovedValue) {
    const publishBtn = document.getElementById("btn_publish");

    if (!publishBtn) return false;

    const isPublished = Number(status) === 2;
    const isApproved = Number(isApprovedValue) === 1;

    publishBtn.style.display = isPublished || isApproved ? "none" : "";

    return true;
  }

  /* ============================================================================
    GROUP CLEAN-UP
  ============================================================================ */

  deleteGroupsContent() {
    const groups = [
      document.getElementById("wrap-variations-group"),
      document.getElementById("wrap-images-group"),
      document.getElementById("wrap-items-group"),
      document.getElementById("wrap-prices-group"),
      document.getElementById("wrap-artworks-group")
    ];

    for (const group of groups) {
      if (group) {
        group.innerHTML = "";
      }
    }

    window.previewGallery?.clearGallery?.();

    return true;
  }

  /* ============================================================================
    BASIC PRODUCT RENDER
  ============================================================================ */

  renderBreadcrumb(categoryName, groupName) {
    const breadcrumbs = document.getElementById("sp_breadcrumbs");

    if (!breadcrumbs) return false;

    breadcrumbs.innerHTML = `
      <li><a href="#">${this.escapeHtml(categoryName)}</a></li>
      <li><a href="#">${this.escapeHtml(groupName)}</a></li>
    `;

    return true;
  }

  renderSectionLabel(categoryName) {
    const category = document.getElementById("sp_category");

    if (!category) return false;

    category.textContent = categoryName || "";

    return true;
  }

  renderProductTitle(productName) {
    const title = document.getElementById("sp-title");

    if (!title) return false;

    title.textContent = productName || "";

    return true;
  }

  renderBrandName(companyName) {
    const brand = document.getElementById("sp-brand");

    if (!brand) return false;

    brand.textContent = companyName || "";

    return true;
  }

  renderTagline(descriptiveTagline) {
    const subtitle = document.getElementById("sp_subtitle");

    if (!subtitle) return false;

    subtitle.textContent = descriptiveTagline || "";

    return true;
  }

  renderDescription(description) {
    const descriptionElement = document.getElementById("sp_desc");

    if (!descriptionElement) return false;

    descriptionElement.textContent = description || "";

    return true;
  }

  /* ============================================================================
    VARIATION PROXIES
    These methods communicate with variations.js.
  ============================================================================ */

  selectVariation(domId = "", automatic = false, variationRow = null) {
    return this.variations.selectVariation(domId, automatic, variationRow);
  }

  SelectVariation(domId = "", automatic = false, variationRow = null) {
    return this.selectVariation(domId, automatic, variationRow);
  }

  fetchChildVariationsById(variationId) {
    return this.variations.fetchChildVariationsById(variationId);
  }

  setSelectVariation(domId) {
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

  /* ============================================================================
    LOADER HELPERS
  ============================================================================ */

  showLoader() {
    if (
      typeof window.loader !== "undefined" &&
      typeof window.loader?.show === "function"
    ) {
      window.loader.show();
      return true;
    }

    if (
      typeof loader !== "undefined" &&
      typeof loader?.show === "function"
    ) {
      loader.show();
      return true;
    }

    return false;
  }

  hideLoader() {
    if (
      typeof window.loader !== "undefined" &&
      typeof window.loader?.hide === "function"
    ) {
      window.loader.hide();
      return true;
    }

    if (
      typeof loader !== "undefined" &&
      typeof loader?.hide === "function"
    ) {
      loader.hide();
      return true;
    }

    return false;
  }

  /* ============================================================================
    SECURITY HELPERS
  ============================================================================ */

  escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

/* ============================================================================
  GLOBAL INSTANCE
============================================================================ */

let previewLogic = null;
let variations = null;

function createPreviewLogic() {
  if (window.previewLogic instanceof PreviewLogic) {
    previewLogic = window.previewLogic;
    variations = previewLogic.variations;
    return;
  }

  previewLogic = new PreviewLogic();
  variations = previewLogic.variations;

  window.previewLogic = previewLogic;
  window.variations = variations;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createPreviewLogic);
} else {
  createPreviewLogic();
}
