<?php
/**
 * Resolve asset versions using file modification time (cache busting).
 * Adjust the relative paths if this template moves.
 */
$cssTime = filemtime('../../view/order_lanyards4you/main/main.css');
$jsTime  = filemtime('../../view/order_lanyards4you/main/main.js');
?>
<link rel="stylesheet" href="../../view/order_lanyards4you/main/main.css?v=<?= $cssTime ?>">

<!--
  Orders container
  Purpose: host multiple accordion groups representing orders by date.
  Note: Keep markup lean; behaviour is handled by main.js.
-->
<section class="container_order">

  <!-- Section heading -->
  <h2>Production Orders</h2>

  <!--
    Accordion: Today’s order
    Rationale: the header toggles visibility of its associated content.
  -->
  <div class="accordion">
    <div class="accordion_header">
      <!-- Dynamic date (today) -->
      Order 1
      <!-- Visual caret -->
      <span class="arrow">&#9660;</span>
    </div>

    <!-- Collapsible content for 'Today' root accordion -->
    <div class="accordion_content">

      <!--
        Nested accordion #1 within 'Today'
        Use nested accordions to compartmentalise large forms.
      -->
      <div class="accordion">
        <div class="accordion_header">
          Job
          <span class="arrow">&#9660;</span>
        </div>

        <div class="accordion_content">
          <!-- Order detail form: full set -->
          <div class="form_group"><label for="dataNo">Data No*</label><input id="dataNo" type="text"></div>
          <div class="form_group"><label for="customer">Customer</label><input id="customer" type="text"></div>
          <div class="form_group"><label for="printRef">Print Ref*</label><input id="printRef" type="text"></div>
          <div class="form_group"><label for="project">Project</label><input id="project" type="text"></div>
          <div class="form_group"><label for="qty">Qty*</label><input id="qty" type="number"></div>
          <div class="form_group"><label for="supplier">Supplier</label><input id="supplier" type="text"></div>
          <div class="form_group"><label for="orderDate">C_Order Date</label><input id="orderDate" type="date"></div>
          <div class="form_group"><label for="poSent">PO Sent</label><input id="poSent" type="text"></div>
          <div class="form_group"><label for="approvalSent">Approval Sent</label><input id="approvalSent" type="text"></div>
          <div class="form_group"><label for="despatchDate">Despatch Date</label><input id="despatchDate" type="date"></div>
          <div class="form_group"><label for="dueDate">C-DUE DATE</label><input id="dueDate" type="date"></div>
          <div class="form_group"><label for="artworkPreApproved">Artwork Pre Approved?</label><input id="artworkPreApproved" type="text"></div>
          <div class="form_group"><label for="artwork">C- Artwork</label><input id="artwork" type="text"></div>
          <div class="form_group"><label for="artworkVisual">C-Artwork Visual</label><input id="artworkVisual" type="text"></div>
          <div class="form_group"><label for="approvedPdf">C-Approved PDF</label><input id="approvedPdf" type="text"></div>
          <div class="form_group"><label for="approvedVisual">C-Approved Visual</label><input id="approvedVisual" type="text"></div>
          <div class="form_group"><label for="boxNo">Box No</label><input id="boxNo" type="text"></div>
          <div class="form_group"><label for="actualDespatchDate">Act-Despatch Date</label><input id="actualDespatchDate" type="date"></div>
          <div class="form_group"><label for="trackingNo">UK-Tracking No</label><input id="trackingNo" type="text"></div>
          <div class="form_group"><label for="deliveredDate">Delivered Date</label><input id="deliveredDate" type="date"></div>
          <div class="form_group"><label for="nettSale">Nett Sale*</label><input id="nettSale" type="number"></div>
          <div class="form_group"><label for="customerReference1">Customer Reference 1*</label><input id="customerReference1" type="text"></div>
          <div class="form_group"><label for="sRef">S-Ref</label><input id="sRef" type="text"></div>
          <div class="form_group"><label for="sEmail">S-Email</label><input id="sEmail" type="email"></div>
          <div class="form_group"><label for="item">Item</label><input id="item" type="text"></div>
          <div class="form_group"><label for="size">Size</label><input id="size" type="text"></div>
          <div class="form_group"><label for="material">Material</label><input id="material" type="text"></div>
          <div class="form_group"><label for="weightOrCapacity">Weight/Thickness/Capacity</label><input id="weightOrCapacity" type="text"></div>
          <div class="form_group"><label for="print">Print</label><input id="print" type="text"></div>
          <div class="form_group"><label for="coverage">Coverage</label><input id="coverage" type="text"></div>
          <div class="form_group"><label for="printStyle">Print Style</label><input id="printStyle" type="text"></div>
          <div class="form_group"><label for="finish1">Finish 1</label><input id="finish1" type="text"></div>
          <div class="form_group"><label for="finish2">Finish 2</label><input id="finish2" type="text"></div>
          <div class="form_group"><label for="finish3">Finish 3</label><input id="finish3" type="text"></div>
          <div class="form_group"><label for="serviceLevel">Service Level</label><input id="serviceLevel" type="text"></div>
          <div class="form_group"><label for="status">Status*</label><input id="status" type="text"></div>
          <div class="form_group"><label for="notes">Notes</label><input id="notes" type="text"></div>
          <div class="form_group"><label for="note">Note</label><input id="note" type="text"></div>
          <div class="form_group"><label for="companyName">Company Name</label><input id="companyName" type="text"></div>
          <div class="form_group"><label for="attn">Attn</label><input id="attn" type="text"></div>
          <div class="form_group"><label for="tel">Tel</label><input id="tel" type="tel"></div>
          <div class="form_group"><label for="email">Email</label><input id="email" type="email"></div>
          <div class="form_group"><label for="deliveryAddress">Delivery Address</label><input id="deliveryAddress" type="text"></div>
          <div class="form_group"><label for="trackLink">UK-Track link</label><input id="trackLink" type="text"></div>
          <div class="form_group"><label for="deliveryImage">Delivery Image</label><input id="deliveryImage" type="text"></div>
          <div class="form_group"><label for="productImage">Product Image</label><input id="productImage" type="text"></div>
          <div class="form_group"><label for="notSure">Not Sure</label><input id="notSure" type="text"></div>
          <div class="form_group"><label for="poReceived">PO Received</label><input id="poReceived" type="text"></div>
        </div>
      </div>

      <!-- Nested accordion #2 within 'Today' (shorter subset) -->
      <div class="accordion">
        <div class="accordion_header">
          User
          <span class="arrow">&#9660;</span>
        </div>

        <div class="accordion_content">
          <div class="form_group"><label for="dataNo">Data No*</label><input id="dataNo" type="text"></div>
          <div class="form_group"><label for="customer">Customer</label><input id="customer" type="text"></div>
          <div class="form_group"><label for="printRef">Print Ref*</label><input id="printRef" type="text"></div>
          <div class="form_group"><label for="project">Project</label><input id="project" type="text"></div>
          <div class="form_group"><label for="qty">Qty*</label><input id="qty" type="number"></div>
          <div class="form_group"><label for="supplier">Supplier</label><input id="supplier" type="text"></div>
        </div>
      </div>

      <!-- Nested accordion #3 within 'Today' (shorter subset) -->
      <div class="accordion">
        <div class="accordion_header">
          Addresses
          <span class="arrow">&#9660;</span>
        </div>

        <div class="accordion_content">
          <div class="form_group"><label for="dataNo">Data No*</label><input id="dataNo" type="text"></div>
          <div class="form_group"><label for="customer">Customer</label><input id="customer" type="text"></div>
          <div class="form_group"><label for="printRef">Print Ref*</label><input id="printRef" type="text"></div>
          <div class="form_group"><label for="project">Project</label><input id="project" type="text"></div>
          <div class="form_group"><label for="qty">Qty*</label><input id="qty" type="number"></div>
          <div class="form_group"><label for="supplier">Supplier</label><input id="supplier" type="text"></div>
        </div>
      </div>

    </div>
  </div>

  <!-- Accordion: Yesterday -->
  <div class="accordion">
    <div class="accordion_header">
      Order - Yesterday (<?= date('Y-m-d', strtotime('-1 day')) ?>)
      <span class="arrow">&#9660;</span>
    </div>
    <div class="accordion_content">
      <p>[Replicate the same inputs here as needed]</p>
    </div>
  </div>

  <!-- Accordion: The day before yesterday -->
  <div class="accordion">
    <div class="accordion_header">
      Order - The day before yesterday (<?= date('Y-m-d', strtotime('-2 days')) ?>)
      <span class="arrow">&#9660;</span>
    </div>
    <div class="accordion_content">
      <p>[Replicate the same inputs here as needed]</p>
    </div>
  </div>

</section>

<script src="../../view/order_lanyards4you/main/main.js?v=<?= $jsTime ?>" type="text/javascript"></script>
