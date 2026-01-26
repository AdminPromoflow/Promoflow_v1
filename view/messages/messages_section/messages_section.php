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

    <nav class="msg-folders" aria-label="Folders">
      <a class="msg-folder is-active" href="#" aria-current="page">
        <span class="msg-folder-dot"></span>
        Inbox
        <span class="msg-pill">12</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot"></span>
        Starred
        <span class="msg-pill">3</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot"></span>
        Sent
        <span class="msg-pill">8</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot"></span>
        Drafts
        <span class="msg-pill">2</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot"></span>
        Archive
        <span class="msg-pill">0</span>
      </a>

      <a class="msg-folder" href="#">
        <span class="msg-folder-dot"></span>
        Trash
        <span class="msg-pill">0</span>
      </a>
    </nav>

    <div class="msg-sidebar-footer">
      <div class="msg-hint">
        <strong>Tip</strong>
        <p>Use search to find threads by name, subject or SKU.</p>
      </div>
    </div>

  </aside>


  <!-- =========================
       RIGHT: MAIN AREA
  ========================== -->
  <div class="msg-main">

    <!-- =========================
         TOP BAR
    ========================== -->
    <header class="msg-topbar">

      <div class="msg-topbar-left">
        <h1 class="msg-title">Inbox</h1>
        <p class="msg-subtitle">Your latest conversations</p>
      </div>

      <div class="msg-topbar-right">
        <div class="msg-search">
          <input type="search" placeholder="Search messages, people, SKUs…" aria-label="Search messages">
          <button class="msg-btn msg-btn-ghost" type="button">Search</button>
        </div>

        <div class="msg-actions">
          <button class="msg-btn msg-btn-ghost" type="button">Refresh</button>
          <button class="msg-btn msg-btn-ghost" type="button">Mark read</button>
          <button class="msg-btn msg-btn-ghost" type="button">Archive</button>
        </div>
      </div>

    </header>


    <!-- =========================
         CONTENT: LIST + READER
    ========================== -->
    <div class="msg-content">

      <!-- =========================
           THREAD LIST
      ========================== -->
      <section class="msg-list" aria-label="Thread list">

        <div class="msg-list-toolbar">
          <div class="msg-select">
            <label class="msg-checkbox">
              <input type="checkbox">
              <span>Select</span>
            </label>

            <div class="msg-filter">
              <button class="msg-btn msg-btn-ghost" type="button">All</button>
              <button class="msg-btn msg-btn-ghost" type="button">Unread</button>
              <button class="msg-btn msg-btn-ghost" type="button">Flagged</button>
            </div>
          </div>

          <div class="msg-sort">
            <span class="msg-muted">Sort:</span>
            <button class="msg-btn msg-btn-ghost" type="button">Newest</button>
          </div>
        </div>

        <!-- Thread items -->
        <div class="msg-threads">

          <article class="msg-thread is-unread is-active" tabindex="0">
            <div class="msg-thread-left">
              <div class="msg-avatar" aria-hidden="true">W</div>
              <div class="msg-thread-meta">
                <div class="msg-thread-row">
                  <h3 class="msg-thread-title">W3P Supplier A</h3>
                  <span class="msg-thread-time">10:24</span>
                </div>
                <p class="msg-thread-subject">Approval request: SKU PRD-20251211</p>
                <p class="msg-thread-snippet">Hi team, please review the product details and confirm approval…</p>

                <div class="msg-tags">
                  <span class="msg-tag">Approvals</span>
                  <span class="msg-tag">W3P</span>
                  <span class="msg-tag is-soft">SKU: PRD-20251211</span>
                </div>
              </div>
            </div>

            <div class="msg-thread-right">
              <span class="msg-badge">Unread</span>
            </div>
          </article>

          <article class="msg-thread" tabindex="0">
            <div class="msg-thread-left">
              <div class="msg-avatar" aria-hidden="true">A</div>
              <div class="msg-thread-meta">
                <div class="msg-thread-row">
                  <h3 class="msg-thread-title">Amazon Ops</h3>
                  <span class="msg-thread-time">Yesterday</span>
                </div>
                <p class="msg-thread-subject">Order flagged: 112-9012345-6789012</p>
                <p class="msg-thread-snippet">The order is missing tracking information. Please update…</p>

                <div class="msg-tags">
                  <span class="msg-tag">Orders</span>
                  <span class="msg-tag">Amazon</span>
                  <span class="msg-tag is-soft">At risk</span>
                </div>
              </div>
            </div>

            <div class="msg-thread-right">
              <span class="msg-badge is-neutral">Open</span>
            </div>
          </article>

          <article class="msg-thread" tabindex="0">
            <div class="msg-thread-left">
              <div class="msg-avatar" aria-hidden="true">U</div>
              <div class="msg-thread-meta">
                <div class="msg-thread-row">
                  <h3 class="msg-thread-title">Ullman Sails</h3>
                  <span class="msg-thread-time">Jan 10</span>
                </div>
                <p class="msg-thread-subject">Website copy update</p>
                <p class="msg-thread-snippet">Could you adjust the intro and keep the titles slimmer…</p>

                <div class="msg-tags">
                  <span class="msg-tag">Internal</span>
                  <span class="msg-tag is-soft">Content</span>
                </div>
              </div>
            </div>

            <div class="msg-thread-right">
              <span class="msg-badge is-neutral">Read</span>
            </div>
          </article>

        </div>

      </section>


      <!-- =========================
           MESSAGE READER
      ========================== -->
      <section class="msg-reader" aria-label="Message reader">

        <div class="msg-reader-header">
          <div class="msg-reader-title">
            <h2>Approval request: SKU PRD-20251211</h2>
            <p class="msg-muted">From: W3P Supplier A • To: Operations • 10:24</p>
          </div>

          <div class="msg-reader-actions">
            <button class="msg-btn msg-btn-ghost" type="button">Reply</button>
            <button class="msg-btn msg-btn-ghost" type="button">Forward</button>
            <button class="msg-btn msg-btn-ghost" type="button">Delete</button>
          </div>
        </div>

        <div class="msg-reader-body">
          <p>Hello team,</p>
          <p>
            Please review the product submission for <strong>SKU PRD-20251211</strong>.
            The supplier has requested approval to proceed. Let us know if any changes are required.
          </p>

          <div class="msg-info-grid">
            <div class="msg-info-card">
              <h4>Platform</h4>
              <p>W3P</p>
            </div>
            <div class="msg-info-card">
              <h4>Supplier</h4>
              <p>W3P Supplier A</p>
            </div>
            <div class="msg-info-card">
              <h4>Approval Type</h4>
              <p>Product Approval</p>
            </div>
            <div class="msg-info-card">
              <h4>SKU</h4>
              <p>PRD-20251211</p>
            </div>
          </div>

          <div class="msg-divider"></div>

          <p>Thanks,</p>
          <p>Supplier Team</p>
        </div>

        <!-- Quick reply -->
        <div class="msg-reply">
          <textarea rows="3" placeholder="Write a quick reply…"></textarea>
          <div class="msg-reply-actions">
            <button class="msg-btn msg-btn-ghost" type="button">Attach</button>
            <button class="msg-btn msg-btn-primary" type="button">Send</button>
          </div>
        </div>

      </section>

    </div>

  </div>


  <!-- =========================
       COMPOSE MODAL (UI only)
  ========================== -->
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
