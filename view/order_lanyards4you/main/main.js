class ControllerOrdersLanyards4You {
  init() {
    // Estado inicial
    document.querySelectorAll('.inner-accordion_header').forEach(h => {
      h.setAttribute('role', 'button');
      h.setAttribute('aria-expanded', 'false');
      h.tabIndex = 0;
    });
    document.querySelectorAll('.inner-accordion_content').forEach(c => (c.hidden = true));

    // Delegación de eventos (click + teclado)
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

    const content = acc.querySelector('.inner-accordion_content');
    if (!content) return;

    const open = acc.classList.toggle('is-open');
    header.setAttribute('aria-expanded', open);
    content.hidden = !open;
    // CSS: .inner-accordion.is-open .inner-arrow { transform: rotate(180deg); }
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  new ControllerOrdersLanyards4You().init();
});
