
<?php
$cssTime = filemtime('../../view/login/header/header.css'); // ejemplo: '../Home/5.Video/video.css'
$jsTime = filemtime('');   // ejemplo: '../Home/5.Video/video.js'
?>
<link rel="stylesheet" href="../../view/login/header/header.css?v=<?= $cssTime ?>">
  <header class="header_nav">
  <div class="container_header_nav">
    <div class="title_nav">
      <h1>Promoflow</h1>
    </div>
    <div class="logo_nav">
      <img src="../../view/login/img/logo.png" alt="">
    </div>
  </div>
  </header>
</html>
