<?php
$cssFile = '../../view/directory/directory/directory.css';
$jsFile  = '../../view/directory/directory/directory.js';

$cssVer = file_exists($cssFile) ? filemtime($cssFile) : time();
$jsVer  = file_exists($jsFile)  ? filemtime($jsFile)  : time();

$today = date('d/m/Y');
?>
<link rel="stylesheet" href="../../view/directory/directory/directory.css?v=<?= $cssVer ?>">

<main class="ops" aria-label="Operations dashboard">
  <!-- ===================== -->
  <!-- SIDEBAR -->
  <!-- ===================== -->
  <aside class="ops__side" aria-label="Primary navigation">
    <div class="ops__brand">
      <img src="../../view/directory/directory/img/logo.png" alt="Logo">
      <div class="ops__brandText">
        <strong>Promoflow</strong>
        <span>Operations</span>
      </div>

      <button class="ops__sideClose" type="button" aria-label="Close menu" data-side-close>✕</button>
    </div>

    <nav class="ops__nav" aria-label="Dashboard sections">
      <button class="ops__navBtn is-active" type="button" data-view-btn="overview">
        <span class="ops__navLabel">Overview</span>
      </button>

      <!-- Messages accordion -->
      <div class="opsNavGroup">
        <button class="ops__navBtn ops__navBtn--hasAcc" type="button"
                data-view-btn="messages" data-acc-btn="messages"
                aria-expanded="false" aria-controls="ops-acc-messages">
          <span class="ops__navLabel">Messages</span>
          <span class="ops__navRight">
            <span class="ops__badge" aria-label="Unread messages">2</span>
            <span class="ops__chev" aria-hidden="true">▾</span>
          </span>
        </button>

        <div class="opsAcc" id="ops-acc-messages" data-acc-panel="messages">
          <button class="opsAcc__item" type="button" data-subview="messages" data-msg-filter="all">Overview</button>
          <button class="opsAcc__item" type="button" data-subview="messages" data-msg-filter="w3p">W3P</button>
          <button class="opsAcc__item" type="button" data-subview="messages" data-msg-filter="dot63">.63</button>
        </div>
      </div>

      <!-- Approbals accordion (pedido: "Approbals") -->
      <div class="opsNavGroup">
        <button class="ops__navBtn ops__navBtn--hasAcc" type="button"
                data-view-btn="approvals" data-acc-btn="approvals"
                aria-expanded="false" aria-controls="ops-acc-approvals">
          <span class="ops__navLabel">.63 Approbals</span>
          <span class="ops__navRight">
            <span class="ops__badge" aria-label="Pending approbals">7</span>
            <span class="ops__chev" aria-hidden="true">▾</span>
          </span>
        </button>

        <div class="opsAcc" id="ops-acc-approvals" data-acc-panel="approvals">
          <button class="opsAcc__item" type="button" data-subview="approvals" data-appr-platform="dot63">.63</button>
          <button class="opsAcc__item" type="button" data-subview="approvals" data-appr-platform="w3p">W3P</button>
        </div>
      </div>

      <!-- Orders accordion -->
      <div class="opsNavGroup">
        <button class="ops__navBtn ops__navBtn--hasAcc" type="button"
                data-view-btn="orders" data-acc-btn="orders"
                aria-expanded="false" aria-controls="ops-acc-orders">
          <span class="ops__navLabel">Orders</span>
          <span class="ops__navRight">
            <span class="ops__badge" aria-label="Open orders">5</span>
            <span class="ops__chev" aria-hidden="true">▾</span>
          </span>
        </button>

        <div class="opsAcc" id="ops-acc-orders" data-acc-panel="orders">
          <button class="opsAcc__item" type="button" data-subview="orders" data-orders-tab="overview">Overview</button>
          <button class="opsAcc__item" type="button" data-subview="orders" data-orders-tab="dot63">.63</button>
          <button class="opsAcc__item" type="button" data-subview="orders" data-orders-tab="w3p">W3P</button>
          <button class="opsAcc__item" type="button" data-subview="orders" data-orders-tab="amazon">Amazon</button>
          <button class="opsAcc__item" type="button" data-subview="orders" data-orders-tab="ebay">eBay</button>
        </div>
      </div>
    </nav>

    <div class="ops__sideFoot">
      <a class="ops__link" href="#">Settings</a>
      <a class="ops__link" href="#">Sign out</a>
    </div>
  </aside>

