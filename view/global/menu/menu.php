<?php
$cssFile = __DIR__ . '/../../view/global/menu/menu.css';
$jsFile  = __DIR__ . '/../../view/global/menu/menu.js';

$cssTime = file_exists($cssFile) ? filemtime($cssFile) : time();
$jsTime  = file_exists($jsFile)  ? filemtime($jsFile)  : time();
?>

<link rel="stylesheet" href="../../view/global/menu/menu.css?v=<?= $cssTime ?>">

<!-- ===== HEADER PRINCIPAL DE LA PÁGINA ===== -->
<header class="header_menu">
  <div class="title_menu">
    <h1>Promoflow</h1>
    <div class="logo_img">
      <a href="../../view/overview/index.php"><img src="../../view/global/menu/img/logo.png" alt="Promoflow logo" loading="lazy" decoding="async"></a>

    </div>
  </div>
</header>

<!-- ===== MENÚ MÓVIL ===== -->
<nav class="movil_menu" aria-label="Main menu">
  <input type="checkbox" id="toggle-menu" hidden>

  <label for="toggle-menu" class="menu_img" aria-label="Open menu">
    <img src="../../view/global/menu/img/menu.png" alt="Menu icon" loading="lazy" decoding="async">
  </label>

  <h2>Menu</h2>

  <ul>
    <li><a href="../../view/user_manager/index.php">User manager</a></li>
    <li id="logout"><a href="#" role="button">Logout</a></li>
  </ul>
</nav>

<!-- load menu.js with cache busting -->
<script src="../../view/global/menu/menu.js?v=<?= $jsTime ?>" defer></script>
