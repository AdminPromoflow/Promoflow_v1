
<?php
$cssTime = filemtime('../../view/login/main/main.css'); // ejemplo: '../Home/5.Video/video.css'
$jsTime = filemtime('../../view/login/main/main.js');   // ejemplo: '../Home/5.Video/video.js'
?>
<link rel="stylesheet" href="../../view/login/main/main.css?v=<?= $cssTime ?>">
  <main class="login_main">
    <div class="login_container">
      <div class="form_section">
        <h2>Log in</h2>
        <p>Please provide your email and password to access the system</p>

        <label> Email
          <input id="email" type="text" placeholder="Example@gmail.com">
        </label>
        <label>Password
          <input id="password" type="password" placeholder="********************************">
        </label>

        <button id="btn_login" type="submit">Access</button>
      </div>
      <div class="logo_section">
        <h3>Your product management interface is ready for you.</h3>
      <div class="logo_seccion_img">
        <a href="../../view/directory/index.php"><img src="../../view/login/header/img/logo.png" alt="Logo"></a>
      </div>
      </div>



    </div>
  </main>

</html>
<script src="../../view/login/main/main.js?v=<?= $jsTime ?>" type="text/javascript"></script>
