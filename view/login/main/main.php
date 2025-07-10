
<?php
$cssTime = filemtime('../../view/login/main/main.css'); // ejemplo: '../Home/5.Video/video.css'
$jsTime = filemtime('');   // ejemplo: '../Home/5.Video/video.js'
?>
<link rel="stylesheet" href="../../view/login/main/main.css?v=<?= $cssTime ?>">
<body >

    <main>
      <div class="container_login">

      </div>
    </main>
  </body>
</html>
