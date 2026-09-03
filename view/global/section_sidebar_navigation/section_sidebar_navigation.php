<?php
$sidebarCssFile = __DIR__ . '/section_sidebar_navigation.css';
$sidebarJsFile = __DIR__ . '/section_sidebar_navigation.js';
$sidebarCurrentPage = basename(dirname($_SERVER['SCRIPT_FILENAME'] ?? ''));
$sidebarClass = static function (string $page) use ($sidebarCurrentPage): string {
    return 'sidebar-left-menu-item' . ($sidebarCurrentPage === $page ? ' is-active' : '');
};
?>

<link rel="stylesheet" href="../../view/global/section_sidebar_navigation/section_sidebar_navigation.css?v=<?= file_exists($sidebarCssFile) ? filemtime($sidebarCssFile) : time() ?>">

<button id="sidebar-open" class="sidebar-open is-hidden" type="button" aria-label="Open navigation" aria-controls="dashboard-sidebar" aria-expanded="true">
  <img src="../../view/global/section_sidebar_navigation/img/menu.png" alt="">
</button>

<aside id="dashboard-sidebar" class="section-sidebar-navigation side-open" aria-label="Dashboard navigation">
  <button id="sidebar-close" class="sidebar-close" type="button" aria-label="Close navigation">
    <img src="../../view/global/section_sidebar_navigation/img/close_icon.png" alt="">
  </button>

  <a class="sidebar-header" href="../../view/overview/index.php" aria-label="Promoflow Operations dashboard">
    <img class="sidebar-brand-icon" src="../../view/global/section_sidebar_navigation/img/logo_promoflow.png" alt="Promoflow logo">
    <span class="sidebar-title">
      <strong>Promoflow</strong>
      <small>Operations</small>
    </span>
  </a>

  <nav class="sidebar-left-menu">
    <a class="<?= $sidebarClass('overview') ?>" href="../../view/overview/index.php" <?= $sidebarCurrentPage === 'overview' ? 'aria-current="page"' : '' ?>>
      <span class="sidebar-item-icon" aria-hidden="true">⌂</span>
      <span>Overview</span>
    </a>

    <a class="<?= $sidebarClass('messages') ?>" href="../../view/messages/index.php" <?= $sidebarCurrentPage === 'messages' ? 'aria-current="page"' : '' ?>>
      <span class="sidebar-item-icon" aria-hidden="true">✉</span>
      <span>Messages</span>
    </a>

    <button class="sidebar-left-menu-item" type="button" data-sidebar-placeholder="Approvals">
      <span class="sidebar-item-icon" aria-hidden="true">✓</span>
      <span>Approvals</span>
    </button>

    <button class="sidebar-left-menu-item" type="button" data-sidebar-placeholder="Orders">
      <span class="sidebar-item-icon" aria-hidden="true">▣</span>
      <span>Orders</span>
    </button>

    <a class="<?= $sidebarClass('user_manager') ?>" id="open_user_manager" href="../../view/user_manager/index.php" <?= $sidebarCurrentPage === 'user_manager' ? 'aria-current="page"' : '' ?>>
      <span class="sidebar-item-icon" aria-hidden="true">♙</span>
      <span>User Manager</span>
    </a>
  </nav>
</aside>

<script src="../../view/global/section_sidebar_navigation/section_sidebar_navigation.js?v=<?= file_exists($sidebarJsFile) ? filemtime($sidebarJsFile) : time() ?>" defer></script>
