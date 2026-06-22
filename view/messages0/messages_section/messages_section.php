<?php
$cssPath = '../../view/messages/messages_section/messages_section.css';
$jsPath  = '../../view/messages/messages_section/messages_section.js';

$cssV = is_file($cssPath) ? filemtime($cssPath) : time();
$jsV  = is_file($jsPath)  ? filemtime($jsPath)  : time();
?>

<link rel="stylesheet" href="<?= $cssPath ?>?v=<?= $cssV ?>">

<section class="msg-shell">

  <aside class="msg-sidebar" aria-label="Message folders">
    <div class="msg-brand">
      <h2>Messaging</h2>
      <p>Inbox, sent and drafts</p>
    </div>

    <button class="msg-btn msg-btn-primary" type="button" data-compose-open>
      + Compose
    </button>

    <nav class="msg-folders" aria-label="Folders">
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

        <div class="msg-preview-body" id="msg-preview-body"></div>
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

<div class="msg-modal" hidden>
  <div class="msg-modal-card" role="dialog" aria-modal="true" aria-labelledby="msg-modal-title">
    <div class="msg-modal-header">
      <h3 id="msg-modal-title">New message</h3>
      <button class="msg-btn msg-btn-ghost" type="button" data-compose-close aria-label="Close">
        ✕
      </button>
    </div>

    <div class="msg-modal-body">
      <label class="msg-field">
        <span>To</span>
        <input type="text" placeholder="Name, team, or email">
      </label>

      <label class="msg-field">
        <span>Subject</span>
        <input type="text" placeholder="Subject">
      </label>

      <label class="msg-field">
        <span>Message</span>
        <textarea rows="7" placeholder="Write your message…"></textarea>
      </label>
    </div>

    <div class="msg-modal-footer"></div>
  </div>
</div>

<script defer src="<?= $jsPath ?>?v=<?= $jsV ?>"></script>
