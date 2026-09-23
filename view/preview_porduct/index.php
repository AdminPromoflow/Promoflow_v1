<?php
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
if (($_SESSION['is_logged'] ?? false) !== true || empty($_SESSION['user_email'])) {
    header('Location: ../../view/login/index.php');
    exit;
}
session_write_close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Review product options, pricing and pending status changes in Promoflow.">
  <title>Product review | Promoflow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
</head>
<body class="body_product_review">
  <?php require __DIR__ . '/../global/menu/menu.php'; ?>
  <?php require __DIR__ . '/preview_porduct/preview.php'; ?>
</body>
</html>
