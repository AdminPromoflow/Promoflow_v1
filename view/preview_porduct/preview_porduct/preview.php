<?php
// -----------------------------------------------------------------------------
// Product Preview — Asset Versioning + Markup
// -----------------------------------------------------------------------------

$cssPath = '../../view/preview_porduct/preview_porduct/preview.css';
$jsPath = '../../view/preview_porduct/preview_porduct/preview.js';
$jsPath2 = '../../view/preview_porduct/preview_porduct/preview_logic.js';

$artworkPath = '../../view/preview_porduct/artwork/artwork.js';
$imagesPath = '../../view/preview_porduct/images/images.js';
$itemsPath = '../../view/preview_porduct/items/items.js';
$pricesPath = '../../view/preview_porduct/prices/prices.js';
$variationsPath = '../../view/preview_porduct/variations/variations.js';

$cssTime = @filemtime($cssPath) ?: time();
$jsTime = @filemtime($jsPath) ?: time();
$jsTime2 = @filemtime($jsPath2) ?: time();

$artworkTime = @filemtime($artworkPath) ?: time();
$imagesTime = @filemtime($imagesPath) ?: time();
$itemsTime = @filemtime($itemsPath) ?: time();
$pricesTime = @filemtime($pricesPath) ?: time();
$variationsTime = @filemtime($variationsPath) ?: time();
?>

<link rel="stylesheet" href="<?= $cssPath ?>?v=<?= $cssTime ?>">

