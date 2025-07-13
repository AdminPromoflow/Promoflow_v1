
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
    </div>

    <!-- ===== LOGO DEL SITIO (lado derecho) ===== -->
    <div class="logo_menu">
      <!-- Ruta relativa al logo. La imagen debe estar en: /view/login/header/img/logo.png -->
      <input class="header_checkbox" type="checkbox" id="open_menu">
      <label for="open_menu" class="header_open_nav_buttom" role="button">☰</label>
      <label for="open_menu" class="header_close_nav_buttom" role="button">X</label>
    </div>


</header>

</html>
