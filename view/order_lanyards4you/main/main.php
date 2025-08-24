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

  <!-- Nivel 1 -->
  <div class="inner-accordion">
    <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
      Orders
      <span class="inner-arrow arrow-level-1">&#9660;</span>
    </div>

    <div class="inner-accordion_content" hidden>
      <!-- Nivel 2 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … todos tus inputs del Job … -->
        </div>
      </div>

      <!-- Otro acordeón en nivel 2 -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- … todos tus inputs del Job … -->
        </div>
      </div>

      <!-- Acordeón con subniveles -->
      <div class="inner-accordion">
        <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content" hidden>
          <!-- Nivel 3 -->
          <div class="inner-accordion">
            <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
              Orders
              <span class="inner-arrow arrow-level-3">&#9660;</span>
            </div>
            <div class="inner-accordion_content" hidden>
              <!-- Nivel 4 -->
              <div class="inner-accordion">
                <div class="inner-accordion_header" role="button" aria-expanded="false" tabindex="0">
                  Orders
                  <span class="inner-arrow arrow-level-4">&#9660;</span>
                </div>
                <div class="inner-accordion_content" hidden>
                  <!-- … todos tus inputs del Job … -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<script src="../../view/order_lanyards4you/main/main.js?v=<?= $jsTime ?>" type="text/javascript"></script>
