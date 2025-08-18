<?php
/**
 * Resolve asset versions using file modification time (cache busting).
 * Adjust the relative paths if this template moves.
 */
$cssTime = filemtime('../../view/order_lanyards4you/main/main.css');
$jsTime  = filemtime('../../view/order_lanyards4you/main/main.js');
?>
<link rel="stylesheet" href="../../view/order_lanyards4you/main/main.css?v=<?= $cssTime ?>">

<section id="main_lanyards4you" class="container_order">
  <h2>Production Orders</h2>

  <!-- Accordion: Order 1 -->
  <div class="accordion">
    <div class="accordion_header">
      Order 1
      <span class="arrow">&#9660;</span>
    </div>

    <!-- Contenido del acordeón externo -->
    <div class="accordion_content">

      <!-- INNER ACCORDION #1 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … todos tus inputs del Job … -->
        </div>
      </div>

      <!-- INNER ACCORDION #1 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Job
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <div class="form_group"><label for="dueDate">C-DUE DATE</label><input id="dueDate" type="date"></div>
        </div>
      </div>

      <!-- INNER ACCORDION #2 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          User
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <div class="form_group"><label for="dueDate">C-DUE DATE</label><input id="dueDate" type="date"></div>
        </div>
      </div>

      <!-- INNER ACCORDION #3 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Addresses
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <div class="form_group"><label for="dueDate">C-DUE DATE</label><input id="dueDate" type="date"></div>
        </div>
      </div>

    </div><!-- /accordion_content de Order 1 -->
  </div><!-- /accordion de Order 1 -->

  <!-- Accordion: Yesterday -->
  <div class="accordion">
    <div class="accordion_header">
      Order - Yesterday (<?= date('Y-m-d', strtotime('-1 day')) ?>)
      <span class="arrow">&#9660;</span>
    </div>
    <div class="accordion_content">

      <!-- INNER ACCORDION #1 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Job
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … todos tus inputs del Job … -->
        </div>
      </div>

      <!-- INNER ACCORDION #2 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          User
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … inputs de User … -->
        </div>
      </div>

      <!-- INNER ACCORDION #3 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Addresses
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … inputs de Addresses … -->
        </div>
      </div>

    </div>
  </div>

  <!-- Accordion: The day before yesterday -->
  <div class="accordion">
    <div class="accordion_header">
      Order - The day before yesterday (<?= date('Y-m-d', strtotime('-2 days')) ?>)
      <span class="arrow">&#9660;</span>
    </div>
    <div class="accordion_content">

      <!-- INNER ACCORDION #1 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Job
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … todos tus inputs del Job … -->
        </div>
      </div>

      <!-- INNER ACCORDION #2 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          User
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … inputs de User … -->
        </div>
      </div>

      <!-- INNER ACCORDION #3 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Addresses
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … inputs de Addresses … -->
        </div>
      </div>

    </div>
  </div>

</section>

<script src="../../view/order_lanyards4you/main/main.js?v=<?= $jsTime ?>" type="text/javascript"></script>
