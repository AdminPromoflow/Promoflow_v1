document.querySelectorAll(".accordion_header").forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
    });
  });
    const headers = document.querySelectorAll('.accordion_header');

    headers.forEach(header => {
      header.addEventListener('click', () => {
        const accordion = header.parentElement;
        accordion.classList.toggle('open');
      });
    });
