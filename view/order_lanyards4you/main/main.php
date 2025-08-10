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