<<<<<<< HEAD
  <!-- overlay mobile -->
  <button class="ops__overlay" type="button" aria-label="Close menu" data-side-close data-side-overlay hidden></button>

  <!-- ===================== -->
  <!-- MAIN -->
  <!-- ===================== -->
  <section class="ops__main">
    <header class="ops__topbar" aria-label="Header">
      <div class="ops__topbarLeft">
        <button class="ops__burger" type="button" aria-label="Open menu" data-side-toggle>
          <span class="ops__burgerLines" aria-hidden="true"></span>
        </button>

        <div>
          <h1 class="ops__title">Operations Dashboard</h1>
          <p class="ops__subtitle">
            Clear separation: Messages (W3P ↔ .63), .63 approbals (3 queues), and orders per platform.
          </p>
=======
    <div class="directory_options">
      <a href="">
        <div class="option_card">
          <div class="option_img">
            <img src="../../view/directory/directory/img/W3P.png" alt="W3P">
          </div>
          <button type="button" name="button">W3P</button>
>>>>>>> 61b43837b6098ccf1be244d162cedfc3eb83aef1
        </div>
      </div>

<<<<<<< HEAD
      <div class="ops__topActions">
        <button class="ops__btn ops__btn--primary" type="button">+ New message</button>
        <button class="ops__btn" type="button">Create task</button>
      </div>
    </header>

    <!-- ===================== -->
    <!-- VIEW: OVERVIEW -->
    <!-- ===================== -->
    <section class="opsView is-active" data-view="overview" aria-label="Overview">
      <div class="opsGrid">
        <article class="opsCard opsCard--tight">
          <div class="opsCard__head">
            <h2>Messages</h2>
            <span class="opsPill opsPill--info">W3P ↔ .63</span>
          </div>
          <p class="opsBig">2</p>
          <p class="opsMuted">Open threads</p>
          <div class="opsCard__foot">
            <button class="ops__btn ops__btn--ghost" type="button" data-jump="messages">Open Messages</button>
          </div>
        </article>

        <article class="opsCard opsCard--tight">
          <div class="opsCard__head">
            <h2>.63 Approbals</h2>
            <span class="opsPill opsPill--warn">Pending</span>
          </div>
          <p class="opsBig">7</p>
          <p class="opsMuted">Across 3 queues</p>
          <div class="opsCard__foot">
            <button class="ops__btn ops__btn--ghost" type="button" data-jump="approvals">Review approbals</button>
          </div>
        </article>

        <article class="opsCard opsCard--tight">
          <div class="opsCard__head">
            <h2>Orders</h2>
            <span class="opsPill opsPill--ok">W3P + .63</span>
          </div>
          <p class="opsBig">5</p>
          <p class="opsMuted">Open / at risk</p>
          <div class="opsCard__foot">
            <button class="ops__btn ops__btn--ghost" type="button" data-jump="orders">Open Orders</button>
          </div>
        </article>

        <article class="opsCard opsCard--tight">
          <div class="opsCard__head">
            <h2>Integrations</h2>
            <span class="opsPill opsPill--muted">Not configured</span>
          </div>
          <p class="opsMuted">Amazon and eBay have no orders or messaging connected at the moment.</p>
          <div class="opsCard__foot">
            <button class="ops__btn" type="button" disabled>Connect Amazon</button>
            <button class="ops__btn" type="button" disabled>Connect eBay</button>
=======
      <a href="">
        <div class="option_card">
          <div class="option_img">
            <img src="../../view/directory/directory/img/Amazon.png" alt="Amazon">
