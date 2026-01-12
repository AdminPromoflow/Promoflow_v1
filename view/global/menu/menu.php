<?php
$cssTime = filemtime('../../view/global/menu/menu.css'); // ejemplo: '../Home/5.Video/video.css'
$jsTime  = filemtime('../../view/global/menu/menu.js');   // ejemplo: '../Home/5.Video/video.js'
?>
<link rel="stylesheet" href="../../view/global/menu/menu.css?v=<?= $cssTime ?>">

<!-- ===== HEADER PRINCIPAL DE LA PÁGINA ===== -->
<header class="header_menu">
  <!-- ===== CONTENEDOR DEL HEADER (usa Flexbox para distribución) ===== -->
  <!-- ===== TÍTULO DEL SITIO (lado izquierdo) ===== -->
  <div class="title_menu">
    <h1>Promoflow</h1> <!-- Nombre de la aplicación o empresa -->
    <div class="logo_img">
      <img src="../../view/global/menu/img/logo.png" alt="">
    </div>
  </div>
  <!-- ===== LOGO DEL SITIO (lado derecho) ===== -->
</header>

<div class="movil_menu">
  <input type="checkbox" id="toggle-menu" hidden>
  <label for="toggle-menu" class="menu_img">
    <img src="../../view/global/menu/img/menu.png" alt="">
  </label>
  <h2>Menu</h2>
  <ul>
    <li><a href="#">User manager</a></li>
    <li><a href="#">W3P</a></li>
    <li><a href="#">Amazon</a></li>
    <li><a href="#">Lanyard</a></li>
    <li><a href="#">Promoflow</a></li>
    <li id="logout"><a>Logout</a></li>
  </ul>
</div>

<!-- load menu.js with cache busting -->
<script src="../../view/global/menu/menu.js?v=<?= $jsTime ?>"></script>
</html>
