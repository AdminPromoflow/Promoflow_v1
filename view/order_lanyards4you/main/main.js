class ControllerOrdersLanyards4You {
  constructor(rootSelector = '.container_order') {
    this.rootSelector = rootSelector;
    this.root = null;

    // Selectors (soporta nombres nuevos y legacy)
    this.sel = {
      outerAcc: '.accordion',
      outerHeader: '.accordion_header',
      innerAcc: '.inner-accordion, .acordeon',
      innerHeader: '.inner-accordion_header, .acordeon_header',
      innerContent: '.inner-accordion_content, .acordeon_content'
    };

    // Bind handlers
    this.onOuterClick = this.onOuterClick.bind(this);
    this.onOuterKeydown = this.onOuterKeydown.bind(this);
    this.onInnerClick = this.onInnerClick.bind(this);
    this.onInnerKeydown = this.onInnerKeydown.bind(this);
  }

  init() {
    this.root = document.querySelector(this.rootSelector);
    if (!this.root) return;

    // OUTER
    this.initOuterHeaders();
    this.attachOuterEvents();

    // INNER (inicializa ARIA/hidden y conecta delegación)
    this.initInnerAccordions();
    this.attachInnerEvents();

    // this.fetchOrders();
  }

  /* ---------- OUTER ACCORDION (".accordion") ---------- */

  initOuterHeaders() {
    this.root.querySelectorAll(this.sel.outerHeader).forEach((header) => {
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');
      header.tabIndex = 0;
    });
  }

  attachOuterEvents() {
    this.root.addEventListener('click', this.onOuterClick);
    this.root.addEventListener('keydown', this.onOuterKeydown);
  }

  onOuterClick(e) {
    const header = e.target.closest(this.sel.outerHeader);
    if (!header || !this.root.contains(header)) return;
    const acc = header.closest(this.sel.outerAcc);
    if (!acc) return;
    this.toggleOuter(acc, header);
  }

  onOuterKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const header = e.target.closest(this.sel.outerHeader);
    if (!header || !this.root.contains(header)) return;
    e.preventDefault();
    const acc = header.closest(this.sel.outerAcc);
    if (!acc) return;
    this.toggleOuter(acc, header);
  }

  toggleOuter(acc, header) {
    const willOpen = !acc.classList.contains('open');
    acc.classList.toggle('open', willOpen);
    header.setAttribute('aria-expanded', String(willOpen));
    // Rotación de flecha: controlada por CSS (p.ej. .accordion.open .arrow { transform: rotate(180deg); })
  }

  /* ---------- INNER ACCORDION (".inner-accordion" / ".acordeon") ---------- */

  // Solo prepara atributos/estado inicial. (Sin listeners por elemento)
  initInnerAccordions() {
    this.root.querySelectorAll(this.sel.innerAcc).forEach((acc) => {
      const header  = acc.querySelector(this.sel.innerHeader);
      const content = acc.querySelector(this.sel.innerContent);
      if (!header || !content) return;

      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');
      header.tabIndex = 0;
      content.hidden = true;
      // Importante: no añadimos listeners aquí. La delegación se hace en el contenedor.
    });
  }

  // Delegación global para TODOS los inner headers (funciona con anidación infinita)
  attachInnerEvents() {
    this.root.addEventListener('click', this.onInnerClick);
    this.root.addEventListener('keydown', this.onInnerKeydown);
  }

  onInnerClick(e) {
    const header = e.target.closest(this.sel.innerHeader);
    if (!header || !this.root.contains(header)) return;

    // Encuentra el acordeón más cercano que contiene este header
    const acc = header.closest(this.sel.innerAcc);
    if (!acc) return;

    // Tomamos SOLO su contenido directo (evita afectar niveles más profundos)
    const content = this._findOwnContent(header, acc);
    if (!content) return;

    this.toggleInner(acc, header, content);
    // Evita que un click en un header hijo burbujee y afecte un padre (si tu CSS/HTML lo requiere)
    // e.stopPropagation();
  }

  onInnerKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    const header = e.target.closest(this.sel.innerHeader);
    if (!header || !this.root.contains(header)) return;
    e.preventDefault();

    const acc = header.closest(this.sel.innerAcc);
    if (!acc) return;

    const content = this._findOwnContent(header, acc);
    if (!content) return;

    this.toggleInner(acc, header, content);
    // e.stopPropagation();
  }

  toggleInner(acc, header, content) {
    const willOpen = !acc.classList.contains('is-open');
    acc.classList.toggle('is-open', willOpen);
    header.setAttribute('aria-expanded', String(willOpen));
    content.hidden = !willOpen;
    // CSS: rota la flecha con .is-open, ej:
    // .inner-accordion.is-open .inner-arrow { transform: rotate(180deg); }
    // .acordeon.is-open .inner-arrow { transform: rotate(180deg); } // soporte legacy
  }

  // Obtiene el contenido "hermano" correcto del header dentro del mismo acc (seguro para anidación)
  _findOwnContent(header, acc) {
    // Caso más común: header y content son hermanos directos
    const direct = header.nextElementSibling;
    if (direct && direct.matches(this.sel.innerContent)) return direct;

    // Fallback: busca SOLO hijos directos del acordeón actual (no profundizar a nietos)
    return acc.querySelector(`:scope > ${this.sel.innerContent}`);
  }

  /* ---------- DATA ---------- */

  fetchOrders() {
    const url = "../../../controller/lanyards4you/order.php";
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
      .then(data => {
        console.log(JSON.stringify(data));
        // this.drawOrdersHTML(data);
      })
      .catch(error => {
        console.error("Error:", error.message);
        alert(error.message);
      });
  }

  /* ---------- RENDER ---------- */

  drawOrdersHTML(response) {
    const main = document.getElementById("main_lanyards4you");
    if (!main) {
      console.error("Element with id 'main_lanyards4you' not found.");
      return;
    }

    main.innerHTML = "";

    if (!response || response.success !== true || !Array.isArray(response.orders)) {
      console.warn("Unexpected response shape for orders:", response);
      return;
    }

    const esc = (s) => String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    const fmtDate = (dt) => dt ? new Date(dt.replace(" ", "T")).toLocaleString() : "";
    const fmtMoney = (n) =>
      (n ?? "") === "" ? "" : Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });

    const chunks = response.orders.map((bundle, idx) => {
      const o = bundle.order || {};
      const jobs = Array.isArray(bundle.jobs) ? bundle.jobs : [];
      const user = bundle.user || {};
      const addresses = Array.isArray(bundle.addresses) ? bundle.addresses : [];

      // ... (tu HTML de secciones tal como lo tienes)

      return `
        <div class="accordion">
          <div class="accordion_header" role="button" aria-expanded="false" tabindex="0">
            Order ${idx + 1} — #${esc(o.idOrder)} • ${esc(o.status)}
            <span class="arrow">&#9660;</span>
          </div>
          <div class="accordion_content" hidden>
            <!-- Aquí van los inner accordions generados -->
          </div>
        </div>
      `;
    });

    main.innerHTML += chunks.join("");

    // Reaplicar atributos a nuevos nodos y NO hace falta re-enlazar eventos (delegación ya está activa)
    this.initOuterHeaders();
    this.initInnerAccordions();
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  const controllerOrdersLanyards4You = new ControllerOrdersLanyards4You('.container_order');
  controllerOrdersLanyards4You.init();
});
