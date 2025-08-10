
document.addEventListener('DOMContentLoaded', function () {
  // 1) Container que engloba todos los acordeones
  const container = document.querySelector('.container_order');
  if (!container) return;

  // 2) Inicializa headers (accesible por teclado)
  container.querySelectorAll('.accordion_header').forEach(function (header) {
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.tabIndex = 0;
  });

  // 3) Delegación: click para abrir/cerrar
  container.addEventListener('click', function (e) {
    const header = e.target.closest('.accordion_header');
    if (!header || !container.contains(header)) return;

    const acc = header.closest('.accordion');
    if (!acc) return;

    const willOpen = !acc.classList.contains('open');
    acc.classList.toggle('open', willOpen);
    header.setAttribute('aria-expanded', String(willOpen));
    // No tocamos style.display; tu CSS hace el show/hide y rota la flecha
  });

  // 4) Teclado: Enter/Espacio
/*  container.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const header = e.target.closest('.accordion_header');
    if (!header) return;

    e.preventDefault();
    const acc = header.closest('.accordion');
    if (!acc) return;

    const willOpen = !acc.classList.contains('open');
    acc.classList.toggle('open', willOpen);
    header.setAttribute('aria-expanded', String(willOpen));
  });
  */

  document.querySelectorAll('.inner-accordion').forEach(function (acc) {
     const header  = acc.querySelector('.inner-accordion_header');
     const content = acc.querySelector('.inner-accordion_content');
     if (!header || !content) return;

     // Estado inicial (cerrado)
     header.setAttribute('aria-expanded', 'false');
     content.hidden = true;

     const toggle = () => {
       const willOpen = !acc.classList.contains('is-open');
       acc.classList.toggle('is-open', willOpen);
       header.setAttribute('aria-expanded', String(willOpen));
       content.hidden = !willOpen;
     };

     header.addEventListener('click', toggle);
     header.addEventListener('keydown', function (e) {
       if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         toggle();
       }
     });
   });
});
