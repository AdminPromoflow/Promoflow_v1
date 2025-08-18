class ControllerOrdersLanyards4You {
  init() {
    // Estado inicial
    document.querySelectorAll('.inner-accordion_header').forEach(h => {
      h.setAttribute('role', 'button');
      h.setAttribute('aria-expanded', 'false');
      h.tabIndex = 0;
    });
    document.querySelectorAll('.inner-accordion_content').forEach(c => (c.hidden = true));

    // Delegación
    document.addEventListener('click', e => this.toggle(e));
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle(e);
      }
    });
  }

  toggle(e) {
    const header = e.target.closest('.inner-accordion_header');
    if (!header) return;

    const acc = header.closest('.inner-accordion');
    if (!acc) return;

    // 🔧 Buscar el contenido correcto: primero hermano(s) del header
    let content = header.nextElementSibling;
    while (content && !content.classList?.contains('inner-accordion_content')) {
      content = content.nextElementSibling;
    }
    // Fallback: primer hijo directo del acordeón que sea content
    if (!content) {
      for (const child of acc.children) {
        if (child.classList?.contains('inner-accordion_content')) { content = child; break; }
      }
    }
    if (!content) return;

    const open = acc.classList.toggle('is-open');
    header.setAttribute('aria-expanded', open);
    content.hidden = !open;
    // La flecha gira con CSS:
    // .inner-accordion.is-open > .inner-accordion_header > .inner-arrow { transform: rotate(180deg); }
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  new ControllerOrdersLanyards4You().init();
});
