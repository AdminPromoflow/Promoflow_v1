<script>
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion').forEach(acc => {
    const header  = acc.querySelector('.accordion_header');
    if (!header) return;

    // Accesibilidad básica
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.tabIndex = 0;

    const toggle = () => {
      const willOpen = !acc.classList.contains('open');
      acc.classList.toggle('open', willOpen);
      header.setAttribute('aria-expanded', String(willOpen));
    };

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
});
</script>
