class ControllerOrdersLanyards4You {
  init() {
    document.querySelectorAll('.inner-accordion_header').forEach(header => {
      header.addEventListener('click', () => this.toggle(header));
    });
  }

  toggle(header) {
    const acc = header.closest('.inner-accordion');
    const content = acc.querySelector('.inner-accordion_content');
    const arrow = header.querySelector('.inner-arrow'); // 👈 capturamos la flechita

    const open = acc.classList.toggle('is-open');
    header.setAttribute('aria-expanded', open);
    content.hidden = !open;

    // Gira la flecha desde JS
    arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ControllerOrdersLanyards4You().init();
});