>>>>>>> 61b43837b6098ccf1be244d162cedfc3eb83aef1
          </div>
        </article>
      </div>

      <article class="opsCard">
        <div class="opsCard__head">
          <h2>Today’s focus</h2>
          <span class="opsPill opsPill--muted"><?= htmlspecialchars($today) ?></span>
        </div>

        <div class="opsFocus">
          <section class="opsFocus__col">
            <h3 class="opsFocus__title">Messages</h3>
            <ul class="opsListPlain opsListPlain--compact">
              <li>Only W3P ↔ .63 are enabled.</li>
              <li>Use filters to focus by platform.</li>
            </ul>
            <button class="ops__btn ops__btn--ghost" type="button" data-jump="messages">Go to Messages</button>
          </section>

          <section class="opsFocus__col">
            <h3 class="opsFocus__title">.63 Approbals</h3>
            <ul class="opsListPlain opsListPlain--compact">
              <li>Category → Product group → Product launch.</li>
              <li>Use Overview to see all queues.</li>
            </ul>
            <button class="ops__btn ops__btn--ghost" type="button" data-jump="approvals">Go to Approbals</button>
          </section>

          <section class="opsFocus__col">
            <h3 class="opsFocus__title">Orders</h3>
            <ul class="opsListPlain opsListPlain--compact">
              <li>Platforms handled separately.</li>
              <li>Overview highlights risk quickly.</li>
            </ul>
            <button class="ops__btn ops__btn--ghost" type="button" data-jump="orders">Go to Orders</button>
          </section>
        </div>
      </article>
    </section>

<<<<<<< HEAD
    <!-- ===================== -->
    <!-- VIEW: MESSAGES (REDISEÑADA) -->
    <!-- ===================== -->
    <section class="opsView" data-view="messages" aria-label="Messages">
      <article class="opsCard opsCard--messages">
        <div class="opsCard__head">
          <div>
            <h2>Messages</h2>
            <p class="opsMuted">W3P ↔ .63 only. Amazon and eBay are not available for messaging.</p>
=======
      <a href="../../view/order_lanyards4you/index.php">
        <div class="option_card">
          <div class="option_img">
            <img src="../../view/directory/directory/img/LFY.png" alt="Lanyard For You">
>>>>>>> 61b43837b6098ccf1be244d162cedfc3eb83aef1
          </div>
        </div>

