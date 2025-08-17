
<?php
$cssTime = filemtime('../../../view/login_W3P/header/header.css'); // ejemplo: '../Home/5.Video/video.css'
$jsTime = filemtime('');   // ejemplo: '../Home/5.Video/video.js'
?>
<link rel="stylesheet" href="../../../view_W3P/login/header/header.css?v=<?= $cssTime ?>">
<!-- ===== HEADER PRINCIPAL DE LA PÁGINA ===== -->
<header class="header_nav">

  <!-- ===== CONTENEDOR DEL HEADER (usa Flexbox para distribución) ===== -->

    <!-- ===== TÍTULO DEL SITIO (lado izquierdo) ===== -->
    <div class="title_nav">
      <h1>Promoflow test</h1> <!-- Nombre de la aplicación o empresa -->
    </div>

    <!-- ===== LOGO DEL SITIO (lado derecho) ===== -->
    <div class="logo_nav">
      <!-- Ruta relativa al logo. La imagen debe estar en: /view/login/header/img/logo.png -->
      <img src="../../../view/login_W3P/header/img/logo.png" alt="">
    </div>


</header>

</html>
