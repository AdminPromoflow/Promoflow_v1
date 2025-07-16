
<?php
$cssTime = filemtime('../../view/global/menu/menu.css'); // ejemplo: '../Home/5.Video/video.css'
$jsTime = filemtime('');   // ejemplo: '../Home/5.Video/video.js'
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
  <h2>Memu</h2>
  <div class="menu_img">
    <img src="../../view/global/menu/img/menu.png" alt="">
  </div>
  <!-- Ruta relativa al logo. La imagen debe estar en: /view/login/header/img/logo.png -->
  <ul>
    <li> <a href="#"></a>User manager</li>
    <li> <a href="#"></a>W3P</li>
    <li> <a href="#"></a>Amazon</li>
    <li> <a href="#"></a>Lanyard</li>
    <li> <a href="#"></a>Promoflow</li>
    <li> <a href="#"></a>Logout</li>
  </ul>
</div>
</html>
