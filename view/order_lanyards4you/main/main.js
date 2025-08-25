class ControllerOrdersLanyards4You {
  init() {
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

  toggle(header) {
    const accordion = header.closest('.inner-accordion');
    if (!accordion) return;

    const content = accordion.querySelector(':scope > .inner-accordion_content');
    if (!content) return;

    // Alterna estado abierto/cerrado
    const isOpen = accordion.classList.toggle('is-open');
    header.setAttribute('aria-expanded', String(isOpen));
    content.hidden = !isOpen;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ControllerOrdersLanyards4You().init();
});
