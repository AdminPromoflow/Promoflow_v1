class ControllerOrdersLanyards4You {
  constructor(root = '.container_order') {
    this.root = document.querySelector(root);
    this.S = {
      acc: '.inner-accordion',
      header: '.inner-accordion_header',
      content: '.inner-accordion_content',
    };
  }

  init() {
    if (!this.root) return;

    // Estado inicial (ARIA + oculto)
    this.root.querySelectorAll(this.S.header).forEach(h => {
      h.setAttribute('role', 'button');
      h.setAttribute('aria-expanded', 'false');
      h.tabIndex = 0;
    });
    this.root.querySelectorAll(this.S.content).forEach(c => (c.hidden = true));

    // Delegación: un solo manejador para clicks y teclado, sirve para anidación y contenido dinámico
    this.root.addEventListener('click', (e) => this._maybeToggle(e.target));
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._maybeToggle(e.target);
      }
    });
  }

  _maybeToggle(target) {
    const header = target.closest(this.S.header);
    if (!header || !this.root.contains(header)) return;

    const acc = header.closest(this.S.acc);
    if (!acc) return;

    const content = this._findContentForHeader(acc, header);
    if (!content) return;

    const open = !acc.classList.contains('is-open');
    acc.classList.toggle('is-open', open);
    header.setAttribute('aria-expanded', String(open));
    content.hidden = !open;
    // CSS: .inner-accordion.is-open .inner-arrow { transform: rotate(180deg); }
  }

  // Busca el panel correspondiente al header:
  // 1) recorre hermanos siguientes hasta encontrar el content
  // 2) si no lo halla, busca entre los hijos directos del acordeón
  _findContentForHeader(acc, header) {
    // 1) Hermanos siguientes del header
    let sib = header.nextElementSibling;
    while (sib && !sib.matches(this.S.content)) {
      sib = sib.nextElementSibling;
    }
    if (sib) return sib;

    // 2) Primer hijo directo del acordeón que sea content
    for (const child of acc.children) {
      if (child.matches && child.matches(this.S.content)) return child;
    }
    return null;
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  new ControllerOrdersLanyards4You().init();
});
