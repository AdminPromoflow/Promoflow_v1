<section class="orders">

  <!-- Orden 1 -->
  <article class="order" data-order-id="61">
    <h2>Production Order #61 <small>(2025-08-09)</small></h2>

    <!-- Acordeón: Datos generales -->
    <div class="accordion">
      <button class="accordion_header" type="button" aria-expanded="false">
        General
        <span class="arrow">▾</span>
      </button>
      <div class="accordion_content" hidden>
        <div class="form_group">
          <label for="dataNo_61">Data No*</label>
          <input id="dataNo_61" type="text">
        </div>
        <div class="form_group">
          <label for="customer_61">Customer</label>
          <input id="customer_61" type="text">
        </div>
        <!-- ... más inputs que necesites ... -->
      </div>
    </div>

    <!-- Acordeón: Fechas -->
    <div class="accordion">
      <button class="accordion_header" type="button" aria-expanded="false">
        Dates
        <span class="arrow">▾</span>
      </button>
      <div class="accordion_content" hidden>
        <div class="form_group">
          <label for="orderDate_61">C_Order Date</label>
          <input id="orderDate_61" type="date">
        </div>
        <div class="form_group">
          <label for="despatchDate_61">Despatch Date</label>
          <input id="despatchDate_61" type="date">
        </div>
        <!-- ... -->
      </div>
    </div>

    <!-- Acordeón: Envío -->
    <div class="accordion">
      <button class="accordion_header" type="button" aria-expanded="false">
        Shipping
        <span class="arrow">▾</span>
      </button>
      <div class="accordion_content" hidden>
        <div class="form_group">
          <label for="deliveryAddress_61">Delivery Address</label>
          <input id="deliveryAddress_61" type="text">
        </div>
        <div class="form_group">
          <label for="trackLink_61">UK-Track link</label>
          <input id="trackLink_61" type="text">
        </div>
      </div>
    </div>
  </article>

  <!-- Orden 2 (otro ejemplo) -->
  <article class="order" data-order-id="62">
    <h2>Production Order #62 <small>(2025-08-08)</small></h2>

    <div class="accordion">
      <button class="accordion_header" type="button" aria-expanded="false">
        General
        <span class="arrow">▾</span>
      </button>
      <div class="accordion_content" hidden>
        <p>Contenido de ejemplo…</p>
      </div>
    </div>

    <div class="accordion">
      <button class="accordion_header" type="button" aria-expanded="false">
        Notes
        <span class="arrow">▾</span>
      </button>
      <div class="accordion_content" hidden>
        <div class="form_group">
          <label for="notes_62">Notes</label>
          <input id="notes_62" type="text">
        </div>
      </div>
    </div>
  </article>

</section>
