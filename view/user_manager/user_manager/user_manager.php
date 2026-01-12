<?php
// Get the last modified time of the CSS and JS files to force cache refresh when files are updated
$cssTime = filemtime('../../view/user_manager/user_manager/user_manager.css');
$jsTime = filemtime('../../view/user_manager/user_manager/user_manager.js');
?>
<!-- Link to stylesheet with versioning to prevent caching issues -->
<link rel="stylesheet" href="../../view/user_manager/user_manager/user_manager.css?v=<?= $cssTime ?>">

<section class="container_user_manager">
  <!-- Left container: user list and search bar -->
  <div class="container_user">
    <div class="header_user">
      <h3>Users</h3>
      <div class="box_user_manager">
        <!-- Input field for searching users -->
        <input type="text" name="Search" placeholder="Search user...">
        <!-- Icon for search (magnifying glass) -->
        <div class="header_user_img"></div>
      </div>
    </div>

    <!-- Grid to display list of users -->
    <div class="user_data_grid" id="userGrid">
      <div class="grid_header">Full Name</div>
      <div class="grid_header">Role</div>
      <div class="grid_header">Email Address</div>
      <!-- User rows will be added here dynamically via JavaScript -->
    </div>
  </div>

  <!-- Right container: detailed information of selected user -->
  <div id="user_details_container" class="container_user_information" style="display: ;">
    <h2>User Details</h2>

    <!-- Placeholder for user image -->
    <div class="container_user_information_img"></div>

    <!-- User full name -->
    <div id="user_fullname" class="user_name">Pepito perez</div>

    <!-- Email information card -->
    <div class="info_card">
      <div class="icon">📧</div>
      <div class="text">
        <h3>Email Address</h3>
        <p id="user_email">example@email.com</p>
      </div>
    </div>

    <!-- Last visit information card -->
    <div class="info_card">
      <div class="icon">⏰</div>
      <div class="text">
        <h3>Last Visit</h3>
        <p id="user_last_visit">29 July 2025 – 14:22</p>
      </div>
    </div>

    <!-- Role information card -->
    <div class="info_card">
      <div class="icon">🛡️</div>
      <div class="text">
        <h3>Role(s)</h3>
        <p id="user_role">Administrator</p>
      </div>
    </div>
  </div>
</section>

<!-- Link to JavaScript file (dynamic loading and events) -->
<script src="../../view/order/user_manager/user_manager.js?v=<?= $jsTime ?>" type="text/javascript"></script>