<<<<<<< HEAD
        <div class="opsMsgLayout">
          <!-- LIST -->
          <section class="opsMsgPane opsMsgPane--list" aria-label="Thread list">
            <div class="opsMsgTools">
              <input class="opsInput" type="search" placeholder="Search threads…" data-msg-search>

              <div class="opsPillTabs" role="tablist" aria-label="Message filters">
                <button class="opsPillTab is-active" type="button" data-msg-filter-btn="all">Overview</button>
                <button class="opsPillTab" type="button" data-msg-filter-btn="w3p">W3P</button>
                <button class="opsPillTab" type="button" data-msg-filter-btn="dot63">.63</button>
              </div>

              <span class="opsHint">2 threads</span>
            </div>

            <div class="opsMsgList" role="list">
              <button class="opsMsgRow is-active" type="button" data-thread="t1" data-platform="w3p">
                <span class="opsTag opsTag--w3p">W3P</span>

                <span class="opsMsgRow__main">
                  <span class="opsMsgRow__title">Missing variation image</span>
                  <span class="opsMsgRow__snippet">Please confirm image + stock for PRD-2025…</span>
                </span>

                <span class="opsMsgRow__meta">
                  <span class="opsMsgRow__date">12/12/2025</span>
                  <span class="opsPill opsPill--info">Open</span>
                </span>
              </button>

              <button class="opsMsgRow" type="button" data-thread="t2" data-platform="dot63">
                <span class="opsTag opsTag--dot63">.63</span>

                <span class="opsMsgRow__main">
                  <span class="opsMsgRow__title">Category approbal request</span>
                  <span class="opsMsgRow__snippet">“Custom Gadgets” awaiting review.</span>
                </span>

                <span class="opsMsgRow__meta">
                  <span class="opsMsgRow__date">11/12/2025</span>
                  <span class="opsPill opsPill--warn">Pending</span>
                </span>
              </button>
            </div>

            <div class="opsEmpty">
              <div class="opsEmpty__title">Amazon & eBay</div>
              <p class="opsEmpty__text">No messaging configured for Amazon or eBay.</p>
            </div>
          </section>

          <!-- DETAIL -->
          <section class="opsMsgPane opsMsgPane--detail" aria-label="Thread detail" data-msg-detail>
            <div class="opsThreadHead">
              <div>
                <h3 class="opsThreadTitle">Missing variation image</h3>
                <p class="opsMuted">Thread between W3P and .63</p>
              </div>
              <div class="opsThreadHead__actions">
                <button class="ops__btn ops__btn--ghost" type="button">Mark as done</button>
                <button class="ops__btn ops__btn--primary" type="button">Reply</button>
              </div>
            </div>

            <div class="opsChat" role="region" aria-label="Conversation">
              <div class="opsBubble opsBubble--them">
                <span class="opsBubble__meta">W3P • 12/12/2025 09:10</span>
                <p>Please confirm the missing variation image and stock for SKU PRD-2025…</p>
              </div>

              <div class="opsBubble opsBubble--me">
                <span class="opsBubble__meta">.63 • 12/12/2025 09:24</span>
                <p>Noted. We’ll review and confirm the assets before approbal/launch.</p>
              </div>
            </div>

            <div class="opsComposer">
              <input class="opsInput" type="text" placeholder="Type a reply…" disabled>
              <button class="ops__btn" type="button" disabled>Send</button>
            </div>
          </section>
        </div>
      </article>
    </section>

    <!-- ===================== -->
    <!-- VIEW: APPROBALS -->
    <!-- ===================== -->
    <section class="opsView" data-view="approvals" aria-label=".63 Approbals">
      <article class="opsCard">
        <div class="opsCard__head">
          <h2>.63 Approbals</h2>
          <p class="opsMuted">Three queues: Category → Product group → Product launch.</p>
        </div>

        <div class="opsPlatformBlock is-active" data-appr-platform-view="dot63">
          <div class="opsTabs" role="tablist" aria-label="Approbal queues">
            <button class="opsTab is-active" type="button" role="tab" data-approvals-tab="overview">
              Overview <span class="opsMiniCount">3</span>
            </button>
            <button class="opsTab" type="button" role="tab" data-approvals-tab="cat">
              Category <span class="opsMiniCount">1</span>
            </button>
            <button class="opsTab" type="button" role="tab" data-approvals-tab="group">
              Product group <span class="opsMiniCount">1</span>
            </button>
            <button class="opsTab" type="button" role="tab" data-approvals-tab="launch">
              Product launch <span class="opsMiniCount">1</span>
            </button>
          </div>

          <section class="opsTabView is-active" data-approvals-view="overview">
            <div class="opsMiniGrid">
              <article class="opsMiniCard">
                <div class="opsMiniCard__top">
                  <strong>Category</strong><span class="opsPill opsPill--warn">1 pending</span>
                </div>
                <p class="opsMutedSmall">New categories awaiting review.</p>
                <button class="ops__btn ops__btn--ghost" type="button" data-approvals-jump="cat">Open</button>
              </article>
              <article class="opsMiniCard">
                <div class="opsMiniCard__top">
                  <strong>Product group</strong><span class="opsPill opsPill--warn">1 pending</span>
                </div>
                <p class="opsMutedSmall">Groups need validation.</p>
                <button class="ops__btn ops__btn--ghost" type="button" data-approvals-jump="group">Open</button>
              </article>
              <article class="opsMiniCard">
                <div class="opsMiniCard__top">
                  <strong>Product launch</strong><span class="opsPill opsPill--ok">1 ready</span>
                </div>
                <p class="opsMutedSmall">Final checklist before publishing.</p>
                <button class="ops__btn ops__btn--ghost" type="button" data-approvals-jump="launch">Open</button>
              </article>
            </div>
          </section>

          <section class="opsTabView" data-approvals-view="cat">
            <div class="opsTableTop">
              <input class="opsInput" type="search" placeholder="Search categories…" data-approvals-search>
              <div class="opsRight">
                <button class="ops__btn ops__btn--ghost" type="button">Reject</button>
                <button class="ops__btn ops__btn--primary" type="button">Approve</button>
              </div>
            </div>
            <div class="opsTableWrap" role="region" tabindex="0">
              <table class="opsTable">
                <thead>
                  <tr><th>Category</th><th>Submitted by</th><th>Date</th><th>Status</th><th style="width:200px;">Actions</th></tr>
                </thead>
                <tbody>
                  <tr data-searchrow>
                    <td>Custom Gadgets</td><td>W3P Supplier A</td><td>12/12/2025</td>
                    <td><span class="opsPill opsPill--warn">Pending</span></td>
                    <td class="opsActions">
                      <button class="ops__btn ops__btn--ghost" type="button">Review</button>
                      <button class="ops__btn ops__btn--primary" type="button">Approve</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="opsTabView" data-approvals-view="group">
            <div class="opsTableTop">
              <input class="opsInput" type="search" placeholder="Search groups…" data-approvals-search>
              <div class="opsRight">
                <button class="ops__btn ops__btn--ghost" type="button">Reject</button>
                <button class="ops__btn ops__btn--primary" type="button">Approve</button>
              </div>
            </div>
            <div class="opsTableWrap" role="region" tabindex="0">
              <table class="opsTable">
                <thead>
                  <tr><th>Group</th><th>Submitted by</th><th>Date</th><th>Status</th><th style="width:200px;">Actions</th></tr>
                </thead>
                <tbody>
                  <tr data-searchrow>
                    <td>Office Lanyards</td><td>W3P Supplier B</td><td>11/12/2025</td>
                    <td><span class="opsPill opsPill--warn">Pending</span></td>
                    <td class="opsActions">
                      <button class="ops__btn ops__btn--ghost" type="button">Review</button>
                      <button class="ops__btn ops__btn--primary" type="button">Approve</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="opsTabView" data-approvals-view="launch">
            <div class="opsTableTop">
              <input class="opsInput" type="search" placeholder="Search products…" data-approvals-search>
              <div class="opsRight">
                <button class="ops__btn ops__btn--ghost" type="button">Hold</button>
                <button class="ops__btn ops__btn--primary" type="button">Launch</button>
              </div>
            </div>
            <div class="opsTableWrap" role="region" tabindex="0">
              <table class="opsTable">
                <thead>
                  <tr><th>Product</th><th>SKU</th><th>Checklist</th><th>Status</th><th style="width:220px;">Actions</th></tr>
                </thead>
                <tbody>
                  <tr data-searchrow>
                    <td>Custom Lanyard 20mm</td><td>PRD-20251211-…</td><td>Images • Variations • Pricing</td>
                    <td><span class="opsPill opsPill--ok">Ready to launch</span></td>
                    <td class="opsActions">
                      <button id="open_review" class="open_review ops__btn ops__btn--ghost" type="button">Review</button>
                      <button  class="ops__btn ops__btn--primary" type="button">Launch</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="opsPlatformBlock" data-appr-platform-view="w3p">
          <div class="opsEmpty">
            <div class="opsEmpty__title">No W3P approbals configured yet</div>
            <p class="opsEmpty__text">Only .63 has the approbal queues at the moment.</p>
          </div>
        </div>
      </article>
    </section>

    <!-- ===================== -->
    <!-- VIEW: ORDERS -->
    <!-- ===================== -->
    <section class="opsView" data-view="orders" aria-label="Orders">
      <article class="opsCard">
        <div class="opsCard__head">
          <h2>Orders</h2>
          <p class="opsMuted">Each platform is managed separately: .63, W3P, Amazon, eBay.</p>
        </div>

        <div class="opsTabs" role="tablist" aria-label="Order platforms">
          <button class="opsTab is-active" type="button" role="tab" data-orders-tab="overview">Overview</button>
          <button class="opsTab" type="button" role="tab" data-orders-tab="dot63">.63</button>
          <button class="opsTab" type="button" role="tab" data-orders-tab="w3p">W3P</button>
          <button class="opsTab" type="button" role="tab" data-orders-tab="amazon">Amazon</button>
          <button class="opsTab" type="button" role="tab" data-orders-tab="ebay">eBay</button>
        </div>

        <section class="opsTabView is-active" data-orders-view="overview">
          <div class="opsMiniGrid">
            <article class="opsMiniCard">
              <div class="opsMiniCard__top"><strong>.63</strong><span class="opsPill opsPill--info">2 items</span></div>
              <p class="opsMutedSmall">Open + shipped tracking.</p>
              <button class="ops__btn ops__btn--ghost" type="button" data-orders-jump="dot63">Open</button>
            </article>
            <article class="opsMiniCard">
              <div class="opsMiniCard__top"><strong>W3P</strong><span class="opsPill opsPill--warn">2 items</span></div>
              <p class="opsMutedSmall">Includes at-risk orders.</p>
              <button class="ops__btn ops__btn--ghost" type="button" data-orders-jump="w3p">Open</button>
            </article>
            <article class="opsMiniCard">
              <div class="opsMiniCard__top"><strong>Amazon</strong><span class="opsPill opsPill--muted">None</span></div>
              <p class="opsMutedSmall">Not connected at the moment.</p>
              <button class="ops__btn ops__btn--ghost" type="button" data-orders-jump="amazon">View</button>
            </article>
            <article class="opsMiniCard">
              <div class="opsMiniCard__top"><strong>eBay</strong><span class="opsPill opsPill--muted">None</span></div>
              <p class="opsMutedSmall">Not connected at the moment.</p>
              <button class="ops__btn ops__btn--ghost" type="button" data-orders-jump="ebay">View</button>
            </article>
          </div>
        </section>

        <section class="opsTabView" data-orders-view="dot63">
          <div class="opsTableTop">
            <input class="opsInput" type="search" placeholder="Search .63 orders…" data-orders-search>
            <div class="opsRight">
              <select class="opsSelect" data-orders-status>
                <option value="all">Overview</option>
                <option value="open">Open</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>
          </div>

          <div class="opsTableWrap" role="region" tabindex="0">
            <table class="opsTable">
              <thead>
                <tr><th>Order ID</th><th>SKU</th><th>Due</th><th>Status</th><th style="width:220px;">Actions</th></tr>
              </thead>
              <tbody>
                <tr data-order-row data-status="open">
                  <td>63-10021</td><td>VRT-2025-…</td><td>14/12/2025</td>
                  <td><span class="opsPill opsPill--ok">Open</span></td>
                  <td class="opsActions">
                    <button class="ops__btn ops__btn--ghost" type="button">Details</button>
                    <button class="ops__btn" type="button">Print label</button>
                  </td>
                </tr>
                <tr data-order-row data-status="shipped">
                  <td>63-10018</td><td>PRD-2025-…</td><td>10/12/2025</td>
                  <td><span class="opsPill opsPill--muted">Shipped</span></td>
                  <td class="opsActions">
                    <button class="ops__btn ops__btn--ghost" type="button">Details</button>
                    <button class="ops__btn" type="button">Tracking</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="opsTabView" data-orders-view="w3p">
          <div class="opsTableTop">
            <input class="opsInput" type="search" placeholder="Search W3P orders…" data-orders-search>
            <div class="opsRight">
              <select class="opsSelect" data-orders-status>
                <option value="all">Overview</option>
                <option value="open">Open</option>
                <option value="at-risk">At risk</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div class="opsTableWrap" role="region" tabindex="0">
            <table class="opsTable">
              <thead>
                <tr><th>Order ID</th><th>SKU</th><th>Due</th><th>Status</th><th style="width:220px;">Actions</th></tr>
              </thead>
              <tbody>
                <tr data-order-row data-status="open">
                  <td>W3P-40991</td><td>PRD-2025-…</td><td>12/12/2025</td>
                  <td><span class="opsPill opsPill--ok">Open</span></td>
                  <td class="opsActions">
                    <button class="ops__btn ops__btn--ghost" type="button">Details</button>
                    <button class="ops__btn ops__btn--primary" type="button">Process</button>
                  </td>
                </tr>
                <tr data-order-row data-status="at-risk">
                  <td>W3P-40980</td><td>LNY-10MM-…</td><td>12/12/2025</td>
                  <td><span class="opsPill opsPill--warn">At risk</span></td>
                  <td class="opsActions">
                    <button class="ops__btn ops__btn--ghost" type="button">Details</button>
                    <button class="ops__btn ops__btn--danger" type="button">Escalate</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="opsTabView" data-orders-view="amazon">
          <div class="opsEmpty">
            <div class="opsEmpty__title">No Amazon orders yet</div>
            <p class="opsEmpty__text">Amazon is managed separately, but nothing is connected at the moment.</p>
          </div>
        </section>

        <section class="opsTabView" data-orders-view="ebay">
          <div class="opsEmpty">
            <div class="opsEmpty__title">No eBay orders yet</div>
            <p class="opsEmpty__text">eBay is managed separately, but nothing is connected at the moment.</p>
          </div>
        </section>
      </article>
    </section>

=======
    </div>
>>>>>>> 61b43837b6098ccf1be244d162cedfc3eb83aef1
  </section>
</main>

<script src="../../view/directory/directory/directory.js?v=<?= $jsVer ?>" defer></script>
