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
    // Show/hide + arrow rotation are handled by CSS
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
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  const controllerOrdersLanyards4You = new ControllerOrdersLanyards4You('.container_order');
  controllerOrdersLanyards4You.init();
});
