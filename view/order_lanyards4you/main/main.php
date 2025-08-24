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

  <!-- Level 1 -->
  <div class="inner-accordion accordion-level-1">
    <div class="inner-accordion_header header-level-1" role="button" aria-expanded="false" tabindex="0">
      Orders
      <span class="inner-arrow arrow-level-1">&#9660;</span>
    </div>

    <div class="inner-accordion_content content-level-1" hidden>
      <!-- Level 2 -->
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          <!-- … all your Job inputs … -->
        </div>
      </div>

      <!-- Another accordion at Level 2 -->
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>
          <!-- … all your Job inputs … -->
        </div>
      </div>

      <!-- Accordion with deeper levels -->
      <div class="inner-accordion accordion-level-2">
        <div class="inner-accordion_header header-level-2" role="button" aria-expanded="false" tabindex="0">
          Orders
          <span class="inner-arrow arrow-level-2">&#9660;</span>
        </div>
        <div class="inner-accordion_content content-level-2" hidden>

          <!-- Level 3 -->
          <div class="inner-accordion accordion-level-3">
            <div class="inner-accordion_header header-level-3" role="button" aria-expanded="false" tabindex="0">
              Orders
              <span class="inner-arrow arrow-level-3">&#9660;</span>
            </div>
            <div class="inner-accordion_content content-level-3" hidden>

              <!-- Level 4 -->
              <div class="inner-accordion accordion-level-4">
                <div class="inner-accordion_header header-level-4" role="button" aria-expanded="false" tabindex="0">
                  Orders
                  <span class="inner-arrow arrow-level-4">&#9660;</span>
                </div>
                <div class="inner-accordion_content content-level-4" hidden>

                  <!-- Level 5 -->
                  <div class="inner-accordion accordion-level-5">
                    <div class="inner-accordion_header header-level-5" role="button" aria-expanded="false" tabindex="0">
                      Orders
                      <span class="inner-arrow arrow-level-5">&#9660;</span>
                    </div>
                    <div class="inner-accordion_content content-level-5" hidden>

                      <!-- Level 6 -->
                      <div class="inner-accordion accordion-level-6">
                        <div class="inner-accordion_header header-level-6" role="button" aria-expanded="false" tabindex="0">
                          Orders
                          <span class="inner-arrow arrow-level-6">&#9660;</span>
                        </div>
                        <div class="inner-accordion_content content-level-6" hidden>
                          <!-- … all your Job inputs at level 6 … -->
                        </div>
                      </div>
                      <!-- End Level 6 -->

                    </div>
                  </div>
                  <!-- End Level 5 -->

                </div>
              </div>
              <!-- End Level 4 -->

            </div>
          </div>
          <!-- End Level 3 -->

        </div>
      </div>
      <!-- End deeper accordion -->

    </div>
  </div>
  <!-- End Level 1 -->

</section>

<script src="../../view/order_lanyards4you/main/main.js?v=<?= $jsTime ?>" type="text/javascript"></script>



<script src="../../view/order_lanyards4you/main/main.js?v=<?= $jsTime ?>" type="text/javascript"></script>
