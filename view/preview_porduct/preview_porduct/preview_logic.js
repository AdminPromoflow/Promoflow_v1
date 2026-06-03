// preview_logic.js

class PreviewLogic {
  constructor() {
    // Central endpoint used by PromoFlow to communicate with DOT63.
    this.apiUrl = "../../controller/dot63/requests_63_api.php";

    // Store the currently selected variation button id.
    this.variationSelected = null;

    this.max_quantity = null;

    // Flag used to determine whether grouped content should be removed first.
    this.shouldDeleteItems = false;

    // Store the currently selected price payload.
    this.priceSelected = null;

    // Initialise the product data once the DOM is ready.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.bindMainButtons();
    this.getDataProduct();
  }

  bindMainButtons() {
    const backBtn = document.getElementById("btn_back_edit");
    const publishBtn = document.getElementById("btn_publish");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.backBtn();
      });
    }

    if (publishBtn) {
      publishBtn.addEventListener("click", () => {
        this.publishBtn();
      });
    }
  }

  publishBtn() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

    if (!sku) {
      console.warn("No SKU in URL");
      return;
    }

    const data = {
      action: "publish_product",
      sku: sku
    };

    fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network error.");
        return response.text();
      })
      .then((text) => {
        alert(text);

        const json = JSON.parse(text);
        console.log("Product published:", json);
      })
      .catch((error) => {
        console.error("Error publishing product:", error);
      });
  }

  backBtn() {
    const url = "../../view/product_details/index.php";

    const current = new URL(window.location.href);
    const dest = new URL(url, current);

    const sku = current.searchParams.get("sku");
    const skuv = current.searchParams.get("sku_variation");

    // Preserves sku and sku_variation in the destination URL.
    if (sku) dest.searchParams.set("sku", sku);
    if (skuv) dest.searchParams.set("sku_variation", skuv);

    window.location.assign(dest);
  }

  /* ============================================================================
    PRODUCT DATA
  ============================================================================ */

  getDataProduct() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

    if (!sku) {
      console.warn("No SKU in URL");
      return;
    }

    const data = {
      action: "get_preview_product_details",
      sku: sku
    };

    fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network error.");
        return response.text();
      })
      .then((text) => {
        const json = JSON.parse(text);

        const company_name = (json.find(x => x.company_name)?.company_name) ?? "";
        const category_name = (json.find(x => x.category_name)?.category_name) ?? "";
        const group_name = (json.find(x => x.group_name)?.group_name) ?? "";
        const default_variation_id = (json.find(x => x.default_variation_id)?.default_variation_id) ?? "";

        const product_details = (json.find(x => x.product_details)?.product_details) ?? {};
        const product_name = product_details.product_name ?? "";
        const descriptive_tagline = product_details.descriptive_tagline ?? "";
        const description = product_details.description ?? "";

        this.renderBreadcrumb(category_name, group_name);
        this.renderSectionLabel(category_name);
        this.renderProductTitle(product_name);
        this.renderBrandName(company_name);
        this.renderTagline(descriptive_tagline);
        this.renderDescription(description);

        this.deleteGroupsContent();
        this.fetchChildVariationsById(default_variation_id);
      })
      .catch((error) => {
        console.error("Error fetching preview:", error);
      });
  }

  fetchChildVariationsById(variation_id) {
    if (!variation_id) {
      console.warn("No variation_id provided");
      return;
    }

    const data = {
      action: "get_variation_children_by_id",
      variation_id: variation_id
    };

    fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network error.");
        return response.text();
      })
      .then((text) => {
        const json = JSON.parse(text);

        const variationTypes = json.variationTypes || [];
        const childVariations = json.childVariations || [];
        const variationTypesForDelete = json.variationTypesForDelete || [];
        const currentVariationData = json.currentVariationData || {};

        const currentTypeId = variationTypesForDelete?.[0]?.type_id ?? null;

        if (variationTypesForDelete?.length > 0) {
          this.shouldDeleteItems = true;
        } else {
          this.shouldDeleteItems = false;
        }

        // The current variation must be organised after the delete step.
        this.organizeCurrentVariation(currentVariationData);

        if (childVariations.length && variationTypes.length) {
          this.organizeVariationsForRender(childVariations, variationTypes);
        } else if (
          childVariations == null ||
          childVariations.length == null ||
          childVariations.length === 0
        ) {
          this.updateVariationPrices();

          // Automatically selects the first quantity.
          setTimeout(() => {
            const firstPriceButton = document.querySelector("#wrap-prices-group .js-price-option");

            if (firstPriceButton) {
              const allPriceButtons = document.querySelectorAll("#wrap-prices-group .js-price-option");

              allPriceButtons.forEach(btn => {
                btn.classList.remove("is-selected");
              });

              this.updateProductSummaryBox(firstPriceButton.dataset.minQuantity, firstPriceButton.value);
              firstPriceButton.classList.add("is-selected");

              const payload = {
                price_id: String(firstPriceButton.dataset.priceId ?? ""),
                min_quantity: String(firstPriceButton.dataset.minQuantity ?? ""),
                max_quantity: String(firstPriceButton.dataset.maxQuantity ?? ""),
                price: String(firstPriceButton.dataset.price ?? ""),
                value: String(firstPriceButton.value ?? ""),
              };

              this.setSelectedPrice(payload);
              this.setMaxQuantity(payload["max_quantity"]);
            }
          }, 500);

          loader.hide();
        }
      })
      .catch((error) => {
        console.error("Error fetching preview:", error);
      });
  }

  /* ============================================================================
    BASIC RENDER HELPERS
  ============================================================================ */

  deleteGroupsContent() {
    const wrapVariationsGroup = document.querySelector("#wrap-variations-group");
    const wrapImagesGroup = document.querySelector("#wrap-images-group");
    const wrapItemsGroup = document.querySelector("#wrap-items-group");
    const wrapPricesGroup = document.querySelector("#wrap-prices-group");
    const wrapArtworksGroup = document.querySelector("#wrap-artworks-group");

    if (wrapVariationsGroup) wrapVariationsGroup.innerHTML = "";
    if (wrapImagesGroup) wrapImagesGroup.innerHTML = "";
    if (wrapItemsGroup) wrapItemsGroup.innerHTML = "";
    if (wrapPricesGroup) wrapPricesGroup.innerHTML = "";
    if (wrapArtworksGroup) wrapArtworksGroup.innerHTML = "";

    window.previewGallery?.clearGallery?.();
  }

  renderBreadcrumb(category_name, group_name) {
    const sp_breadcrumbs = document.getElementById("sp_breadcrumbs");
    if (!sp_breadcrumbs) return;

    sp_breadcrumbs.innerHTML = `
      <li><a href="#">${category_name || ""}</a></li>
      <li><a href="#">${group_name || ""}</a></li>
    `;
  }

  renderSectionLabel(category_name) {
    const sp_category = document.getElementById("sp_category");
    if (!sp_category) return;
    sp_category.textContent = category_name || "";
  }

  renderProductTitle(product_name) {
    const sp_title = document.getElementById("sp-title");
    if (!sp_title) return;
    sp_title.textContent = product_name || "";
  }

  renderBrandName(company_name) {
    const sp_brand = document.getElementById("sp-brand");
    if (!sp_brand) return;
    sp_brand.textContent = company_name || "";
  }

  renderTagline(descriptive_tagline) {
    const sp_subtitle = document.getElementById("sp_subtitle");
    if (!sp_subtitle) return;
    sp_subtitle.textContent = descriptive_tagline || "";
  }

  renderDescription(description) {
    const sp_desc = document.getElementById("sp_desc");
    if (!sp_desc) return;
    sp_desc.textContent = description || "";
  }

  /* ============================================================================
    CURRENT VARIATION
  ============================================================================ */

  organizeCurrentVariation(currentVariationData = {}) {
    try {
      const variation = currentVariationData?.variation ?? null;
      if (!variation) return false;

      const variationId = String(variation?.variation_id ?? "").trim();
      const typeId = String(variation?.type_id ?? "null").trim();
      const typeName = String(variation?.type_name ?? "").trim();

      if (!variationId || !typeId || !typeName) return false;

      const currentDomId = `variation_id_${variationId}`;
      this.setSelectVariation(currentDomId);

      const typeVariation = {
        type_id: typeId,
        type_name: typeName
      };

      const imagesOnlyOfType = Array.isArray(currentVariationData?.images)
        ? currentVariationData.images.map((image) => ({
            ...image,
            variation_id: variationId
          }))
        : [];

      const itemsOnlyOfType = Array.isArray(currentVariationData?.items)
        ? currentVariationData.items.map((item) => ({
            ...item,
            variation_id: variationId
          }))
        : [];

      const pricesOnlyOfType = Array.isArray(currentVariationData?.prices)
        ? currentVariationData.prices.map((price) => ({
            ...price,
            variation_id: variationId,
            price_display_mode: variation?.price_display_mode ?? null
          }))
        : [];

      const artworksOnlyOfType = [];
      const artwork = currentVariationData?.artwork ?? null;

      if (artwork) {
        const pdf = String(artwork?.pdf_artwork ?? "").trim();
        const name = String(artwork?.name_pdf_artwork ?? "").trim();

        if (pdf || name) {
          artworksOnlyOfType.push({
            ...artwork,
            variation_id: variationId
          });
        }
      }

      const itemEl = document.getElementById(`wrap-items-${typeId}`);
      if (itemEl) this.deleteItems(typeId);

      const imageEl = document.getElementById(`wrap-images-${typeId}`);
      if (imageEl) this.deleteImages(typeId);

      const priceEl = document.getElementById(`wrap-price-${typeId}`);
      if (priceEl) this.deletePrices(typeId);

      const artworkEl = document.getElementById(`wrap-artworks-${typeId}`);
      if (artworkEl) this.deleteArtwork(typeId);

      if (imagesOnlyOfType.length > 0) this.renderImages(imagesOnlyOfType, typeVariation);
      if (itemsOnlyOfType.length > 0) this.renderItems(itemsOnlyOfType, typeVariation);
      if (pricesOnlyOfType.length > 0) this.renderPrices(pricesOnlyOfType, typeVariation);
      if (artworksOnlyOfType.length > 0) this.renderArtwork(artworksOnlyOfType, typeVariation);

      return true;
    } catch (error) {
      console.error("Error in organizeCurrentVariation:", error);
      return false;
    }
  }

  /* ============================================================================
    DELETE FLOW
  ============================================================================ */

  organizeVariationsForDelete(variationTypes = [], currentTypeId = null) {
    if (!Array.isArray(variationTypes) || variationTypes.length === 0) return true;

    const current = String(currentTypeId ?? "");

    for (let i = 0; i < variationTypes.length; i++) {
      const typeId = String(variationTypes[i]?.type_id ?? "");

      const itemEl = document.getElementById(`wrap-items-${typeId}`);
      if (itemEl) this.deleteItems(typeId);

      const imageEl = document.getElementById(`wrap-images-${typeId}`);
      if (imageEl) this.deleteImages(typeId);

      const priceEl = document.getElementById(`wrap-price-${typeId}`);
      if (priceEl) this.deletePrices(typeId);

      const artworkEl = document.getElementById(`wrap-artworks-${typeId}`);
      if (artworkEl) this.deleteArtwork(typeId);

      if (typeId !== current) {
        const variationEl = document.querySelector(
          `#wrap-variations-group .wrap-variations[data-type-id="${CSS.escape(typeId)}"]`
        );

        if (variationEl) {
          this.deleteVariations(typeId);
        }
      }
    }

    return true;
  }

  deleteVariations(typeId) {
    const id = String(typeId ?? "");
    const nodes = document.querySelectorAll(
      `#wrap-variations-group .wrap-variations[data-type-id="${CSS.escape(id)}"]`
    );

    for (const el of nodes) {
      el.innerHTML = "";
    }
  }

  deleteItems(typeId) {
    const id = String(typeId ?? "");
    document.getElementById(`wrap-items-${id}`)?.remove();
  }

  deleteImages(typeId) {
    const id = String(typeId ?? "");
    document.getElementById(`wrap-images-${id}`)?.remove();
  }

  deletePrices(typeId) {
    const id = String(typeId ?? "");
    document.getElementById(`wrap-price-${id}`)?.remove();
  }

  deleteArtwork(typeId) {
    const id = String(typeId ?? "");
    document.getElementById(`wrap-artworks-${id}`)?.remove();
  }

  /* ============================================================================
    CHILD VARIATIONS ORGANISER
  ============================================================================ */

  organizeVariationsForRender(childVariations = [], variationTypes = []) {
    if (!Array.isArray(childVariations) || childVariations.length === 0) return;
    if (!Array.isArray(variationTypes) || variationTypes.length === 0) return;

    for (const typeVariation of variationTypes) {
      const typeName = String(typeVariation?.type_name ?? "").trim();
      if (!typeName) continue;

      const variationsOnlyOfType = [];
      const itemsOnlyOfType = [];
      const imagesOnlyOfType = [];
      const pricesOnlyOfType = [];
      const artworksOnlyOfType = [];

      for (const row of childVariations) {
        const variation = row?.variation;
        if (!variation) continue;

        const variationTypeName = String(variation?.type_name ?? "").trim();
        if (variationTypeName !== typeName) continue;

        variationsOnlyOfType.push(variation);

        if (Array.isArray(row?.items) && row.items.length > 0) {
          itemsOnlyOfType.push(
            ...row.items.map((item) => ({
              ...item,
              variation_id: variation?.variation_id ?? null,
            }))
          );
        }

        if (Array.isArray(row?.images) && row.images.length > 0) {
          imagesOnlyOfType.push(
            ...row.images.map((image) => ({
              ...image,
              variation_id: variation?.variation_id ?? null,
            }))
          );
        }

        if (Array.isArray(row?.prices) && row.prices.length > 0) {
          pricesOnlyOfType.push(
            ...row.prices.map((price) => ({
              ...price,
              variation_id: variation?.variation_id ?? null,
              price_display_mode: variation?.price_display_mode ?? null,
            }))
          );
        }

        const artwork = row?.artwork ?? null;

        if (artwork) {
          const pdf = String(artwork?.pdf_artwork ?? "").trim();
          const name = String(artwork?.name_pdf_artwork ?? "").trim();

          if (pdf || name) {
            artworksOnlyOfType.push({
              ...artwork,
              variation_id: variation?.variation_id ?? null,
            });
          }
        }
      }

      if (!variationsOnlyOfType.length) continue;

      const variationsFinished = this.renderVariations(variationsOnlyOfType, typeVariation);
      if (!variationsFinished) continue;

      if (imagesOnlyOfType.length > 0) this.renderImages(imagesOnlyOfType, typeVariation);
      if (itemsOnlyOfType.length > 0) this.renderItems(itemsOnlyOfType, typeVariation);
      if (pricesOnlyOfType.length > 0) this.renderPrices(pricesOnlyOfType, typeVariation);
      if (artworksOnlyOfType.length > 0) this.renderArtwork(artworksOnlyOfType, typeVariation);
    }
  }

  /* ============================================================================
    VARIATIONS RENDER
  ============================================================================ */

  renderVariations(childVariationsOfType = [], typeVariation) {
    try {
      const parent = document.getElementById("wrap-variations-group");
      if (!parent) return false;

      const typeId = typeVariation?.type_id ?? "null";
      const labelId = `var_label_size_${typeId}`;
      const optionsId = `var-options-${typeId}`;

      const existing = parent.querySelector(`.wrap-variations[data-type-id="${typeId}"]`);
      if (existing) existing.remove();

      const typeName = String(typeVariation?.type_name ?? "").trim();
      if (!typeName) return false;

      if (!Array.isArray(childVariationsOfType) || childVariationsOfType.length === 0) {
        return false;
      }

      const firstLabel = String(childVariationsOfType?.[0]?.name ?? "").trim();

      let buttonsHtml = "";
      let firstDomId = "";

      for (let i = 0; i < childVariationsOfType.length; i++) {
        const v = childVariationsOfType[i];

        const variationId = String(v?.variation_id ?? "").trim();
        const rawImg = String(v?.image ?? "").trim().replace(/^\/+/, "");

        const imgSrc = rawImg
          ? (
              rawImg.startsWith("http") || rawImg.startsWith("data:") || rawImg.startsWith("blob:")
                ? rawImg
                : (rawImg.startsWith("controller/")
                    ? "../../" + rawImg
                    : "../../controller/" + rawImg)
            )
          : "../../view/preview_porduct/img/icon_product.png";

        const label = String(v?.name ?? "");
        const selectedClass = (i === 0) ? " is-selected" : "";
        const domId = variationId ? `variation_id_${variationId}` : "";

        if (i === 0) firstDomId = domId;

        buttonsHtml += `
          <button
            type="button"
            class="var-option js-scale-in${selectedClass}"
            ${domId ? `id="${domId}"` : ""}
            ${domId ? `onclick="previewLogic.SelectVariation('${domId}')"` : ""}
          >
            <img class="var-thumb" src="${imgSrc}" alt="Option sample">
            <span class="opt-main">${label}</span>
          </button>
        `;
      }

      const blockHtml = `
        <div class="wrap-variations" aria-labelledby="${labelId}" data-type-id="${typeId}">
          <div class="var-label">
            <span class="var-name">${typeName}</span>
            <strong id="${labelId}">${firstLabel || ""}</strong>
          </div>

          <div class="var-options" id="${optionsId}">
            ${buttonsHtml}
          </div>
        </div>
      `;

      parent.insertAdjacentHTML("beforeend", blockHtml);

      if (firstDomId) {
        const selectVariationResult = this.SelectVariation(firstDomId);

        if (selectVariationResult === false) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error in renderVariations:", error);
      return false;
    }
  }

  SelectVariation(domId = "") {
    this.setSelectVariation(domId);

    const id = String(domId || "").trim();
    if (!id) return;

    const variationId = id.replace(/^variation_id_/, "").trim();
    if (!variationId) return;

    this.fetchChildVariationsById(variationId);
  }

  setSelectVariation(domId) {
    this.variationSelected = domId;
  }

  getSelectVariation() {
    return this.variationSelected;
  }

  /* ============================================================================
    ITEMS RENDER
  ============================================================================ */

  renderItems(itemsOnlyOfType = [], typeVariation) {
    const id_variation = Number(
      String(this.getSelectVariation() ?? "").replace("variation_id_", "")
    );

    const parent = document.getElementById("wrap-items-group");
    if (!parent) return;

    const typeId = String(typeVariation?.type_id ?? "null");
    const wrapId = `wrap-items-${typeId}`;

    let wrapper = parent.querySelector(`#${CSS.escape(wrapId)}`);

    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "wrap-items";
      wrapper.id = wrapId;
      wrapper.dataset.typeId = typeId;
      parent.appendChild(wrapper);
    }

    wrapper.innerHTML = "";

    for (let i = 0; i < itemsOnlyOfType.length; i++) {
      const it = itemsOnlyOfType[i];

      if (Number(it?.variation_id) !== id_variation) continue;

      const title = String(it?.name ?? "").trim();
      const desc = String(it?.description ?? "").trim();

      if (!title && !desc) continue;

      const item = document.createElement("div");
      item.className = "sp-item";

      item.innerHTML = `
        <strong class="sp-item-subtitle">${title}</strong>
        <span>${desc}</span>
      `;

      wrapper.appendChild(item);
    }
  }

  /* ============================================================================
    IMAGES RENDER
  ============================================================================ */

  renderImages(imagesOnlyOfType = [], typeVariation) {
    const id_variation = Number(
      String(this.getSelectVariation() ?? "").replace("variation_id_", "")
    );

    const parent = document.getElementById("wrap-images-group");
    if (!parent) return;

    const typeId = String(typeVariation?.type_id ?? "null");
    const wrapId = `wrap-images-${typeId}`;

    let wrapper = parent.querySelector(`#${CSS.escape(wrapId)}`);

    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "wrap-images";
      wrapper.id = wrapId;
      wrapper.dataset.typeId = typeId;
      parent.appendChild(wrapper);
    }

    wrapper.innerHTML = "";

    for (let i = 0; i < imagesOnlyOfType.length; i++) {
      const imgObj = imagesOnlyOfType[i];

      if (Number(imgObj.variation_id) !== id_variation) continue;

      const rawLink = String(imgObj?.link ?? "").trim().replace(/^\/+/, "");

      const src = rawLink
        ? (
            rawLink.startsWith("http") ||
            rawLink.startsWith("data:") ||
            rawLink.startsWith("blob:")
              ? rawLink
              : (rawLink.startsWith("controller/")
                  ? "../../" + rawLink
                  : "../../controller/" + rawLink)
          )
        : "";

      if (!src) continue;

      const img = document.createElement("img");
      img.className = "preview-media";
      img.src = src;
      img.alt = `Preview image ${i + 1}`;
      img.loading = "lazy";
      img.decoding = "async";

      wrapper.appendChild(img);
    }
  }

  /* ============================================================================
    PRICES RENDER
  ============================================================================ */

  renderPrices(pricesOnlyOfType = [], typeVariation) {
    loader.show();

    const id_variation = Number(
      String(this.getSelectVariation() ?? "").replace("variation_id_", "")
    );

    const parent = document.getElementById("wrap-prices-group");
    if (!parent) return;

    const typeId = String(typeVariation?.type_id ?? "null");
    const wrapId = `wrap-price-${typeId}`;

    let wrapper = parent.querySelector(`#${CSS.escape(wrapId)}`);

    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "wrap-price";
      wrapper.id = wrapId;
      wrapper.dataset.typeId = typeId;
      parent.appendChild(wrapper);
    }

    wrapper.innerHTML = "";

    for (let i = 0; i < pricesOnlyOfType.length; i++) {
      const p = pricesOnlyOfType[i];

      if (Number(p?.variation_id) !== id_variation) continue;

      if (String(p?.price_display_mode ?? "").trim() !== "prices") continue;

      const priceId = String(p?.price_id ?? "").trim();
      const minQty = String(p?.min_quantity ?? "").trim();
      const maxQty = String(p?.max_quantity ?? "").trim();
      const price = String(p?.price ?? "").trim();

      if (maxQty === "") continue;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "var-option js-scale-in js-price-option";
      button.value = price;
      button.dataset.priceId = priceId;
      button.dataset.minQuantity = minQty;
      button.dataset.maxQuantity = maxQty;
      button.dataset.price = price;
      button.dataset.variationId = String(p?.variation_id ?? "");
      button.dataset.priceDisplayMode = String(p?.price_display_mode ?? "");

      button.innerHTML = `
        <span class="opt-main">${minQty}</span>
      `;

      wrapper.appendChild(button);
    }

    this.bindPriceButtons(`#${wrapId}`);
  }

  bindPriceButtons(scopeSelector) {
    const scope = document.querySelector(scopeSelector);
    if (!scope) return false;

    const buttons = Array.from(scope.querySelectorAll(".js-price-option"));

    if (buttons.length === 0) {
      return false;
    }

    for (const btn of buttons) {
      btn.addEventListener("click", (e) => {
        const el = e.currentTarget;
        const updateVariationPrice = this.selectPriceButton(el, scope);

        if (updateVariationPrice) {
          this.updateProductSummaryBox(el.dataset.minQuantity, el.value);
        }
      });
    }

    const updateVariationPrice = this.selectPriceButton(buttons[0], scope);

    setTimeout(() => {
      if (updateVariationPrice) {
        this.updateProductSummaryBox(buttons[0].dataset.minQuantity, buttons[0].value);
      }
    }, 1500);

    return true;
  }

  updateProductSummaryBox(quantity, price) {
    const is_selected = document.querySelectorAll(".is-selected");
    let totalExtraPrice = 0;

    for (let i = 0; i < is_selected.length; i++) {
      if (!is_selected[i].querySelector(".opt-price-extra")) continue;

      const priceExtraText = is_selected[i].querySelector(".opt-price-extra").innerHTML;

      const priceExtraNumber = Number(
        priceExtraText
          .replace("+", "")
          .replace("p/u", "")
          .trim()
      );

      totalExtraPrice = totalExtraPrice + priceExtraNumber;
    }

    const bb_unit = document.getElementById("bb_unit");
    const bb_unit_quantity = document.getElementById("bb_unit_quantity");
    const bb_unit_total = document.getElementById("bb_unit_total");

    const bb_extra_unit = document.getElementById("bb_extra_unit");
    const bb_extra_quantity = document.getElementById("bb_extra_quantity");
    const bb_extra_total = document.getElementById("bb_extra_total");

    const bb_total = document.getElementById("bb_total");

    const sp_price = document.getElementById("sp_price");
    const var_label_quantity = document.getElementById("var_label_quantity");
    const sp_unit_hint = document.getElementById("sp_unit_hint");

    if (bb_unit) bb_unit.innerHTML = "£" + this.formatPrice(price);
    if (bb_unit_quantity) bb_unit_quantity.innerHTML = quantity;
    if (bb_unit_total) bb_unit_total.innerHTML = "£" + this.formatPrice(price * quantity);

    if (sp_price) sp_price.innerHTML = this.formatPrice(price);
    if (var_label_quantity) var_label_quantity.innerHTML = quantity;
    if (sp_unit_hint) sp_unit_hint.innerHTML = "per " + quantity + " units";

    let quantityExtras;

    if (totalExtraPrice == 0) {
      quantityExtras = 0;
    } else {
      quantityExtras = quantity;
    }

    if (bb_extra_unit) bb_extra_unit.innerHTML = "£" + this.formatPrice(totalExtraPrice);
    if (bb_extra_quantity) bb_extra_quantity.innerHTML = quantityExtras;
    if (bb_extra_total) bb_extra_total.innerHTML = "£" + this.formatPrice(totalExtraPrice * quantity);

    if (bb_total) {
      bb_total.innerHTML = "£" + this.formatPrice(
        (price * quantity) + (totalExtraPrice * quantity)
      );
    }
  }

  formatPrice(value) {
    return Number(value).toFixed(2);
  }

  selectPriceButton(button, scope = null) {
    if (!button) return false;

    const container = scope || button.closest(".wrap-price");
    if (!container) return false;

    const buttons = container.querySelectorAll(".js-price-option");

    for (const btn of buttons) {
      btn.classList.remove("is-selected");
      btn.setAttribute("aria-pressed", "false");
    }

    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");

    const payload = {
      price_id: String(button.dataset.priceId ?? ""),
      min_quantity: String(button.dataset.minQuantity ?? ""),
      max_quantity: String(button.dataset.maxQuantity ?? ""),
      price: String(button.dataset.price ?? ""),
      value: String(button.value ?? ""),
    };

    this.setSelectedPrice(payload);
    this.onPriceSelected(payload, button);
    this.setMaxQuantity(payload["max_quantity"]);
    this.updateVariationPrices();

    return true;
  }

  setSelectedPrice(payload = null) {
    this.priceSelected = payload;
  }

  setMaxQuantity(max_quantity) {
    this.max_quantity = max_quantity;
  }

  getMaxQuantity() {
    return this.max_quantity;
  }

  updateVariationPrices() {
    const variationsWithPrices = document.querySelectorAll(".var-option");

    const ids = Array.from(variationsWithPrices)
      .map((button) => Number(button.id.replace("variation_id_", "")))
      .filter((id) => !Number.isNaN(id));

    const max_quantity = this.getMaxQuantity();

    const data = {
      action: "get_variation_prices",
      ids: ids,
      max_quantity: max_quantity
    };

    fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network error.");
        return response.text();
      })
      .then((text) => {
        const data = JSON.parse(text);
        this.drawExtraVariationPrices(data["prices"]);
      })
      .catch((error) => {
        console.error("Error fetching variation prices:", error);
      });
  }

  getSelectedPrice() {
    return this.priceSelected;
  }

  onPriceSelected(payload, button = null) {
    // This method is available in case extra logic is needed after selecting a price.
  }

  drawExtraVariationPrices(data) {
    if (!Array.isArray(data)) return;

    for (let i = 0; i < data.length; i++) {
      const variationId = "variation_id_" + data[i].variation_id;
      const htmlButton = document.getElementById(variationId);

      if (!htmlButton) {
        continue;
      }

      const existingPrice = htmlButton.querySelector(".opt-price-extra");

      if (existingPrice) {
        existingPrice.remove();
      }

      htmlButton.innerHTML += `<span class="opt-price-extra">+${data[i].price.price} p/u</span>`;
    }
  }

  /* ============================================================================
    ARTWORK RENDER
  ============================================================================ */

  renderArtwork(artworksOnlyOfType = [], typeVariation) {
    const id_variation = Number(
      String(this.getSelectVariation() ?? "").replace("variation_id_", "")
    );

    const parent = document.getElementById("wrap-artworks-group");
    if (!parent) return;

    const typeId = String(typeVariation?.type_id ?? "null");
    const wrapId = `wrap-artworks-${typeId}`;

    let wrapper = parent.querySelector(`#${CSS.escape(wrapId)}`);

    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "wrap-artworks";
      wrapper.id = wrapId;
      wrapper.dataset.typeId = typeId;
      parent.appendChild(wrapper);
    }

    wrapper.innerHTML = "";

    for (let i = 0; i < artworksOnlyOfType.length; i++) {
      const a = artworksOnlyOfType[i];

      if (Number(a?.variation_id) !== id_variation) continue;

      const name = String(a?.name_pdf_artwork ?? "").trim();
      const rawPdf = String(a?.pdf_artwork ?? "").trim().replace(/^\/+/, "");

      if (!name && !rawPdf) continue;

      const pdfSrc = rawPdf
        ? (
            rawPdf.startsWith("http") ||
            rawPdf.startsWith("data:") ||
            rawPdf.startsWith("blob:")
              ? rawPdf
              : (rawPdf.startsWith("controller/")
                  ? "../../" + rawPdf
                  : "../../controller/" + rawPdf)
          )
        : "";

      const artwork = document.createElement("div");
      artwork.className = "sp-artwork";

      artwork.innerHTML = `
        ${name ? `<strong class="sp-artwork-name">${name}</strong>` : ""}
        ${pdfSrc ? `<a class="sp-artwork-link" href="${pdfSrc}" target="_blank" rel="noopener">Open PDF</a>` : ""}
      `;

      wrapper.appendChild(artwork);
    }
  }
}

const previewLogic = new PreviewLogic();
