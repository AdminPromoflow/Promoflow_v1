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


  <div class="inner-accordion">
    <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
      Orders
      <span class="inner-arrow">&#9660;</span>
    </div>
    <div class="inner-accordion_content" hidden>
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … todos tus inputs del Job … -->
        </div>
      </div>

      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … todos tus inputs del Job … -->
        </div>
      </div>

      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … todos tus inputs del Job … -->
        </div>
      </div>
    </div>
  </div>

</section>

<script src="../../view/order_lanyards4you/main/main.js?v=<?= $jsTime ?>" type="text/javascript"></script>
