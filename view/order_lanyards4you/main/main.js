class ControllerOrdersLanyards4You {
  constructor() {
    this.orders = []; // estado local editable
  }

  init() {
    this.getOrders();

    // Delegation: toggle acordeones
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.inner-accordion_header');
      if (header) this.toggle(header);
    });

    // Teclado accesible
    document.addEventListener('keydown', (e) => {
      const header = e.target.closest?.('.inner-accordion_header');
      if (!header) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle(header);
      }
    });

    // Edición: escuchar cambios en inputs y textareas dentro del main
    document.addEventListener('input', (e) => {
      const el = e.target;
      if (!el.closest('#main_lanyards4you')) return;
      if (!(el.matches('input') || el.matches('textarea'))) return;
      this.handleEdit(el);
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
          // Guardar estado editable
          this.orders = result.orders;
          this.renderOrders(this.orders);
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

    const list = (orders || []).map((bundle, oIndex) => this.#renderOrderLevel1(bundle, oIndex)).join("");

    container.innerHTML = `
      <h2>Production Orders</h2>
      ${list || `<p class="muted">No hay órdenes para mostrar.</p>`}
    `;
  }

  // ====== NIVEL 1: Order ======
  #renderOrderLevel1(bundle, oIndex) {
    const o = bundle?.order ?? {};
    const head = `Order #${this.#esc(o.idOrder)} · ${this.#esc(o.status || "-")} · ${this.#esc(o.date_time || "-")} · Total ${this.#esc(o.total || "-")}`;

    return `
      <div class="inner-accordion accordion-level-1">
        <div class="inner-accordion_header header-level-1" role="button" aria-expanded="false" tabindex="0">
          ${head}
          <span class="inner-arrow arrow-level-1">&#9660;</span>
        </div>

        <div class="inner-accordion_content content-level-1" hidden>
          ${this.#renderOrderInfoLevel2(o, oIndex)}
          ${this.#renderJobsLevel2(bundle?.jobs || [], oIndex)}
          ${this.#renderUserLevel2(bundle?.user || null, oIndex)}
        </div>
      </div>
    `;
  }

  // ====== NIVEL 2: Order information (editable) ======
  #renderOrderInfoLevel2(order, oIndex) {
    const oid = this.#esc(order.idOrder ?? "x");
    return `
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Order information
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          <div class="form_row">
            ${this.#fg(this.#id('order-id', oid), 'ID', order.idOrder, {scope:'order', oindex:oIndex, field:'idOrder'})}
            ${this.#fg(this.#id('order-date', oid), 'Date', order.date_time, {scope:'order', oindex:oIndex, field:'date_time'})}
            ${this.#fg(this.#id('order-status', oid), 'Status', order.status, {scope:'order', oindex:oIndex, field:'status'})}
          </div>
          <div class="form_row">
            ${this.#fg(this.#id('order-shipdays', oid), 'Shipping days', order.shippingDays, {scope:'order', oindex:oIndex, field:'shippingDays'})}
            ${this.#fg(this.#id('order-subtotal', oid), 'Subtotal', order.subtotal, {scope:'order', oindex:oIndex, field:'subtotal'})}
            ${this.#fg(this.#id('order-tax', oid), 'Tax', order.tax, {scope:'order', oindex:oIndex, field:'tax'})}
            ${this.#fg(this.#id('order-shipprice', oid), 'Shipping price', order.shipping_price, {scope:'order', oindex:oIndex, field:'shipping_price'})}
            ${this.#fg(this.#id('order-total', oid), 'Total', order.total, {scope:'order', oindex:oIndex, field:'total'})}
          </div>
        </div>
      </div>
    `;
  }

  // ====== NIVEL 2: Jobs ======
  #renderJobsLevel2(jobsWrap, oIndex) {
    const jobs = Array.isArray(jobsWrap) ? jobsWrap : [];
    return `
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Jobs (${jobs.length})
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          ${jobs.length ? jobs.map((j, jIndex) => this.#renderJobLevel3(j, oIndex, jIndex)).join("") : `<p class="muted">Sin trabajos.</p>`}
        </div>
      </div>
    `;
  }

  // ====== NIVEL 3 en Jobs: Description / Artwork / Image / Text ======
  #renderJobLevel3(jobWrap, oIndex, jIndex) {
    const job = jobWrap?.job || {};
    const jid = this.#esc(job.idJobs ?? "x");
    const title = `${this.#esc(job.name || "Job")} · Qty ${this.#esc(job.amount || "-")} · Total ${this.#esc(job.total || "-")} (ID ${this.#esc(job.idJobs || "-")})`;

    const headerBlocks = `
      <div class="form_row">
        ${this.#fg(this.#id('job-id', jid), 'ID Job', job.idJobs, {scope:'job', oindex:oIndex, jindex:jIndex, field:'idJobs'})}
        ${this.#fg(this.#id('job-qty', jid), 'Quantity', job.amount, {scope:'job', oindex:oIndex, jindex:jIndex, field:'amount'})}
        ${this.#fg(this.#id('job-priceunit', jid), 'Price/Unit', job.price_per_unit, {scope:'job', oindex:oIndex, jindex:jIndex, field:'price_per_unit'})}
        ${this.#fg(this.#id('job-total', jid), 'Total', job.total, {scope:'job', oindex:oIndex, jindex:jIndex, field:'total'})}
      </div>
      <div class="form_row">
        ${this.#fg(this.#id('job-idorder', jid), 'ID Order', job.idOrder, {scope:'job', oindex:oIndex, jindex:jIndex, field:'idOrder'})}
        ${this.#fg(this.#id('job-idpriceamount', jid), 'ID PriceAmount', job.idPriceAmount, {scope:'job', oindex:oIndex, jindex:jIndex, field:'idPriceAmount'})}
        ${this.#fg(this.#id('job-supplier', jid), 'Supplier', job.idSupplier, {scope:'job', oindex:oIndex, jindex:jIndex, field:'idSupplier'})}
        ${this.#fg(this.#id('job-pdf', jid), 'PDF', job.link_pdf ?? '-', {scope:'job', oindex:oIndex, jindex:jIndex, field:'link_pdf'})}
      </div>
    `;

    return `
      <div class="job_block">
        <div class="job_header">
          <h4>${title}</h4>
          ${headerBlocks}
        </div>

        ${this.#jobSectionLevel3("Description", this.#renderDescription(job.description, oIndex, jIndex))}
        ${this.#jobSectionLevel3("Artwork", this.#renderArtwork(job.artwork, oIndex, jIndex))}
        ${this.#jobSectionLevel3(`Image (${Array.isArray(job.image) ? job.image.length : 0})`, this.#renderImages(job.image, oIndex, jIndex))}
        ${this.#jobSectionLevel3(`Text (${Array.isArray(job.text) ? job.text.length : 0})`, this.#renderTexts(job.text, oIndex, jIndex))}
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
  #renderUserLevel2(user, oIndex) {
    const uid = this.#esc(user?.idUser ?? "x");

    const summary = user ? `
      <div class="form_row">
        ${this.#fg(this.#id('user-name', uid), 'Name', user.name, {scope:'user', oindex:oIndex, field:'name'})}
        ${this.#fg(this.#id('user-email', uid), 'Email', user.email, {scope:'user', oindex:oIndex, field:'email'})}
        ${this.#fg(this.#id('user-id', uid), 'User ID', user.idUser, {scope:'user', oindex:oIndex, field:'idUser'})}
        ${this.#fg(this.#id('user-category', uid), 'Category', user.signup_category, {scope:'user', oindex:oIndex, field:'signup_category'})}
      </div>
    ` : `<p class="muted">Sin información de usuario.</p>`;

    const addrs = Array.isArray(user?.addresses) ? user.addresses : [];
    const addrHTML = addrs.length
      ? addrs.map((a, aIndex) => {
          const aid = this.#esc(a.idAddress ?? `addr${aIndex}`);
          return `
            <div class="form_card">
              <h5>Address ${aIndex + 1}</h5>
              <div class="form_row">
                ${this.#fg(this.#id('addr-firstname', aid), 'First name', a.first_name, {scope:'address', oindex:oIndex, aindex:aIndex, field:'first_name'})}
                ${this.#fg(this.#id('addr-lastname', aid), 'Last name', a.last_name, {scope:'address', oindex:oIndex, aindex:aIndex, field:'last_name'})}
                ${this.#fg(this.#id('addr-company', aid), 'Company Name', a.company_name, {scope:'address', oindex:oIndex, aindex:aIndex, field:'company_name'})}
              </div>
              <div class="form_row">
                ${this.#fg(this.#id('addr-street1', aid), 'Street address 1', a.street_address_1, {scope:'address', oindex:oIndex, aindex:aIndex, field:'street_address_1'})}
                ${this.#fg(this.#id('addr-street2', aid), 'Street address 2', a.street_address_2, {scope:'address', oindex:oIndex, aindex:aIndex, field:'street_address_2'})}
              </div>
              <div class="form_row">
                ${this.#fg(this.#id('addr-city', aid), 'City', a.town_city, {scope:'address', oindex:oIndex, aindex:aIndex, field:'town_city'})}
                ${this.#fg(this.#id('addr-state', aid), 'State', a.state, {scope:'address', oindex:oIndex, aindex:aIndex, field:'state'})}
                ${this.#fg(this.#id('addr-country', aid), 'Country', a.country, {scope:'address', oindex:oIndex, aindex:aIndex, field:'country'})}
                ${this.#fg(this.#id('addr-postcode', aid), 'Postcode', a.postcode, {scope:'address', oindex:oIndex, aindex:aIndex, field:'postcode'})}
              </div>
              <div class="form_row">
                ${this.#fg(this.#id('addr-phone', aid), 'Phone', a.phone, {scope:'address', oindex:oIndex, aindex:aIndex, field:'phone'})}
                ${this.#fg(this.#id('addr-email', aid), 'Email', a.email_address, {scope:'address', oindex:oIndex, aindex:aIndex, field:'email_address'})}
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

  // ====== Description separada por componentes (editable) ======
  #renderDescription(desc, oIndex, jIndex) {
    const baseId = this.#id('job-description', oIndex, jIndex);

    if (!desc || typeof desc !== "string" || !desc.trim()) {
      return this.#fg(baseId, 'Description', 'Sin descripción', {scope:'job', oindex:oIndex, jindex:jIndex, field:'description'});
    }

    let obj;
    try { obj = JSON.parse(desc); } catch { obj = null; }

    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      // Una tarjeta por componente
      return Object.entries(obj).map(([compKey, compVal], idx) => {
        const compId = this.#id(baseId, compKey, String(idx));
        const compTitle = this.#labelize(compKey);

        if (compVal && typeof compVal === "object" && !Array.isArray(compVal)) {
          const fieldsHTML = Object.entries(compVal).map(([subKey, subVal]) => {
            const fieldId = this.#id(compId, subKey);
            const label   = this.#labelize(subKey);
            return this.#fg(
              fieldId,
              label,
              this.#toDisplay(subVal),
              {scope:'desc', oindex:oIndex, jindex:jIndex, comp:compKey, field:subKey}
            );
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

        // Escalar
        return `
          <div class="form_card">
            <h5>${this.#esc(compTitle)}</h5>
            <div class="form_row">
              ${this.#fg(this.#id(compId, 'value'), 'Value', this.#toDisplay(compVal),
                {scope:'desc', oindex:oIndex, jindex:jIndex, comp:compKey, field:'value'})}
            </div>
          </div>
        `;
      }).join("");
    }

    // Si no es objeto, lo dejamos editable directo
    return this.#fg(baseId, 'Description (JSON)', desc, {scope:'job', oindex:oIndex, jindex:jIndex, field:'description'});
  }

  #renderArtwork(art, oIndex, jIndex) {
    if (!art || typeof art !== "object") {
      return this.#fg(this.#id('job-artwork-empty', oIndex, jIndex), 'Artwork', 'Sin artwork', {scope:'art', oindex:oIndex, jindex:jIndex, field:'_empty'});
    }
    return `
      <div class="form_row">
        ${this.#fg(this.#id('job-art-right', oIndex, jIndex), 'Right image', art.linkRightImage ?? '-', {scope:'art', oindex:oIndex, jindex:jIndex, field:'linkRightImage'})}
        ${this.#fg(this.#id('job-art-left', oIndex, jIndex), 'Left image', art.linkLeftImage ?? '-', {scope:'art', oindex:oIndex, jindex:jIndex, field:'linkLeftImage'})}
      </div>
    `;
  }

  #renderImages(arr, oIndex, jIndex) {
    const list = Array.isArray(arr) ? arr : [];
    if (!list.length) {
      return this.#fg(this.#id('job-images-empty', oIndex, jIndex), 'Images', 'Sin imágenes', {scope:'image', oindex:oIndex, jindex:jIndex, iindex:-1, field:'_empty'});
    }
    return list.map((im, i) => {
      return `
        <div class="form_card">
          <h5>Image ${i + 1}</h5>
          <div class="form_row">
            ${this.#fg(this.#id('img-times', oIndex, jIndex, i), 'Times', im.timesImage ?? '-', {scope:'image', oindex:oIndex, jindex:jIndex, iindex:i, field:'timesImage'})}
            ${this.#fg(this.#id('img-size', oIndex, jIndex, i), 'Size', im.imageSize ?? '-', {scope:'image', oindex:oIndex, jindex:jIndex, iindex:i, field:'imageSize'})}
            ${this.#fg(this.#id('img-rotation', oIndex, jIndex, i), 'Rotation', im.imageRotation ?? '-', {scope:'image', oindex:oIndex, jindex:jIndex, iindex:i, field:'imageRotation'})}
            ${this.#fg(this.#id('img-position', oIndex, jIndex, i), 'Position', im.imagePosition ?? '-', {scope:'image', oindex:oIndex, jindex:jIndex, iindex:i, field:'imagePosition'})}
          </div>
          <div class="form_row">
            ${this.#fg(this.#id('img-between', oIndex, jIndex, i), 'Space between', im.spaceBetweenImage ?? '-', {scope:'image', oindex:oIndex, jindex:jIndex, iindex:i, field:'spaceBetweenImage'})}
            ${this.#fg(this.#id('img-along', oIndex, jIndex, i), 'Space along', im.spaceAlongLanyard ?? '-', {scope:'image', oindex:oIndex, jindex:jIndex, iindex:i, field:'spaceAlongLanyard'})}
            ${this.#fg(this.#id('img-link', oIndex, jIndex, i), 'Link', im.linkImage ?? '-', {scope:'image', oindex:oIndex, jindex:jIndex, iindex:i, field:'linkImage'})}
          </div>
        </div>
      `;
    }).join("");
  }

  #renderTexts(arr, oIndex, jIndex) {
    const list = Array.isArray(arr) ? arr : [];
    if (!list.length) {
      return this.#fg(this.#id('job-texts-empty', oIndex, jIndex), 'Texts', 'Sin textos', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:-1, field:'_empty'});
    }
    return list.map((t, i) => {
      return `
        <div class="form_card">
          <h5>Text ${i + 1}</h5>
          <div class="form_row">
            ${this.#fg(this.#id('text-content', oIndex, jIndex, i), 'Content', t.contentText ?? '-', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'contentText'})}
            ${this.#fg(this.#id('text-color', oIndex, jIndex, i), 'Color', t.colourText ?? '-', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'colourText'})}
            ${this.#fg(this.#id('text-font', oIndex, jIndex, i), 'Font', t.fontFamilyText ?? '-', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'fontFamilyText'})}
            ${this.#fg(this.#id('text-size', oIndex, jIndex, i), 'Size', t.sizeText ?? '-', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'sizeText'})}
          </div>
          <div class="form_row">
            ${this.#fg(this.#id('text-time', oIndex, jIndex, i), 'Time', t.timeText ?? '-', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'timeText'})}
            ${this.#fg(this.#id('text-between', oIndex, jIndex, i), 'Space between', t.spaceBetweenText ?? '-', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'spaceBetweenText'})}
            ${this.#fg(this.#id('text-along', oIndex, jIndex, i), 'Space along', t.spaceAlongLanyard ?? '-', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'spaceAlongLanyard'})}
            ${this.#fg(this.#id('text-position', oIndex, jIndex, i), 'Position', t.text_position ?? t.textPosition ?? '-', {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:(t.text_position!==undefined?'text_position':'textPosition')})}
          </div>
          <div class="form_row">
            ${this.#fg(this.#id('text-bold', oIndex, jIndex, i), 'Bold', String(!!t.boldText), {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'boldText'})}
            ${this.#fg(this.#id('text-italic', oIndex, jIndex, i), 'Italic', String(!!t.italicText), {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'italicText'})}
            ${this.#fg(this.#id('text-underline', oIndex, jIndex, i), 'Underline', String(!!t.underlineText), {scope:'text', oindex:oIndex, jindex:jIndex, tindex:i, field:'underlineText'})}
          </div>
        </div>
      `;
    }).join("");
  }

  // ======== Manejar edición =========
  handleEdit(el) {
    const ds = el.dataset;
    if (!ds.scope) return;

    const o = this.orders[Number(ds.oindex)];
    if (!o) return;

    const val = el.value;

    switch (ds.scope) {
      case 'order': {
        if (!o.order) return;
        o.order[ds.field] = val;
        break;
      }
      case 'user': {
        if (!o.user) return;
        o.user[ds.field] = val;
        break;
      }
      case 'address': {
        const aidx = Number(ds.aindex);
        if (!o.user || !Array.isArray(o.user.addresses) || !o.user.addresses[aidx]) return;
        o.user.addresses[aidx][ds.field] = val;
        break;
      }
      case 'job': {
        const jidx = Number(ds.jindex);
        if (!Array.isArray(o.jobs) || !o.jobs[jidx] || !o.jobs[jidx].job) return;
        o.jobs[jidx].job[ds.field] = val;
        break;
      }
      case 'art': {
        const jidx = Number(ds.jindex);
        const job = o.jobs?.[jidx]?.job;
        if (!job) return;
        job.artwork = job.artwork || {};
        job.artwork[ds.field] = val;
        break;
      }
      case 'image': {
        const jidx = Number(ds.jindex);
        const iidx = Number(ds.iindex);
        const job = o.jobs?.[jidx]?.job;
        if (!job || !Array.isArray(job.image) || !job.image[iidx]) return;
        job.image[iidx][ds.field] = val;
        break;
      }
      case 'text': {
        const jidx = Number(ds.jindex);
        const tidx = Number(ds.tindex);
        const job = o.jobs?.[jidx]?.job;
        if (!job || !Array.isArray(job.text) || !job.text[tidx]) return;
        job.text[tidx][ds.field] = val;
        break;
      }
      case 'desc': {
        const jidx = Number(ds.jindex);
        const job = o.jobs?.[jidx]?.job;
        if (!job) return;
        // cache objeto de description
        if (!job.__descObj) {
          try { job.__descObj = JSON.parse(job.description || "{}"); } catch { job.__descObj = {}; }
        }
        const comp = ds.comp;
        const field = ds.field;
        job.__descObj[comp] = job.__descObj[comp] || {};
        job.__descObj[comp][field] = this.#coerce(val);
        // actualizar cadena JSON
        try {
          job.description = JSON.stringify(job.__descObj);
        } catch {
          // fallback
          job.description = String(val);
        }
        break;
      }
    }

    // Marcar campo como cambiado
    el.classList.add('is-dirty');
  }

  // ===== Helpers UI =====
  #fg(id, label, value, bind = {}, type = "text") {
    const attrs = Object.entries(bind).map(([k,v]) => v !== undefined ? `data-${k}="${this.#esc(v)}"` : "").join(" ");
    return `
      <div class="form_group">
        <label for="${this.#esc(id)}">${this.#esc(label)}</label>
        <input id="${this.#esc(id)}" type="${this.#esc(type)}" value="${this.#esc(value ?? '')}" ${attrs}>
      </div>
    `;
  }

  #id(...parts) {
    const slug = parts.filter(Boolean).map(p =>
      String(p).toLowerCase().replace(/[^a-z0-9]+/g, "-")
    ).join("-");
    return slug.replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

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
    return String(key)
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
  }

  #toDisplay(v) {
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return String(v);
    if (typeof v === "string") return v;
    try { return JSON.stringify(v); } catch { return String(v); }
  }

  #coerce(v) {
    // convierte strings "true"/"false"/números a sus tipos
    if (v === "true") return true;
    if (v === "false") return false;
    const n = Number(v);
    if (!Number.isNaN(n) && String(n) === v.trim()) return n;
    return v;
  }

  #esc(v) {
    return String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
