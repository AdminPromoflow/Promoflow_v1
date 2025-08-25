class ControllerOrdersLanyards4You {
  init() {
    this.getOrders();

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

  // === Ajax estilo requestLogin() ===
  getOrders() {
    const url = "../../controller/lanyards4you/order.php";
    const data = {
      action: "getOrders"
      // agrega aquí más filtros si los necesitas, p. ej. userId, estado, etc.
    };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network error.");
      })
      .then(result => {
        alert(JSON.stringify(result));
      /*  if (result.status === "success" && Array.isArray(result.orders)) {
          this.renderOrders(result.orders);
        } else {
          alert(result.message || "No fue posible cargar los pedidos.");
        }*/
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al solicitar los pedidos.");
      });
  }

  renderOrders(orders) {
    const container = document.querySelector('#ordersContainer');
    if (!container) return;

    // Ejemplo simple: puedes adaptar al HTML real de tu acordeón
    container.innerHTML = orders.map(order => `
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          <span class="order_title">#${order.id} · ${order.name || 'Pedido'}</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <div class="order_body">
            <p><strong>Fecha:</strong> ${order.date || '-'}</p>
            <p><strong>Estado:</strong> ${order.status || '-'}</p>
            <p><strong>Total:</strong> ${order.total || '-'}</p>
          </div>
        </div>
      </div>
    `).join('');
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
