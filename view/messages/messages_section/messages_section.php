<link rel="stylesheet" href="../../view/messages/messages_section/messages_section.css?v=<?= file_exists('../../view/messages/messages_section/messages_section.css') ? filemtime('../../view/messages/messages_section/messages_section.css') : time() ?>">

<section class="msg-shell">

  <!-- =========================
       LEFT: FOLDERS / ACTIONS
  ========================== -->
  <aside class="msg-sidebar" aria-label="Messaging sidebar">

    <div class="msg-brand">
      <h2>Messaging</h2>
      <p>Inbox, sent and drafts</p>
    </div>

    <button class="msg-btn msg-btn-primary" type="button" data-action="compose">
      + Compose
    </button>

    <!-- Folders (simple list, not grouped) -->
    <nav class="msg-folders" aria-label="Folders">
      <a class="msg-folder is-active" href="#" aria-current="page">
        <span class="msg-folder-dot" aria-hidden="true"></span>
        <span class="msg-folder-name">Inbox</span>
        <span class="msg-count">12</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot" aria-hidden="true"></span>
        <span class="msg-folder-name">W3P Supplier </span>
        <span class="msg-count">3</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot" aria-hidden="true"></span>
        <span class="msg-folder-name">Amazon Ops</span>
        <span class="msg-count">8</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot" aria-hidden="true"></span>
        <span class="msg-folder-name">.63 Team</span>
        <span class="msg-count">2</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot" aria-hidden="true"></span>
        <span class="msg-folder-name">Ullman Sails</span>
        <span class="msg-count">0</span>
      </a>


    </nav>

  </aside>


  <!-- =========================
       RIGHT: MAIN AREA
  ========================== -->
  <div class="msg-main">

    <!-- TOP BAR: only title -->
    <header class="msg-topbar">
      <h1 class="msg-title">Inbox</h1>
    </header>

    <!-- =========================
         READER (now occupies full space)
         msg-list removed
    ========================== -->
    <section class="msg-reader" aria-label="Messages">

    

      <!-- msg-reader-body: no platform/supplier cards -->
      <div class="msg-reader-body">


        <!-- Selected message preview (simple, no buttons, no info cards) -->
        <div class="msg-preview" aria-label="Selected message">
          <div class="msg-preview-head">
            <h3>Approval request: SKU PRD-20251211</h3>
            <p class="msg-muted">From: W3P Supplier A • To: Operations • 10:24</p>
          </div>

          <div class="msg-preview-body">
            <p>Hello team,</p>
            <p>
              Please review the product submission for <strong>SKU PRD-20251211</strong>.
              The supplier has requested approval to proceed. Let us know if any changes are required.
            </p>
            <p>Thanks,<br>Supplier Team</p>
          </div>
        </div>

      </div>

    </section>

  </div>


  <!-- Compose modal (UI only) -->
  <div class="msg-modal" role="dialog" aria-modal="true" aria-label="Compose message">
    <div class="msg-modal-card">
      <div class="msg-modal-header">
        <h3>New message</h3>
        <button class="msg-btn msg-btn-ghost" type="button" aria-label="Close">✕</button>
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

      <div class="msg-modal-footer">
        <button class="msg-btn msg-btn-ghost" type="button">Save draft</button>
        <button class="msg-btn msg-btn-primary" type="button">Send</button>
      </div>
    </div>
  </div>

</section>

<script src="../../view/messages/messages_section/messages_section.js?v=<?= file_exists('../../view/messages/messages_section/messages_section.js') ? filemtime('../../view/messages/messages_section/messages_section.js') : time() ?>" defer></script>
