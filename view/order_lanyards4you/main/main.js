class ControllerOrdersLanyards4You {
  init() {
    this.getOrders();

    // Event delegation: un solo listener para todos los headers
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.inner-accordion_header');
      if (header) this.toggle(header);
    });

    // Keyboard support: Enter / Space activan el toggle
    document.addEventListener('keydown', (e) => {
      const header = e.target.closest?.('.inner-accordion_header');
      if (!header) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle(header);
      }
    });
  }

  // === Ajax estilo requestLogin() ===
  getOrders() {
    const url = "../../controller/lanyards4you/order.php";
    const data = { action: "getOrders" };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Network error.");
      })
      .then(result => {
        const ok = result && (result.status === "success" || result.success === true);
        if (ok && Array.isArray(result.orders)) {
          this.renderOrders(result.orders);
        } else {
          alert(result?.message || "No fue posible cargar los pedidos.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al solicitar los pedidos.");
      });
  }

  // ====================== RENDER ======================
  renderOrders(orders) {
    const container = document.getElementById("main_lanyards4you");
    if (!container) return;

    const list = (orders || []).map(bundle => this.#renderOrderLevel1(bundle)).join("");
    container.innerHTML = `
      <h2>Production Orders</h2>
      ${list || `<p class="muted">No hay órdenes para mostrar.</p>`}
    `;
  }

  // ====== NIVEL 1: Order ======
  #renderOrderLevel1(bundle) {
    const o = bundle?.order ?? {};
    const head = `Order #${this.#esc(o.idOrder)} · ${this.#esc(o.status || "-")} · ${this.#esc(o.date_time || "-")} · Total ${this.#esc(o.total || "-")}`;

    return `
      <div class="inner-accordion accordion-level-1">
        <div class="inner-accordion_header header-level-1" role="button" aria-expanded="false" tabindex="0">
          ${head}
          <span class="inner-arrow arrow-level-1">&#9660;</span>
        </div>

        <div class="inner-accordion_content content-level-1" hidden>
          ${this.#renderOrderInfoLevel2(o)}
          ${this.#renderJobsLevel2(bundle?.jobs || [], o.idOrder)}
          ${this.#renderUserLevel2(bundle?.user || null)}
        </div>
      </div>
    `;
  }

  // ====== NIVEL 2: Order information (form_group) ======
  #renderOrderInfoLevel2(order) {
    const oid = this.#esc(order.idOrder ?? "x");
    return `
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Order information
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          <div class="form_row">
            ${this.#fg(this.#id('order-id', oid), 'ID', order.idOrder)}
            ${this.#fg(this.#id('order-date', oid), 'Date', order.date_time)}
            ${this.#fg(this.#id('order-status', oid), 'Status', order.status)}
          </div>
          <div class="form_row">
            ${this.#fg(this.#id('order-shipdays', oid), 'Shipping days', order.shippingDays)}
            ${this.#fg(this.#id('order-subtotal', oid), 'Subtotal', order.subtotal)}
            ${this.#fg(this.#id('order-tax', oid), 'Tax', order.tax)}
            ${this.#fg(this.#id('order-shipprice', oid), 'Shipping price', order.shipping_price)}
            ${this.#fg(this.#id('order-total', oid), 'Total', order.total)}
          </div>
        </div>
      </div>
    `;
  }

  // ====== NIVEL 2: Jobs ======
  #renderJobsLevel2(jobsWrap, orderId) {
    const jobs = Array.isArray(jobsWrap) ? jobsWrap : [];
    return `
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Jobs (${jobs.length})
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          ${jobs.length ? jobs.map(j => this.#renderJobLevel3(j, orderId)).join("") : `<p class="muted">Sin trabajos.</p>`}
        </div>
      </div>
    `;
  }

  // ====== NIVEL 3 en Jobs: Description / Artwork / Image / Text (todo con form_group) ======
  #renderJobLevel3(jobWrap, orderId) {
    const job = jobWrap?.job || {};
    const jid = this.#esc(job.idJobs ?? "x");
    const title = `${this.#esc(job.name || "Job")} · Qty ${this.#esc(job.amount || "-")} · Total ${this.#esc(job.total || "-")} (ID ${this.#esc(job.idJobs || "-")})`;

    // Cabecera del Job en bloques
    const headerBlocks = `
      <div class="form_row">
        ${this.#fg(this.#id('job-id', orderId, jid), 'ID Job', job.idJobs)}
        ${this.#fg(this.#id('job-qty', orderId, jid), 'Quantity', job.amount)}
        ${this.#fg(this.#id('job-priceunit', orderId, jid), 'Price/Unit', job.price_per_unit)}
        ${this.#fg(this.#id('job-total', orderId, jid), 'Total', job.total)}
      </div>
      <div class="form_row">
        ${this.#fg(this.#id('job-idorder', orderId, jid), 'ID Order', job.idOrder)}
        ${this.#fg(this.#id('job-idpriceamount', orderId, jid), 'ID PriceAmount', job.idPriceAmount)}
        ${this.#fg(this.#id('job-supplier', orderId, jid), 'Supplier', job.idSupplier)}
        ${this.#fg(this.#id('job-pdf', orderId, jid), 'PDF', job.link_pdf ?? '-')}
      </div>
    `;

    return `
      <div class="job_block">
        <div class="job_header">
          <h4>${title}</h4>
          ${headerBlocks}
        </div>

        ${this.#jobSectionLevel3("Description", this.#renderDescription(job.description, orderId, jid))}
        ${this.#jobSectionLevel3("Artwork", this.#renderArtwork(job.artwork, orderId, jid))}
        ${this.#jobSectionLevel3(`Image (${Array.isArray(job.image) ? job.image.length : 0})`, this.#renderImages(job.image, orderId, jid))}
        ${this.#jobSectionLevel3(`Text (${Array.isArray(job.text) ? job.text.length : 0})`, this.#renderTexts(job.text, orderId, jid))}
      </div>
    `;
  }

  #jobSectionLevel3(title, innerHTML) {
    return `
      <div class="inner-accordion accordion-level-3">
        <div class="inner-accordion_header header-level-3" role="button" aria-expanded="false" tabindex="0">
          ${title}
          <span class="inner-arrow arrow-level-3">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-3" hidden>
          ${innerHTML}
        </div>
      </div>
    `;
  }

  // ====== NIVEL 2: User (con NIVEL 3: Addresses) ======
  #renderUserLevel2(user) {
    const uid = this.#esc(user?.idUser ?? "x");

    const summary = user ? `
      <div class="form_row">
        ${this.#fg(this.#id('user-name', uid), 'Name', user.name)}
        ${this.#fg(this.#id('user-email', uid), 'Email', user.email)}
        ${this.#fg(this.#id('user-id', uid), 'User ID', user.idUser)}
        ${this.#fg(this.#id('user-category', uid), 'Category', user.signup_category)}
      </div>
    ` : `<p class="muted">Sin información de usuario.</p>`;

    // Nivel 3: Addresses (cada address en tarjeta con form_group)
    const addrs = Array.isArray(user?.addresses) ? user.addresses : [];
    const addrHTML = addrs.length
      ? addrs.map((a, i) => {
          const aid = this.#esc(a.idAddress ?? `addr${i}`);
          return `
            <div class="form_card">
              <h5>Address ${i + 1}</h5>
              <div class="form_row">
                ${this.#fg(this.#id('addr-firstname', uid, aid), 'First name', a.first_name)}
                ${this.#fg(this.#id('addr-lastname', uid, aid), 'Last name', a.last_name)}
                ${this.#fg(this.#id('addr-company', uid, aid), 'Company Name', a.company_name)}
              </div>
              <div class="form_row">
                ${this.#fg(this.#id('addr-street1', uid, aid), 'Street address 1', a.street_address_1)}
                ${this.#fg(this.#id('addr-street2', uid, aid), 'Street address 2', a.street_address_2)}
              </div>
              <div class="form_row">
                ${this.#fg(this.#id('addr-city', uid, aid), 'City', a.town_city)}
                ${this.#fg(this.#id('addr-state', uid, aid), 'State', a.state)}
                ${this.#fg(this.#id('addr-country', uid, aid), 'Country', a.country)}
                ${this.#fg(this.#id('addr-postcode', uid, aid), 'Postcode', a.postcode)}
              </div>
              <div class="form_row">
                ${this.#fg(this.#id('addr-phone', uid, aid), 'Phone', a.phone)}
                ${this.#fg(this.#id('addr-email', uid, aid), 'Email', a.email_address)}
              </div>
            </div>
          `;
        }).join("")
      : `<p class="muted">Sin direcciones.</p>`;

    const addressesAcc = `
      <div class="inner-accordion accordion-level-3">
        <div class="inner-accordion_header header-level-3" role="button" aria-expanded="false" tabindex="0">
          Addresses (${addrs.length})
          <span class="inner-arrow arrow-level-3">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-3" hidden>
          ${addrHTML}
        </div>
      </div>
    `;

    return `
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          User
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          ${summary}
          ${user ? addressesAcc : ""}
        </div>
      </div>
    `;
  }

  // ====== Subrenders en formato form_group ======
  // ====== Description como <input> (una sola línea) ======
  // ====== Description: separar por componentes (form_group dentro de form_card) ======
  #renderDescription(desc, orderId, jid) {
    const baseId = this.#id('job-description', orderId, jid);

    // Si no hay descripción, salida simple
    if (!desc || typeof desc !== "string" || !desc.trim()) {
      return `
        <div class="form_group">
          <label for="${this.#esc(baseId)}">Description</label>
          <input id="${this.#esc(baseId)}" type="text" value="Sin descripción" readonly>
        </div>
      `;
    }

    // Intentar parsear JSON
    let obj;
    try {
      obj = JSON.parse(desc);
    } catch {
      // Si no es JSON válido, mostrar como texto plano en un input
      return `
        <div class="form_group">
          <label for="${this.#esc(baseId)}">Description</label>
          <input id="${this.#esc(baseId)}" type="text"
                 value="${this.#esc(desc)}"
                 title="${this.#esc(desc)}"
                 readonly>
        </div>
      `;
    }

    // Si el JSON es un objeto: pintar cada "componente" en su tarjeta
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      const componentsHTML = Object.entries(obj).map(([compKey, compVal], idx) => {
        const compId = this.#id(baseId, compKey, String(idx));
        const compTitle = this.#labelize(compKey);

        // Si el valor del componente es otro objeto, pintar cada propiedad en form_group
        if (compVal && typeof compVal === "object" && !Array.isArray(compVal)) {
          const fieldsHTML = Object.entries(compVal).map(([subKey, subVal]) => {
            const fieldId = this.#id(compId, subKey);
            const label   = this.#labelize(subKey);
            const value   = this.#toDisplay(subVal);
            return this.#fg(fieldId, label, value);
          }).join("");

          return `
            <div class="form_card">
              <h5>${this.#esc(compTitle)}</h5>
              <div class="form_row">
                ${fieldsHTML}
              </div>
            </div>
          `;
        }

        // Si es escalar, un único form_group
        return `
          <div class="form_card">
            <h5>${this.#esc(compTitle)}</h5>
            <div class="form_row">
              ${this.#fg(this.#id(compId, 'value'), 'Value', this.#toDisplay(compVal))}
            </div>
          </div>
        `;
      }).join("");

      return componentsHTML;
    }

    // Si el JSON es array u otra cosa, lo mostramos compactado en un input
    const compact = JSON.stringify(obj);
    return `
      <div class="form_group">
        <label for="${this.#esc(baseId)}">Description (JSON)</label>
        <input id="${this.#esc(baseId)}" type="text"
               value="${this.#esc(compact)}"
               title="${this.#esc(compact)}"
               readonly>
      </div>
    `;
  }


  #renderArtwork(art, orderId, jid) {
    if (!art || typeof art !== "object" || Object.keys(art).length === 0) {
      return this.#fg(this.#id('job-artwork-empty', orderId, jid), 'Artwork', 'Sin artwork');
    }
    return `
      <div class="form_row">
        ${this.#fg(this.#id('job-art-right', orderId, jid), 'Right image', art.linkRightImage ?? '-')}
        ${this.#fg(this.#id('job-art-left', orderId, jid), 'Left image', art.linkLeftImage ?? '-')}
      </div>
    `;
  }

  #renderImages(arr, orderId, jid) {
    const list = Array.isArray(arr) ? arr : [];
    if (!list.length) {
      return this.#fg(this.#id('job-images-empty', orderId, jid), 'Images', 'Sin imágenes');
    }
    return list.map((im, i) => {
      const iid = this.#esc(String(i));
      return `
        <div class="form_card">
          <h5>Image ${i + 1}</h5>
          <div class="form_row">
            ${this.#fg(this.#id('img-times', orderId, jid, iid), 'Times', im.timesImage ?? '-')}
            ${this.#fg(this.#id('img-size', orderId, jid, iid), 'Size', im.imageSize ?? '-')}
            ${this.#fg(this.#id('img-rotation', orderId, jid, iid), 'Rotation', im.imageRotation ?? '-')}
            ${this.#fg(this.#id('img-position', orderId, jid, iid), 'Position', im.imagePosition ?? '-')}
          </div>
          <div class="form_row">
            ${this.#fg(this.#id('img-between', orderId, jid, iid), 'Space between', im.spaceBetweenImage ?? '-')}
            ${this.#fg(this.#id('img-along', orderId, jid, iid), 'Space along', im.spaceAlongLanyard ?? '-')}
            ${this.#fg(this.#id('img-link', orderId, jid, iid), 'Link', im.linkImage ?? '-')}
          </div>
        </div>
      `;
    }).join("");
  }

  #renderTexts(arr, orderId, jid) {
    const list = Array.isArray(arr) ? arr : [];
    if (!list.length) {
      return this.#fg(this.#id('job-texts-empty', orderId, jid), 'Texts', 'Sin textos');
    }
    return list.map((t, i) => {
      const tid = this.#esc(String(i));
      return `
        <div class="form_card">
          <h5>Text ${i + 1}</h5>
          <div class="form_row">
            ${this.#fg(this.#id('text-content', orderId, jid, tid), 'Content', t.contentText ?? '-')}
            ${this.#fg(this.#id('text-color', orderId, jid, tid), 'Color', t.colourText ?? '-')}
            ${this.#fg(this.#id('text-font', orderId, jid, tid), 'Font', t.fontFamilyText ?? '-')}
            ${this.#fg(this.#id('text-size', orderId, jid, tid), 'Size', t.sizeText ?? '-')}
          </div>
          <div class="form_row">
            ${this.#fg(this.#id('text-time', orderId, jid, tid), 'Time', t.timeText ?? '-')}
            ${this.#fg(this.#id('text-between', orderId, jid, tid), 'Space between', t.spaceBetweenText ?? '-')}
            ${this.#fg(this.#id('text-along', orderId, jid, tid), 'Space along', t.spaceAlongLanyard ?? '-')}
            ${this.#fg(this.#id('text-position', orderId, jid, tid), 'Position', t.text_position ?? t.textPosition ?? '-')}
          </div>
          <div class="form_row">
            ${this.#fg(this.#id('text-bold', orderId, jid, tid), 'Bold', String(!!t.boldText))}
            ${this.#fg(this.#id('text-italic', orderId, jid, tid), 'Italic', String(!!t.italicText))}
            ${this.#fg(this.#id('text-underline', orderId, jid, tid), 'Underline', String(!!t.underlineText))}
          </div>
        </div>
      `;
    }).join("");
  }

  // ===== Helpers de UI (form_group) =====
  #fg(id, label, value, type = "text") {
    return `
      <div class="form_group">
        <label for="${this.#esc(id)}">${this.#esc(label)}</label>
        <input id="${this.#esc(id)}" type="${this.#esc(type)}" value="${this.#esc(value ?? '')}" readonly>
      </div>
    `;
  }

  #fgTextArea(id, label, value) {
    return `
      <div class="form_group">
        <label for="${this.#esc(id)}">${this.#esc(label)}</label>
        <textarea id="${this.#esc(id)}" rows="6" readonly>${this.#esc(value ?? '')}</textarea>
      </div>
    `;
  }

  #id(...parts) {
    const slug = parts.filter(Boolean).map(p =>
      String(p).toLowerCase().replace(/[^a-z0-9]+/g, "-")
    ).join("-");
    return slug.replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  #esc(v) {
    return String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  // Convierte claves tipo snake_case / kebabCase a "Title Case" y mapea nombres conocidos
  #labelize(key) {
    if (!key) return "";
    const map = {
      lanyard_type: "Lanyard type",
      side_printed: "Side printed",
      colour_quantity: "Colour quantity",
      price_per_unit: "Price per unit",
      id_price_amount: "ID PriceAmount",
      id_supplier: "Supplier",
    };
    if (map[key]) return map[key];

    // Title Case básico: reemplaza _ y - por espacios y capitaliza
    return String(key)
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
  }

  // Formatea el valor para mostrarlo en input
  #toDisplay(v) {
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return String(v);
    if (typeof v === "string") return v;
    // Objetos/arrays anidados: compactar
    try { return JSON.stringify(v); } catch { return String(v); }
  }


  toggle(header) {
    const accordion = header.closest('.inner-accordion');
    if (!accordion) return;
    const content = accordion.querySelector(':scope > .inner-accordion_content');
    if (!content) return;

    const isOpen = accordion.classList.toggle('is-open');
    header.setAttribute('aria-expanded', String(isOpen));
    content.hidden = !isOpen;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ControllerOrdersLanyards4You().init();
});
