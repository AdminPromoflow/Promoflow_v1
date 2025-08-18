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

    // Inicializar todos los headers y contenidos
    this.root.querySelectorAll(this.S.header).forEach(h => {
      h.setAttribute('role', 'button');
      h.setAttribute('aria-expanded', 'false');
      h.tabIndex = 0;
    });
    this.root.querySelectorAll(this.S.content).forEach(c => (c.hidden = true));

    // Delegación: un solo listener para clicks y teclado
    this.root.addEventListener('click', (e) => this.toggle(e.target));
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle(e.target);
      }
    });
  }

  toggle(target) {
    const header = target.closest(this.S.header);
    if (!header || !this.root.contains(header)) return;

    const acc = header.closest(this.S.acc);
    if (!acc) return;

    // Tomar el siguiente hermano inmediato o el hijo directo content
    const content = header.nextElementSibling?.matches(this.S.content)
      ? header.nextElementSibling
      : acc.querySelector(`:scope > ${this.S.content}`);
    if (!content) return;

    const open = !acc.classList.contains('is-open');
    acc.classList.toggle('is-open', open);
    header.setAttribute('aria-expanded', String(open));
    content.hidden = !open;
    // Con CSS puedes rotar la flechita:
    // .inner-accordion.is-open .inner-arrow { transform: rotate(180deg); }
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  new ControllerOrdersLanyards4You().init();
});
