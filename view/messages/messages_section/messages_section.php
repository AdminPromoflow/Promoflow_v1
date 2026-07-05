<?php
$cssPath = '../../view/messages/messages_section/messages_section.css';
$jsPath  = '../../view/messages/messages_section/messages_section.js';
$jsPathLogic  = '../../view/messages/messages_section/messages_logics.js';

$cssV = is_file($cssPath) ? filemtime($cssPath) : time();
$jsV  = is_file($jsPath)  ? filemtime($jsPath)  : time();
$jsVLogic  = is_file($jsPathLogic)  ? filemtime($jsPathLogic)  : time();
?>

<link rel="stylesheet" href="<?= $cssPath ?>?v=<?= $cssV ?>">

<section class="msg-shell">

  <aside class="msg-sidebar" aria-label="Message conversation">

    <div class="msg-brand">
      <h2>Messaging</h2>
      <p>Live conversation</p>
    </div>

    <!-- Create Case Section -->
    <section class="msg-create-case" aria-label="Create new case">
      <h3>Create Case</h3>

      <form id="create-case-form" class="msg-case-form" autocomplete="off">

        <label class="msg-case-field">
          <span>Case name</span>
          <input
            id="case-name"
            name="case_name"
            type="text"
            placeholder="Example: Approval request"
            required
          >
        </label>

        <label class="msg-case-field">
          <span>Supplier ID</span>
          <input
            id="case-supplier"
            name="id_supplier"
            type="number"
            placeholder="Supplier ID"
            required
          >
        </label>

        <button id="create_case_btn" class="msg-btn msg-btn-primary" type="submit">
          Create Case
        </button>

      </form>
    </section>

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

<script defer src="<?= $jsPathLogic ?>?v=<?= $jsVLogic ?>"></script>
<script defer src="<?= $jsPath ?>?v=<?= $jsV ?>"></script>
