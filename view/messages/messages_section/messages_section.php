<?php
$cssPath = '../../view/messages/messages_section/messages_section.css';
$jsPath  = '../../view/messages/messages_section/messages_section.js';

$cssV = is_file($cssPath) ? filemtime($cssPath) : time();
$jsV  = is_file($jsPath)  ? filemtime($jsPath)  : time();
?>

<link rel="stylesheet" href="<?= $cssPath ?>?v=<?= $cssV ?>">

<section class="msg-shell">

  <aside class="msg-sidebar" aria-label="Message conversation">
    <div class="msg-brand">
      <h2>Messaging</h2>
      <p>Live conversation</p>
    </div>

    <nav class="msg-folders" aria-label="Conversations">
      <button class="msg-folder is-active" type="button" aria-current="page">
        <span class="msg-folder-dot" aria-hidden="true"></span>
        <span class="msg-folder-name">Approval request: SKU PRD-20251211</span>
      </button>
    </nav>
  </aside>

  <main class="msg-main">

    <header class="msg-topbar">
      <h1 class="msg-title">Inbox</h1>
    </header>

    <section class="msg-reader" aria-label="Selected message">

      <article class="msg-preview">
        <div class="msg-preview-head">
          <h3>Approval request: SKU PRD-20251211</h3>
          <p class="msg-muted">Live conversation</p>
        </div>

        <div class="msg-preview-body" id="msg-preview-body">
          <p class="msg-empty">No messages yet.</p>
        </div>
      </article>

      <form class="msg-inputbar" id="msg-form-promoflow" autocomplete="off">
        <input
          id="msg-input-promoflow"
          class="msg-input"
          type="text"
          placeholder="Write a message…"
        >

        <button id="send_promoflow" class="msg-btn msg-btn-primary" type="submit">
          Send
        </button>
      </form>

    </section>

  </main>

</section>

<script defer src="<?= $jsPath ?>?v=<?= $jsV ?>"></script>
