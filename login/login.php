
<?php
$cssTime = filemtime('../../login/login.css'); // ejemplo: '../Home/5.Video/video.css'
$jsTime = filemtime('');   // ejemplo: '../Home/5.Video/video.js'
?>
<link rel="stylesheet" href="../../login/login.css?v=<?= $cssTime ?>">
<body class="body_login">
    <header class="header_nav">
      <div class="data_login">

      </div>
      <div class="container_logo_login">

      </div>
    </header>
    <main>

    </main>
  </body>
</html>
