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
        // soporta status:"success" o success:true
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

    // Nivel 1: un acordeón por cada Order
    const list = (orders || []).map(bundle => this.#renderOrderLevel1(bundle)).join("");

    container.innerHTML = `
      <h2>Production Orders</h2>
      ${list || `<p class="muted">No hay órdenes para mostrar.</p>`}
    `;
  }

  // ====== NIVEL 1: Order ======
  #renderOrderLevel1(bundle) {
    const o   = bundle?.order ?? {};
    const uid = bundle?.user?.idUser ?? "-";
    const head = `Order #${this.#esc(o.idOrder)} · ${this.#esc(o.status || "-")} · ${this.#esc(o.date_time || "-")} · Total ${this.#esc(o.total || "-")}`;

    return `
      <div class="inner-accordion accordion-level-1">
        <div class="inner-accordion_header header-level-1" role="button" aria-expanded="false" tabindex="0">
          ${head}
          <span class="inner-arrow arrow-level-1">&#9660;</span>
        </div>

        <div class="inner-accordion_content content-level-1" hidden>
          ${this.#renderOrderInfoLevel2(o)}
          ${this.#renderJobsLevel2(bundle?.jobs || [])}
          ${this.#renderUserLevel2(bundle?.user || null)}
        </div>
      </div>
    `;
  }

  // ====== NIVEL 2: Order information ======
  #renderOrderInfoLevel2(order) {
    return `
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Order information
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          <ul class="order_info">
            <li><strong>ID:</strong> ${this.#esc(order.idOrder ?? "-")}</li>
            <li><strong>Date:</strong> ${this.#esc(order.date_time ?? "-")}</li>
            <li><strong>Status:</strong> ${this.#esc(order.status ?? "-")}</li>
            <li><strong>Shipping days:</strong> ${this.#esc(order.shippingDays ?? "-")}</li>
            <li><strong>Subtotal:</strong> ${this.#esc(order.subtotal ?? "-")}</li>
            <li><strong>Tax:</strong> ${this.#esc(order.tax ?? "-")}</li>
            <li><strong>Shipping price:</strong> ${this.#esc(order.shipping_price ?? "-")}</li>
            <li><strong>Total:</strong> ${this.#esc(order.total ?? "-")}</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ====== NIVEL 2: Jobs ======
  #renderJobsLevel2(jobsWrap) {
    const jobs = Array.isArray(jobsWrap) ? jobsWrap : [];
    return `
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Jobs (${jobs.length})
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          ${jobs.length ? jobs.map(j => this.#renderJobLevel3(j)).join("") : `<p class="muted">Sin trabajos.</p>`}
        </div>
      </div>
    `;
  }

  // ====== NIVEL 3 en Jobs: Description / Artwork / Image / Text por cada Job ======
  #renderJobLevel3(jobWrap) {
    const job = jobWrap?.job || {};
    const title = `${this.#esc(job.name || "Job")} · Qty ${this.#esc(job.amount || "-")} · Total ${this.#esc(job.total || "-")} (ID ${this.#esc(job.idJobs || "-")})`;

    return `
      <div class="job_block">
        <div class="job_header">
          <h4>${title}</h4>
          <ul class="job_meta">
            <li><strong>Price/Unit:</strong> ${this.#esc(job.price_per_unit ?? "-")}</li>
            <li><strong>ID Order:</strong> ${this.#esc(job.idOrder ?? "-")}</li>
            <li><strong>ID PriceAmount:</strong> ${this.#esc(job.idPriceAmount ?? "-")}</li>
            <li><strong>Supplier:</strong> ${this.#esc(job.idSupplier ?? "-")}</li>
            <li><strong>PDF:</strong> ${this.#esc(job.link_pdf ?? "-")}</li>
          </ul>
        </div>

        <!-- Tercer nivel: 4 secciones -->
        ${this.#jobSectionLevel3("Description", this.#renderDescription(job.description))}
        ${this.#jobSectionLevel3("Artwork", this.#renderArtwork(job.artwork))}
        ${this.#jobSectionLevel3(`Image (${Array.isArray(job.image) ? job.image.length : 0})`, this.#renderImages(job.image))}
        ${this.#jobSectionLevel3(`Text (${Array.isArray(job.text) ? job.text.length : 0})`, this.#renderTexts(job.text))}
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
    if (!user) {
      return `
        <div class="inner-accordion accordion-level-2">
          <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
            User
            <span class="inner-arrow arrow-level-2">&#9660;</span>
          </div>
          <div class="inner-accordion_content content-level-2" hidden>
            <p class="muted">Sin información de usuario.</p>
          </div>
        </div>
      `;
    }

    const summary = `
      <div class="user_summary">
        <p><strong>Nombre:</strong> ${this.#esc(user.name || "-")}</p>
        <p><strong>Email:</strong> ${this.#esc(user.email || "-")}</p>
        <p><strong>ID Usuario:</strong> ${this.#esc(user.idUser || "-")}</p>
        <p><strong>Categoría:</strong> ${this.#esc(user.signup_category || "-")}</p>
      </div>
    `;

    // Nivel 3: Addresses
    const addresses = Array.isArray(user.addresses) ? user.addresses : [];
    const addrHTML = addresses.length
      ? `
        <ul class="address_list">
          ${addresses.map(a => `
            <li class="address_item">
              <div><strong>${this.#esc([a.first_name, a.last_name].filter(Boolean).join(" ") || "-")}</strong> ${a.company_name ? `· ${this.#esc(a.company_name)}` : ""}</div>
              <div>${this.#esc(a.street_address_1 || "")} ${this.#esc(a.street_address_2 || "")}</div>
              <div>${this.#esc(a.town_city || "")} ${this.#esc(a.state || "")} ${this.#esc(a.country || "")}</div>
              <div>CP: ${this.#esc(a.postcode || "-")} · Tel: ${this.#esc(a.phone || "-")}</div>
              <div>${this.#esc(a.email_address || "")}</div>
            </li>
          `).join("")}
        </ul>
      `
      : `<p class="muted">Sin direcciones.</p>`;

    const addressesAcc = `
      <div class="inner-accordion accordion-level-3">
        <div class="inner-accordion_header header-level-3" role="button" aria-expanded="false" tabindex="0">
          Addresses (${addresses.length})
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
          ${addressesAcc}
        </div>
      </div>
    `;
  }

  // ====== Subrenders ======
  #renderDescription(desc) {
    if (!desc || typeof desc !== "string") return `<p class="muted">Sin descripción.</p>`;
    try {
      const obj = JSON.parse(desc);
      return `<pre class="code-block">${this.#esc(JSON.stringify(obj, null, 2))}</pre>`;
    } catch {
      return `<pre class="code-block">${this.#esc(desc)}</pre>`;
    }
  }

  #renderArtwork(art) {
    if (!art || typeof art !== "object" || Object.keys(art).length === 0) {
      return `<p class="muted">Sin artwork.</p>`;
    }
    return `
      <ul class="artwork_list">
        <li><strong>Right:</strong> ${this.#esc(art.linkRightImage ?? "-")}</li>
        <li><strong>Left:</strong> ${this.#esc(art.linkLeftImage ?? "-")}</li>
      </ul>
    `;
  }

  #renderImages(arr) {
    const list = Array.isArray(arr) ? arr : [];
    if (!list.length) return `<p class="muted">Sin imágenes.</p>`;
    return `
      <ul class="image_list">
        ${list.map(im => `
          <li>
            <div><strong>Times:</strong> ${this.#esc(im.timesImage ?? "-")}</div>
            <div><strong>Size:</strong> ${this.#esc(im.imageSize ?? "-")}</div>
            <div><strong>Between:</strong> ${this.#esc(im.spaceBetweenImage ?? "-")} · <strong>Along:</strong> ${this.#esc(im.spaceAlongLanyard ?? "-")}</div>
            <div><strong>Rotation:</strong> ${this.#esc(im.imageRotation ?? "-")}</div>
            <div><strong>Position:</strong> ${this.#esc(im.imagePosition ?? "-")}</div>
            <div><strong>Link:</strong> ${this.#esc(im.linkImage ?? "-")}</div>
          </li>
        `).join("")}
      </ul>
    `;
  }

  #renderTexts(arr) {
    const list = Array.isArray(arr) ? arr : [];
    if (!list.length) return `<p class="muted">Sin textos.</p>`;
    return `
      <ul class="text_list">
        ${list.map(t => `
          <li>
            <div><strong>Contenido:</strong> ${this.#esc(t.contentText ?? "-")}</div>
            <div><strong>Time:</strong> ${this.#esc(t.timeText ?? "-")} · <strong>Between:</strong> ${this.#esc(t.spaceBetweenText ?? "-")} · <strong>Along:</strong> ${this.#esc(t.spaceAlongLanyard ?? "-")}</div>
            <div><strong>Font:</strong> ${this.#esc(t.fontFamilyText ?? "-")} · <strong>Size:</strong> ${this.#esc(t.sizeText ?? "-")} · <strong>Color:</strong> ${this.#esc(t.colourText ?? "-")}</div>
            <div><strong>Styles:</strong> B:${this.#esc(t.boldText ?? false)} I:${this.#esc(t.italicText ?? false)} U:${this.#esc(t.underlineText ?? false)}</div>
            <div><strong>Position:</strong> ${this.#esc(t.text_position ?? t.textPosition ?? "-")}</div>
          </li>
        `).join("")}
      </ul>
    `;
  }

  // ===== Util =====
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
