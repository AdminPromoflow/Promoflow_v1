// preview_logic.js

class PreviewLogic {
  constructor() {
    this.variations = new Variations(this);
    this.initialised = false;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init(), { once: true });
    } else {
      this.init();
    }
  }

  /* ============================================================================
    INITIALISE
  ============================================================================ */

  init() {
    if (this.initialised) return false;

    this.initialised = true;

    this.bindMainButtons();
    this.variations.init();
    this.getDataProduct();

    return true;
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

    return true;
  }

  /* ============================================================================
    MAIN BUTTONS
  ============================================================================ */

  messageSupplier() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

    if (!sku) {
      console.warn("No SKU in URL.");
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
      console.warn("No SKU in URL.");
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
          throw new Error(`Network error: ${response.status}.`);
        }

        return response.text();
      })
      .then((text) => {
        let responseData;

        try {
          responseData = JSON.parse(text);
        } catch (error) {
          console.error("Invalid publish JSON response:", error);
          console.error("Server response:", text);
          alert(text || "Invalid server response.");
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
    window.location.assign("../../view/overview/index.php");
    return true;
  }

  /* ============================================================================
    PRODUCT DATA
  ============================================================================ */

  getDataProduct() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

    if (!sku) {
      console.warn("No SKU in URL.");
      this.hideLoader();
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
          throw new Error(`Network error: ${response.status}.`);
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
          console.error("Expected an array but received:", json);
          throw new Error("Invalid product preview response.");
        }

        const companyName = json.find((row) => row?.company_name !== undefined)?.company_name ?? "";
        const categoryName = json.find((row) => row?.category_name !== undefined)?.category_name ?? "";
        const groupName = json.find((row) => row?.group_name !== undefined)?.group_name ?? "";
        const defaultVariationId = json.find((row) => row?.default_variation_id !== undefined)?.default_variation_id ?? "";
        const productDetails = json.find((row) => row?.product_details !== undefined)?.product_details ?? {};

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

        if (!this.variations || typeof this.variations !== "object") {
          throw new Error("The Variations instance was not created correctly.");
        }

        if (typeof this.variations.reset === "function") {
          this.variations.reset();
        } else if (typeof this.variations.clearVariations === "function") {
          this.variations.clearVariations();
        } else {
          this.deleteGroupsContent();
        }

        if (!defaultVariationId) {
          console.warn("No default variation ID returned.");
          this.hideLoader();
          return;
        }

        if (typeof this.variations.fetchChildVariationsById !== "function") {
          throw new Error("Variations.fetchChildVariationsById() does not exist.");
        }

        this.variations.fetchChildVariationsById(defaultVariationId);
      })
      .catch((error) => {
        console.error("Error fetching preview:", error);
        console.error("Error stack:", error.stack);
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
      document.querySelector(".wrap-variations-group"),
      document.getElementById("wrap-variations-group"),
      document.getElementById("wrap-images-group"),
      document.getElementById("wrap-items-group"),
      document.getElementById("wrap-prices-group"),
      document.getElementById("wrap-artworks-group")
    ];

    const processedGroups = new Set();

    groups.forEach((group) => {
      if (!group || processedGroups.has(group)) return;

      processedGroups.add(group);
      group.innerHTML = "";
    });

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
  ============================================================================ */

  resetVariations() {
    if (typeof this.variations?.reset === "function") {
      return this.variations.reset();
    }

    if (typeof this.variations?.clearVariations === "function") {
      return this.variations.clearVariations();
    }

    return this.deleteGroupsContent();
  }

  selectVariation(domId = "", automatic = false, variationRow = null) {
    if (typeof this.variations?.selectVariation !== "function") {
      console.error("Variations.selectVariation() does not exist.");
      return false;
    }

    return this.variations.selectVariation(domId, automatic, variationRow);
  }

  SelectVariation(domId = "", automatic = false, variationRow = null) {
    return this.selectVariation(domId, automatic, variationRow);
  }

  fetchChildVariationsById(variationId) {
    if (typeof this.variations?.fetchChildVariationsById !== "function") {
      console.error("Variations.fetchChildVariationsById() does not exist.");
      return false;
    }

    return this.variations.fetchChildVariationsById(variationId);
  }

  setSelectVariation(domId) {
    if (typeof this.variations?.setSelectVariation !== "function") return false;

    return this.variations.setSelectVariation(domId);
  }

  getSelectVariation() {
    if (typeof this.variations?.getSelectVariation !== "function") return null;

    return this.variations.getSelectVariation();
  }

  getSelectedVariationId() {
    if (typeof this.variations?.getSelectedVariationId !== "function") return null;

    return this.variations.getSelectedVariationId();
  }

  getShouldDeleteItems() {
    if (typeof this.variations?.getShouldDeleteItems !== "function") return false;

    return this.variations.getShouldDeleteItems();
  }

  /* ============================================================================
    LOADER HELPERS
  ============================================================================ */

  showLoader() {
    if (typeof window.loader?.show === "function") {
      window.loader.show();
      return true;
    }

    if (typeof loader !== "undefined" && typeof loader?.show === "function") {
      loader.show();
      return true;
    }

    return false;
  }

  hideLoader() {
    if (typeof window.loader?.hide === "function") {
      window.loader.hide();
      return true;
    }

    if (typeof loader !== "undefined" && typeof loader?.hide === "function") {
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

function createPreviewLogic() {
  if (window.previewLogic instanceof PreviewLogic) {
    window.variations = window.previewLogic.variations;
    return window.previewLogic;
  }

  window.previewLogic = new PreviewLogic();
  window.variations = window.previewLogic.variations;

  return window.previewLogic;
}

const previewLogic = createPreviewLogic();
const variations = previewLogic.variations;
