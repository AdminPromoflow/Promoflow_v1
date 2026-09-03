<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Promoflow user administration">
  <title>User Manager | Promoflow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../view/user_manager/style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
</head>

<body class="body-user-manager">
  <?php include "../../view/global/menu/menu.php"; ?>

  <main class="user-manager-shell">
    <?php include "../../view/global/section_sidebar_navigation/section_sidebar_navigation.php"; ?>

    <div class="user-manager-content">
      <header class="user-manager-page-header">
        <div>
          <span class="user-manager-eyebrow">Administration</span>
          <h1>User Manager</h1>
          <p>Create, review, edit and remove dashboard users.</p>
        </div>
      </header>

      <?php include "../../view/user_manager/user_manager/user_manager.php"; ?>
    </div>
  </main>
</body>
</html>
