<link rel="stylesheet" href="../../view/global/section_sidebar_navigation/section_sidebar_navigation.css?v=<?= file_exists('../../view/global/section_sidebar_navigation/section_sidebar_navigation.css') ? filemtime('../../view/global/section_sidebar_navigation/section_sidebar_navigation.css') : time() ?>">
<div id="sidebar-open" class="sidebar-open">
  <img
    src="../../view/global/section_sidebar_navigation/img/menu.png?v=<?= file_exists('../../view/global/section_sidebar_navigation/img/menu.png') ? filemtime('../../view/global/section_sidebar_navigation/img/menu.png') : time() ?>"
    alt="Close">
</div>
<!-- Sidebar (estructura base) -->
<section class="section-sidebar-navigation">
  <!-- Close (arriba derecha) -->
  <div id="sidebar-close" class="sidebar-close">
    <img
      src="../../view/global/section_sidebar_navigation/img/close_icon.png?v=<?= file_exists('../../view/global/section_sidebar_navigation/img/close_icon.png') ? filemtime('../../view/global/section_sidebar_navigation/img/close_icon.png') : time() ?>"
      alt="Close">
  </div>

  <!-- Brand -->
  <div class="sidebar-header">
    <img class="sidebar-brand-icon"  src="../../view/global/section_sidebar_navigation/img/logo_promoflow.png?v=<?= file_exists('../../view/global/section_sidebar_navigation/img/logo_promoflow.png') ? filemtime('../../view/global/section_sidebar_navigation/img/logo_promoflow.png') : time() ?>"alt="Promoflow logo">

    <div class="sidebar-title">
      <h3>Promoflow</h3>
      <h4>Operations</h4>
    </div>
  </div>

  <!-- Menu -->
  <div class="sidebar-left-menu">
    <div class="sidebar-left-menu-item is-active">
      <h3>Overview</h3>
    </div>

    <div class="sidebar-left-menu-item has-sub is-open">
      <h3>Messages</h3>

      <div class="sidebar-right">
        <span class="sidebar-count">2</span>
        <span class="sidebar-chev">▾</span>
      </div>
    </div>

    <div class="sidebar-left-menu-item has-sub">
      <h3>Approbals</h3>

      <div class="sidebar-right">
        <span class="sidebar-count">7</span>
        <span class="sidebar-chev">▾</span>
      </div>
    </div>

    <div class="sidebar-left-menu-item has-sub is-open">
      <h3>Orders</h3>

      <div class="sidebar-right">
        <span class="sidebar-count">5</span>
        <span class="sidebar-chev">▴</span>
      </div>
    </div>

    <!-- Subcontainer ejemplo (para Orders) -->
    <div class="sidebar-left-subcontainer is-open">
      <div class="subitem"><h4>Overview</h4></div>
      <div class="subitem"><h4>.63</h4></div>
      <div class="subitem"><h4>W3P</h4></div>
      <div class="subitem"><h4>Amazon</h4></div>
      <div class="subitem"><h4>eBay</h4></div>
    </div>
  </div>
</section>

<script src="../../view/global/section_sidebar_navigation/section_sidebar_navigation.js?v=<?= file_exists('../../view/global/section_sidebar_navigation/section_sidebar_navigation.js') ? filemtime('../../view/global/section_sidebar_navigation/section_sidebar_navigation.js') : time() ?>" defer></script>
