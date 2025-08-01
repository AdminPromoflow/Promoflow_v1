
<?php
$cssTime = filemtime('../../view/directory/directory/directory.css'); // ejemplo: '../Home/5.Video/video.css'
$jsTime = filemtime('');   // ejemplo: '../Home/5.Video/video.js'
?>
<link rel="stylesheet" href="../../view/directory/directory/directory.css?v=<?= $cssTime ?>">

  <section class="container_directory">
    <div class="directory_header">
      <div class="directory_logo">
        <img src="../../view/directory/directory/img/logo.png" alt="Logo">
      </div>
      <h1>DASHBOARD</h1>
    </div>

    <div class="directory_intro">
      <p>Welcome! Please select one of the following options</p>
    </div>

    <div class="directory_options">
      <a href="../../view/user_manager/index.php">
        <div class="option_card">
          <div class="option_img">
            <img src="../../view/directory/directory/img/W3P.png" alt="W3P">
          </div>
          <button type="button" name="button">W3P</button>
        </div>
      </a>

      <a href="../../view/login/index.php">
        <div class="option_card">
          <div class="option_img">
            <img src="../../view/directory/directory/img/Amazon.png" alt="Amazon">
          </div>
          <button type="button" name="button">Amazon</button>
        </div>
      </a>

      <a href="#">
        <div class="option_card">
          <div class="option_img">
            <img src="../../view/directory/directory/img/LFY.png" alt="Lanyard For You">
          </div>
          <button type="button" name="button">Lanyard For You</button>
        </div>
      </a>

      <a href="#">
        <div class="option_card">
          <div class="option_img">
            <img src="../../view/directory/directory/img/ullman-sails-logo-white.png" alt="Ullman Sails">
          </div>
          <button type="button" name="button">Ullman Sails</button>
        </div>
      </a>

      <a href="#">
        <div class="option_card">
          <div class="option_img">
            <img src="../../view/directory/directory/img/logo.png" alt="Promoflow">
          </div>
          <button type="button" name="button">Promoflow</button>
        </div>
      </a>
    </div>
  </section>
