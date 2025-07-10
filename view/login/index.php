<!DOCTYPE html>
<html lang="es">
<head>
  <!-- Metadatos básicos -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="description" content="Promoflow" />
  <meta name="author" content="Promoflow" />
  <meta name="keywords" content="páginas web, diseño web, emprendedores, ecommerce, Colombia" />

  <!-- Título de la página -->
  <title>Promoflow</title>

  <!-- Fuente Poppins desde Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="imagen" />

  <!-- CSS con filemtime para evitar caché -->
  <link rel="stylesheet" href="view/login/style.css?v=<?= filemtime('view/login/style.css'); ?>">
</head>

<body>
    <?php include "../../view/login/header/header.php" ?>
    <?php include "../../view/login/main/main.php" ?>
</body>
</html>
