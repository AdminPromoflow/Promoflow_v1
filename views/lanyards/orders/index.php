<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Promoflow</title>

    <!-- Preconnect and link to Google Fonts for Montserrat and Roboto -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500&family=Roboto:wght@100;300;400&display=swap" rel="stylesheet">

    <!-- Set the viewport for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- Include CSS files for styling -->
    <link rel="stylesheet" href="../../../assets/css/global/menu.css">
    <link rel="stylesheet" href="../../../assets/css/lanyards/lanyards-customers/sections/section-1-home.css">
    <link rel="stylesheet" href="../../../assets/css/home/style.css">
</head>
<body>
    <!-- Include the menu and section components using PHP include -->
    <?php include "../../../views/global/menu.php"?>
    <?php include "../../../views/lanyards/orders/sections/section-1-home.php"?>

    <!-- Include JavaScript file for interactive functionality -->
    <script src="../../../assets/js/global/menu.js" type="text/javascript"></script>
    <script  src="../../../assets/js/lanyards/lanyards-customers/sections/section-1-home.js" type="text/javascript"></script>

</body>
</html>