<main class="sp-amz" aria-labelledby="sp-title">
  <div class="sp-shell">

    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="sp-breadcrumbs js-fade-up">
      <ol id="sp_breadcrumbs" class="crumbs">
        <li><a href="#">Office &amp; Stationery</a></li>
        <li><a href="#">Lanyards</a></li>
      </ol>
    </nav>

    <!-- GRID PRINCIPAL -->
    <section class="sp-grid">

      <!-- ===============================================================
        Col 1: Galería
      =============================================================== -->
      <aside class="sp-col sp-gallery" aria-label="Product media">
        <div class="sp-gallery-inner">

          <div class="sp-main-wrapper js-parallax">

            <button type="button" class="sp-nav sp-nav-prev" aria-label="Previous media" onclick="previewGallery.prevImage()">
              ‹
            </button>

            <div class="sp-main wrap-images-group" id="wrap-images-group" aria-live="polite"></div>

            <button type="button" class="sp-nav sp-nav-next" aria-label="Next media" onclick="previewGallery.nextImage()">
              ›
            </button>

          </div>

          <div class="sp-thumbs" id="sp_thumbs" role="list"></div>

          <small class="cp-hint">Hover to zoom • Media changes every 5 seconds</small>

        </div>
      </aside>

      <!-- ===============================================================
        Col 2: Detalles del producto
      =============================================================== -->
      <section class="sp-col sp-details js-fade-up">

        <span id="sp_category" class="sp-category">
          Lanyards &amp; ID Accessories
        </span>

        <h1 id="sp-title" class="sp-title js-fade-up">
          Custom Printed Lanyards – 10mm to 35mm – Full Colour Logo – Breakaway Safety &amp; ID Badge Holders
        </h1>

        <div class="sp-meta js-fade-up">
          <span id="sp-brand" class="brand-link">Promoflow</span>
        </div>

        <p id="sp_subtitle" class="sp-subtitle js-fade-up">
          Choose the width, pack size and clip type that match your event, office or school, then upload your artwork for full colour printing.
        </p>

        <div class="sp-price-main js-fade-up">
          <span class="sp-price-symbol" id="sp_currency_symbol">£</span>

          <span id="sp_price" class="sp-price">
            0<span class="sp-price-minor">.00</span>
          </span>

          <span id="sp_unit_hint" class="sp-unit-hint">
            per 100 units
          </span>
        </div>

        <!-- ===============================================================
          ITEMS NOTE
        =============================================================== -->
        <section class="sp-items-note js-fade-up" id="sp-items-note" aria-label="Items information">

          <div class="sp-items-list wrap-items-group" id="wrap-items-group">

            <div class="wrap-items">
              <div class="sp-item">
                <strong class="sp-item-subtitle">What is one item?</strong>

                <span>
                  Each item refers to a single printed lanyard produced with your selected width, pack size and clip type.
                </span>
              </div>

              <div class="sp-item">
                <strong class="sp-item-subtitle">How do pack sizes work?</strong>

                <span>
                  Pack quantities indicate the total number of individual lanyards supplied in your order, ready to hand out to staff, visitors or guests.
                </span>
              </div>
            </div>

            <div class="wrap-items">
              <div class="sp-item">
                <strong class="sp-item-subtitle">
                  Consistent branding every time
                </strong>

                <span>
                  Your artwork, colours and logos are checked before production so each lanyard looks clean, sharp and on-brand.
                </span>
              </div>
            </div>

          </div>
        </section>

        <!-- VARIATIONS -->
        <section class="sp-variations js-fade-up wrap-variations-group" aria-label="Product configuration"></section>

      </section>

      <!-- ===============================================================
        VARIATIONS BOTTOM
      =============================================================== -->
      <section id="wrap-variations-group" class="sp-variations-bottom js-fade-up" aria-label="More configuration options"></section>

      <!-- ===============================================================
        PACK SIZE
      =============================================================== -->
      <section class="sp-packsize js-fade-up" id="sp-packsize" aria-label="Pack sizes and bundle pricing">

        <div class="var-group var-group-pack" aria-labelledby="var_label_items">

          <div class="var-label">
            <span class="var-name">Pack size</span>
            <strong id="var_label_quantity">500 units</strong>
          </div>

          <div class="var-options wrap-prices-group" id="wrap-prices-group">

            <div class="wrap-price">
              <button type="button" class="var-option js-scale-in">
                <span class="opt-main">50</span>
              </button>

              <button type="button" class="var-option js-scale-in">
                <span class="opt-main">100</span>
              </button>
            </div>

            <div class="wrap-price">
              <button type="button" class="var-option js-scale-in">
                <span class="opt-main">200</span>
              </button>

              <button type="button" class="var-option is-selected js-scale-in">
                <span class="opt-main">500</span>
              </button>

              <button type="button" class="var-option js-scale-in">
                <span class="opt-main">1,000</span>
              </button>

              <button type="button" class="var-option js-scale-in">
                <span class="opt-main">2,000</span>
              </button>
            </div>

            <div class="wrap-price">
              <button type="button" class="var-option js-scale-in">
                <span class="opt-main">3,000</span>
              </button>

              <button type="button" class="var-option js-scale-in">
                <span class="opt-main">5,000</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- ===============================================================
        ARTWORK DOWNLOADS
      =============================================================== -->
      <section class="sp-artwork-downloads js-fade-up" aria-label="Artwork templates">

        <h2 class="sp-artwork-heading">
          Download artwork templates (PDF)
        </h2>

        <div class="sp-artwork-grid wrap-artworks-group" id="wrap-artworks-group">

          <div class="wrap-artworks">
            <a href="/templates/lanyard-10mm.pdf" class="btn btn-artwork" download>
              10&nbsp;mm template
            </a>

            <a href="/templates/lanyard-15mm.pdf" class="btn btn-artwork" download>
              15&nbsp;mm template
            </a>
          </div>

          <div class="wrap-artworks">
            <a href="/templates/lanyard-20mm.pdf" class="btn btn-artwork" download>
              20&nbsp;mm template
            </a>

            <a href="/templates/lanyard-25mm.pdf" class="btn btn-artwork" download>
              25&nbsp;mm template
            </a>

            <a href="/templates/lanyard-30mm.pdf" class="btn btn-artwork" download>
              30&nbsp;mm template
            </a>

            <a href="/templates/lanyard-35mm.pdf" class="btn btn-artwork" download>
              35&nbsp;mm template
            </a>
          </div>

        </div>

        <p class="sp-artwork-note">
          If you do not have a designer, you can still place your order and request help with artwork during checkout.
        </p>
      </section>

      <!-- ===============================================================
        Col 3: Buy box
      =============================================================== -->
      <aside class="sp-col sp-buybox" aria-label="Purchase options">

        <div class="box js-fade-up js-scale-in js-parallax">

          <div class="price-group">

            <div class="price-row price-row--head">
              <span class="label">Unit</span>
              <strong id="bb_unit">£0.08</strong>
            </div>

            <div class="price-subrow">
              <span>Quantity</span>
              <strong id="bb_unit_quantity">100</strong>
            </div>

            <div class="price-subrow">
              <span>Total</span>
              <strong id="bb_unit_total">£8.00</strong>
            </div>

          </div>

          <div class="price-group">

            <div class="price-row price-row--head">
              <span class="label">Extras</span>
              <strong id="bb_extra_unit">£0.24</strong>
            </div>

            <div class="price-subrow">
              <span>Quantity</span>
              <strong id="bb_extra_quantity">100</strong>
            </div>

            <div class="price-subrow">
              <span>Total</span>
              <strong id="bb_extra_total">£24.00</strong>
            </div>

          </div>

          <div class="price-line price-line--total">
            <span class="label">Total</span>
            <strong id="bb_total">£32.00</strong>
          </div>

          <div class="ship">
            <span>Delivery</span>

            <small>
              Delivery only in England. Standard dispatch in 2–3 weeks.
            </small>
          </div>

          <div class="stock in">In stock</div>

          <button type="button" class="btn btn-primary btn-buy js-scale-in" id="bb_add">
            Add to basket
          </button>

          <button type="button" class="btn btn-ghost btn-buy js-scale-in" id="bb_buy" disabled>
            Buy now
          </button>

        </div>
      </aside>

    </section>

    <!-- ===============================================================
      PRODUCT DESCRIPTION
    =============================================================== -->
    <section class="sp-about js-fade-up">
      <h2>Product Description</h2>
      <div id="sp_desc" class="sp-desc"></div>
    </section>

    <!-- ===============================================================
      RELATED PRODUCTS
    =============================================================== -->
    <section class="sp-related js-fade-up">
      <h2>More products you might like</h2>
      <div class="related-grid"></div>
    </section>

  </div>

  <!-- ===============================================================
    ACTIONS
  =============================================================== -->
  <div class="sp-actions">
    <button type="button" class="btn btn-back-preview" id="btn_back_edit">
      Back to Dashboard
    </button>

    <button type="button" class="btn btn-back-preview" id="btn_msn_supplier">
      Message Supplier
    </button>

    <button type="button" class="btn btn-publish-preview" id="btn_publish">
      Publish
    </button>
  </div>
</main>

<!-- Gallery -->
<script src="<?= $jsPath ?>?v=<?= $jsTime ?>"></script>

<!-- Product resource modules -->
<script src="<?= $imagesPath ?>?v=<?= $imagesTime ?>"></script>
<script src="<?= $artworkPath ?>?v=<?= $artworkTime ?>"></script>
<script src="<?= $itemsPath ?>?v=<?= $itemsTime ?>"></script>
<script src="<?= $pricesPath ?>?v=<?= $pricesTime ?>"></script>

<!-- Variations must load before PreviewLogic -->
<script src="<?= $variationsPath ?>?v=<?= $variationsTime ?>"></script>

<!-- Main coordinator -->
<script src="<?= $jsPath2 ?>?v=<?= $jsTime2 ?>"></script>
