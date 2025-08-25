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
        // Acepta status: "success" o success: true
        const ok = (result && (result.status === "success" || result.success === true));
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

  // ========= RENDER =========
  renderOrders(orders) {
    const container = document.getElementById("main_lanyards4you");
    if (!container) return;

    // Level 1: contenedor maestro "Orders"
    const html = `
      <h2>Production Orders</h2>

      <div class="inner-accordion accordion-level-1">
        <div class="inner-accordion_header header-level-1" role="button" aria-expanded="false" tabindex="0">
          Orders (${orders.length})
          <span class="inner-arrow arrow-level-1">&#9660;</span>
        </div>

        <div class="inner-accordion_content content-level-1" hidden>
          ${orders.map(o => this.#orderAccordion(o)).join("")}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // ===== Helper: un Order como Level 2 =====
  #orderAccordion(bundle) {
    const ord = bundle.order || {};
    const jobs = Array.isArray(bundle.jobs) ? bundle.jobs : [];
    const user = bundle.user || null;

    const orderTitle = `#${this.#esc(ord.idOrder)} · ${this.#esc(ord.status || "-")} · ${this.#esc(ord.date_time || "-")} · Total: ${this.#esc(ord.total || "-")}`;

    return `
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          ${orderTitle}
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>

        <div class="inner-accordion_content content-level-2" hidden>
          ${this.#userAccordion(user)}
          ${this.#jobsAccordion(jobs)}
        </div>
      </div>
    `;
  }

  // ===== Helper: User + Addresses como Level 3 =====
  #userAccordion(user) {
    if (!user) return "";

    const addresses = Array.isArray(user.addresses) ? user.addresses : [];

    const userBlock = `
      <div class="user_summary">
        <p><strong>Cliente:</strong> ${this.#esc(user.name || "-")} &lt;${this.#esc(user.email || "-")}&gt;</p>
        <p><strong>ID Usuario:</strong> ${this.#esc(user.idUser || "-")}</p>
        <p><strong>Categoría:</strong> ${this.#esc(user.signup_category || "-")}</p>
      </div>
    `;

    const addrList = addresses.length
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
      : `<p class="muted">Sin direcciones registradas.</p>`;

    return `
      <div class="inner-accordion accordion-level-3">
        <div class="inner-accordion_header header-level-3" role="button" aria-expanded="false" tabindex="0">
          Cliente y direcciones
          <span class="inner-arrow arrow-level-3">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-3" hidden>
          ${userBlock}
          <h4>Direcciones (${addresses.length})</h4>
          ${addrList}
        </div>
      </div>
    `;
  }

  // ===== Helper: Jobs como Level 3 que contiene Level 4 por cada Job =====
  #jobsAccordion(jobs) {
    if (!jobs.length) {
      return `
        <div class="inner-accordion accordion-level-3">
          <div class="inner-accordion_header header-level-3" role="button" aria-expanded="false" tabindex="0">
            Jobs (0)
            <span class="inner-arrow arrow-level-3">&#9660;</span>
          </div>
          <div class="inner-accordion_content content-level-3" hidden>
            <p class="muted">No hay trabajos asociados a esta orden.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="inner-accordion accordion-level-3">
        <div class="inner-accordion_header header-level-3" role="button" aria-expanded="false" tabindex="0">
          Jobs (${jobs.length})
          <span class="inner-arrow arrow-level-3">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-3" hidden>
          ${jobs.map(j => this.#jobAccordion(j)).join("")}
        </div>
      </div>
    `;
  }

  // ===== Helper: un Job como Level 4 con secciones Level 5 (Artwork / Images / Texts) =====
  #jobAccordion(jobWrap) {
    const job = jobWrap?.job || {};
    const title = `${this.#esc(job.name || "Job")} · Qty ${this.#esc(job.amount || "-")} · Total ${this.#esc(job.total || "-")}`;

    const descriptionHTML = this.#renderDescription(job.description);
    const artworkHTML = this.#renderArtwork(job.artwork);
    const imagesHTML = this.#renderImages(job.image);
    const textsHTML = this.#renderTexts(job.text);

    const basics = `
      <ul class="job_basics">
        <li><strong>ID Job:</strong> ${this.#esc(job.idJobs || "-")}</li>
        <li><strong>Price/Unit:</strong> ${this.#esc(job.price_per_unit || "-")}</li>
        <li><strong>Link PDF:</strong> ${this.#esc(job.link_pdf ?? "-")}</li>
        <li><strong>Notas:</strong> ${this.#esc(job.notes ?? "-")}</li>
        <li><strong>ID Order:</strong> ${this.#esc(job.idOrder || "-")}</li>
        <li><strong>ID PriceAmount:</strong> ${this.#esc(job.idPriceAmount || "-")}</li>
        <li><strong>Proveedor:</strong> ${this.#esc(job.idSupplier ?? "-")}</li>
      </ul>
    `;

    return `
      <div class="inner-accordion accordion-level-4">
        <div class="inner-accordion_header header-level-4" role="button" aria-expanded="false" tabindex="0">
          ${title}
          <span class="inner-arrow arrow-level-4">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-4" hidden>

          <div class="job_section">
            <h4>Descripción</h4>
            ${descriptionHTML}
          </div>

          <div class="job_section">
            <h4>Datos básicos</h4>
            ${basics}
          </div>

          <!-- Level 5: secciones del Job -->
          <div class="inner-accordion accordion-level-5">
            <div class="inner-accordion_header header-level-5" role="button" aria-expanded="false" tabindex="0">
              Artwork
              <span class="inner-arrow arrow-level-5">&#9660;</span>
            </div>
            <div class="inner-accordion_content content-level-5" hidden>
              ${artworkHTML}
            </div>
          </div>

          <div class="inner-accordion accordion-level-5">
            <div class="inner-accordion_header header-level-5" role="button" aria-expanded="false" tabindex="0">
              Images (${Array.isArray(job.image) ? job.image.length : 0})
              <span class="inner-arrow arrow-level-5">&#9660;</span>
            </div>
            <div class="inner-accordion_content content-level-5" hidden>
              ${imagesHTML}
            </div>
          </div>

          <div class="inner-accordion accordion-level-5">
            <div class="inner-accordion_header header-level-5" role="button" aria-expanded="false" tabindex="0">
              Texts (${Array.isArray(job.text) ? job.text.length : 0})
              <span class="inner-arrow arrow-level-5">&#9660;</span>
            </div>
            <div class="inner-accordion_content content-level-5" hidden>
              ${textsHTML}
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // ====== Subrenders ======
  #renderDescription(desc) {
    if (typeof desc !== "string" || !desc.trim()) {
      return `<p class="muted">Sin descripción.</p>`;
    }
    try {
      const obj = JSON.parse(desc);
      return `<pre class="code-block">${this.#esc(JSON.stringify(obj, null, 2))}</pre>`;
    } catch {
      // No es JSON válido; mostrar tal cual
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
            <div><strong>Posición:</strong> ${this.#esc(t.text_position ?? t.textPosition ?? "-")}</div>
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
