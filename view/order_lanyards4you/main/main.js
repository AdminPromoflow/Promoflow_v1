class ControllerOrdersLanyards4You {
  constructor(rootSelector = '.container_order') {
    this.rootSelector = rootSelector;
    this.root = null;

    // Bind handlers to preserve `this`
    this.onOuterClick = this.onOuterClick.bind(this);
    this.onOuterKeydown = this.onOuterKeydown.bind(this);
  }

  init() {
    this.root = document.querySelector(this.rootSelector);
    if (!this.root) return;

    this.initOuterHeaders();
    this.attachOuterEvents();
    this.initInnerAccordions();

    this.fetchOrders();
  }

  /* ---------- OUTER ACCORDION (".accordion") ---------- */

  initOuterHeaders() {
    this.root.querySelectorAll('.accordion_header').forEach((header) => {
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');
      header.tabIndex = 0;
    });
  }

  attachOuterEvents() {
    // Event delegation for all outer accordions
    this.root.addEventListener('click', this.onOuterClick);
    this.root.addEventListener('keydown', this.onOuterKeydown);
  }

  onOuterClick(e) {
    const header = e.target.closest('.accordion_header');
    if (!header || !this.root.contains(header)) return;

    const acc = header.closest('.accordion');
    if (!acc) return;

    this.toggleOuter(acc, header);
  }

  onOuterKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const header = e.target.closest('.accordion_header');
    if (!header || !this.root.contains(header)) return;

    e.preventDefault();
    const acc = header.closest('.accordion');
    if (!acc) return;

    this.toggleOuter(acc, header);
  }

  toggleOuter(acc, header) {
    const willOpen = !acc.classList.contains('open');
    acc.classList.toggle('open', willOpen);
    header.setAttribute('aria-expanded', String(willOpen));
    // Show/hide + arrow rotation handled by CSS
  }

  /* ---------- INNER ACCORDION (".inner-accordion") ---------- */

  initInnerAccordions() {
    this.root.querySelectorAll('.inner-accordion').forEach((acc) => {
      this.bindInnerAccordion(acc);
    });
  }

  bindInnerAccordion(acc) {
    const header  = acc.querySelector('.inner-accordion_header');
    const content = acc.querySelector('.inner-accordion_content');
    if (!header || !content) return;

    // Initial state
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.tabIndex = 0;
    content.hidden = true;

    const toggle = () => this.toggleInner(acc, header, content);

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  }

  toggleInner(acc, header, content) {
    const willOpen = !acc.classList.contains('is-open');
    acc.classList.toggle('is-open', willOpen);
    header.setAttribute('aria-expanded', String(willOpen));
    content.hidden = !willOpen;
    // CSS controls arrow rotation via .is-open
  }

  /* ---------- DATA ---------- */

  // Function to fetch orders from the server
  fetchOrders() {
    const url = "../../../controller/lanyards4you/order.php"; // API endpoint for orders
    const data = {
      action: "getOrders" // Action to request orders
    };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Network error.");
      })
      .then(data => {
        console.log(JSON.stringify(data));
        // ✅ Llamar método de instancia, no variable global
        //this.drawOrdersHTML(data);
      })
      .catch(error => {
        console.error("Error:", error.message);
        alert(error.message);
      });
  }

  /* ---------- RENDER ---------- */

  // Draw orders into #main_lanyards4you using the AJAX response shape provided
  drawOrdersHTML(response) {
    const main = document.getElementById("main_lanyards4you");
    if (!main) {
      console.error("Element with id 'main_lanyards4you' not found.");
      return;
    }

    // Vaciar antes de dibujar
    main.innerHTML = "";

    // Guard: expect { success: true, orders: [...] }
    if (!response || response.success !== true || !Array.isArray(response.orders)) {
      console.warn("Unexpected response shape for orders:", response);
      return;
    }

    // Helpers
    const esc = (s) => String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
    const fmtDate = (dt) => dt ? new Date(dt.replace(" ", "T")).toLocaleString() : "";
    const fmtMoney = (n) => (n ?? "") === "" ? "" : Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });

    // Build HTML for each order
    const chunks = response.orders.map((bundle, idx) => {
      const o = bundle.order || {};
      const jobs = Array.isArray(bundle.jobs) ? bundle.jobs : [];
      const user = bundle.user || {};
      const addresses = Array.isArray(bundle.addresses) ? bundle.addresses : [];

      const ordersSection = `
        <div class="grid grid-orders">
          <div class="form_group"><label>ID Order</label><input type="text" value="${esc(o.idOrder)}" readonly></div>
          <div class="form_group"><label>Date/Time</label><input type="text" value="${esc(fmtDate(o.date_time))}" readonly></div>
          <div class="form_group"><label>Status</label><input type="text" value="${esc(o.status)}" readonly></div>
          <div class="form_group"><label>Shipping Days</label><input type="text" value="${esc(o.shippingDays)}" readonly></div>
          <div class="form_group"><label>Subtotal</label><input type="text" value="${esc(fmtMoney(o.subtotal))}" readonly></div>
          <div class="form_group"><label>Tax</label><input type="text" value="${esc(fmtMoney(o.tax))}" readonly></div>
          <div class="form_group"><label>Shipping</label><input type="text" value="${esc(fmtMoney(o.shipping_price))}" readonly></div>
          <div class="form_group"><label>Total</label><input type="text" value="${esc(fmtMoney(o.total))}" readonly></div>
        </div>
      `;

      const jobsSection = jobs.map((jb, jIndex) => {
        const j = jb.job || {};
        const images = Array.isArray(jb.image) ? jb.image : [];
        const texts = Array.isArray(jb.text) ? jb.text : [];
        const artwork = jb.artwork || {};

        const jobCore = `
          <div class="grid grid-jobs">
            <div class="form_group"><label>ID Job</label><input type="text" value="${esc(j.idJobs)}" readonly></div>
            <div class="form_group"><label>Name</label><input type="text" value="${esc(j.name)}" readonly></div>
            <div class="form_group"><label>Price/Unit</label><input type="text" value="${esc(j.price_per_unit)}" readonly></div>
            <div class="form_group"><label>Amount</label><input type="text" value="${esc(j.amount)}" readonly></div>
            <div class="form_group"><label>Total</label><input type="text" value="${esc(j.total)}" readonly></div>
            <div class="form_group form_group--full">
              <label>Description (JSON)</label>
              <textarea rows="4" readonly>${esc(j.description)}</textarea>
            </div>
          </div>
        `;

        const textRows = texts.length
          ? texts.map(t => `
              <div class="text-row">
                <div><strong>Content:</strong> ${esc(t.contentText)}</div>
                <div><strong>Font:</strong> ${esc(t.fontFamilyText)}</div>
                <div><strong>Size:</strong> ${esc(t.sizeText)}</div>
                <div><strong>Colour:</strong> ${esc(t.colourText)}</div>
                <div><strong>Bold:</strong> ${esc(t.boldText)}</div>
                <div><strong>Italic:</strong> ${esc(t.italicText)}</div>
                <div><strong>Underline:</strong> ${esc(t.underlineText)}</div>
              </div>
            `).join("")
          : `<div class="muted">No text rows.</div>`;

        const imageRows = images.length
          ? images.map(im => `
              <div class="image-row">
                <div><strong>Times:</strong> ${esc(im.timesImage)}</div>
                <div><strong>Size:</strong> ${esc(im.imageSize)}</div>
                <div><strong>Rotation:</strong> ${esc(im.imageRotation)}</div>
                <div><strong>Link:</strong> ${im.linkImage ? `<a href="${esc(im.linkImage)}" target="_blank" rel="noopener">Open</a>` : "-"}</div>
              </div>
            `).join("")
          : `<div class="muted">No images.</div>`;

        const artworkBlock = Object.keys(artwork).length
          ? `
            <div class="artwork-row">
              <div><strong>Right:</strong> ${artwork.linkRightImage ? `<a href="${esc(artwork.linkRightImage)}" target="_blank" rel="noopener">Right image</a>` : "-"}</div>
              <div><strong>Left:</strong> ${artwork.linkLeftImage ? `<a href="${esc(artwork.linkLeftImage)}" target="_blank" rel="noopener">Left image</a>` : "-"}</div>
            </div>
          `
          : `<div class="muted">No artwork.</div>`;

        return `
          <div class="inner-accordion">
            <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
              Job #${jIndex + 1}
              <span class="inner-arrow">&#9660;</span>
            </div>
            <div class="inner-accordion_content" hidden>
              ${jobCore}
              <h4>Text</h4>
              ${textRows}
              <h4>Images</h4>
              ${imageRows}
              <h4>Artwork</h4>
              ${artworkBlock}
            </div>
          </div>
        `;
      }).join("");

      const userSection = `
        <div class="grid grid-user">
          <div class="form_group"><label>ID User</label><input type="text" value="${esc(user.idUser)}" readonly></div>
          <div class="form_group"><label>Name</label><input type="text" value="${esc(user.name)}" readonly></div>
          <div class="form_group"><label>Email</label><input type="text" value="${esc(user.email)}" readonly></div>
          <div class="form_group"><label>Signup Category</label><input type="text" value="${esc(user.signup_category)}" readonly></div>
        </div>
      `;

      const addressesSection = (addresses.length
        ? addresses.map((a, aIdx) => `
            <fieldset class="address-block">
              <legend>Address #${aIdx + 1}</legend>
              <div class="grid grid-address">
                <div class="form_group"><label>First name</label><input type="text" value="${esc(a.first_name)}" readonly></div>
                <div class="form_group"><label>Last name</label><input type="text" value="${esc(a.last_name)}" readonly></div>
                <div class="form_group"><label>Company</label><input type="text" value="${esc(a.company_name)}" readonly></div>
                <div class="form_group"><label>Phone</label><input type="text" value="${esc(a.phone)}" readonly></div>
                <div class="form_group"><label>Country</label><input type="text" value="${esc(a.country)}" readonly></div>
                <div class="form_group"><label>State</label><input type="text" value="${esc(a.state)}" readonly></div>
                <div class="form_group"><label>City</label><input type="text" value="${esc(a.town_city)}" readonly></div>
                <div class="form_group form_group--full"><label>Street 1</label><input type="text" value="${esc(a.street_address_1)}" readonly></div>
                <div class="form_group form_group--full"><label>Street 2</label><input type="text" value="${esc(a.street_address_2)}" readonly></div>
                <div class="form_group"><label>Postcode</label><input type="text" value="${esc(a.postcode)}" readonly></div>
                <div class="form_group"><label>Email</label><input type="text" value="${esc(a.email_address)}" readonly></div>
              </div>
            </fieldset>
          `).join("")
        : `<div class="muted">No addresses.</div>`
      );

      return `
        <div class="accordion">
          <div class="accordion_header" role="button" aria-expanded="false" tabindex="0">
            Order ${idx + 1} — #${esc(o.idOrder)} • ${esc(o.status)}
            <span class="arrow">&#9660;</span>
          </div>

          <div class="accordion_content" hidden>
            <div class="inner-accordion">
              <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
                Orders
                <span class="inner-arrow">&#9660;</span>
              </div>
              <div class="inner-accordion_content" hidden>
                ${ordersSection}
              </div>
            </div>

            ${jobsSection || `
              <div class="inner-accordion">
                <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
                  Job
                  <span class="inner-arrow">&#9660;</span>
                </div>
                <div class="inner-accordion_content" hidden>
                  <div class="muted">No jobs.</div>
                </div>
              </div>
            `}

            <div class="inner-accordion">
              <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
                User
                <span class="inner-arrow">&#9660;</span>
              </div>
              <div class="inner-accordion_content" hidden>
                ${userSection}
              </div>
            </div>

            <div class="inner-accordion">
              <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
                Addresses
                <span class="inner-arrow">&#9660;</span>
              </div>
              <div class="inner-accordion_content" hidden>
                ${addressesSection}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    // Inject and (re)initialise
    main.innerHTML += chunks.join("");
    this.initOuterHeaders();     // ensure roles/tabindex on new headers
    this.initInnerAccordions();  // bind new inner accordions
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  const controllerOrdersLanyards4You = new ControllerOrdersLanyards4You('.container_order');
  controllerOrdersLanyards4You.init();
});
