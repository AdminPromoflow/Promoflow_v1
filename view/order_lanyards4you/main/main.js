<script>
(function () {
  // Si quieres "solo uno abierto por orden", cambia a true:
  const SOLO_UNO_POR_ORDEN = false;

  document.querySelectorAll('.order').forEach(orderEl => {
    const accordions = orderEl.querySelectorAll('.accordion');

    accordions.forEach(acc => {
      const header = acc.querySelector('.accordion_header');
      const content = acc.querySelector('.accordion_content');
      if (!header || !content) return;

      // Estado inicial
      header.setAttribute('aria-expanded', 'false');
      content.hidden = true;

      const openThis = () => {
        // Cerrar otros si aplica
        if (SOLO_UNO_POR_ORDEN) {
          orderEl.querySelectorAll('.accordion').forEach(a => {
            if (a !== acc) {
              a.classList.remove('open');
              const h = a.querySelector('.accordion_header');
              const c = a.querySelector('.accordion_content');
              if (h) h.setAttribute('aria-expanded', 'false');
              if (c) c.hidden = true;
            }
          });
        }
        // Toggle actual
        const willOpen = !acc.classList.contains('open');
        acc.classList.toggle('open', willOpen);
        header.setAttribute('aria-expanded', String(willOpen));
        content.hidden = !willOpen;
      };

      header.addEventListener('click', openThis);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openThis();
        }
      });

      // Hacer navegable por teclado
      header.tabIndex = 0;
    });
  });
})();
</script>
