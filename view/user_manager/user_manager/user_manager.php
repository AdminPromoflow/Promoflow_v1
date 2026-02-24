<?php
$cssHref      = '../../view/user_manager/user_manager/user_manager.css';
$jsStoreHref  = '../../view/user_manager/user_manager/user_manager_logic.js';
$jsUIHref     = '../../view/user_manager/user_manager/user_manager.js';

$cssFile      = __DIR__ . '/../../view/user_manager/user_manager/user_manager.css';
$jsStoreFile  = __DIR__ . '/../../view/user_manager/user_manager/user_manager_logic.js';
$jsUIFile     = __DIR__ . '/../../view/user_manager/user_manager/user_manager.js';

$cssTime      = file_exists($cssFile) ? filemtime($cssFile) : time();
$jsStoreTime  = file_exists($jsStoreFile) ? filemtime($jsStoreFile) : time();
$jsUITime     = file_exists($jsUIFile) ? filemtime($jsUIFile) : time();
?>

<link rel="stylesheet" href="<?= $cssHref ?>?v=<?= $cssTime ?>">

<section class="um" data-um-root>
  <div class="um-layout">

    <!-- LEFT -->
    <div class="um-panel um-panel-scroll">
      <div class="um-header">
        <div>
          <h3 class="um-header__title">Users</h3>
          <p class="um-header__sub">Select a user to view details.</p>
        </div>

        <div class="um-search">
          <input data-um="search" type="search" placeholder="Search user..." autocomplete="off">
          <div class="um-search__icon" aria-hidden="true"></div>
        </div>
      </div>

      <div class="um-grid">
        <div class="um-grid__head">
          <div class="um-grid__th">Full Name</div>
          <div class="um-grid__th">Access</div>
          <div class="um-grid__th">Email Address</div>
        </div>

        <div class="um-grid__body" data-um="grid" aria-label="Users list">
          <!-- rows by JS -->
        </div>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="um-panel um-panel--details is-empty" data-um="details">
      <div class="um-details__top">
        <h2 class="um-details__title">User Details</h2>
        <div class="um-badges">
          <span class="um-badge" data-um="badge-status">—</span>
          <span class="um-badge" data-um="badge-access">—</span>
        </div>
      </div>

      <div class="um-profile">
        <div class="um-profile__avatar" data-um="detail-avatar" aria-hidden="true"></div>
        <div class="um-profile__name" data-um="detail-name">Select a user</div>
        <div class="um-profile__email" data-um="detail-email-small">Click on a row to load details.</div>
      </div>

      <div class="um-cards">
        
        <div class="um-card">
          <div class="um-card__icon">📧</div>
          <div class="um-card__text">
            <h3>Email Address</h3>
            <p data-um="detail-email">—</p>
          </div>
        </div>

        <div class="um-card">
          <div class="um-card__icon">🔑</div>
          <div class="um-card__text">
            <h3>Access</h3>
            <p data-um="detail-roles">—</p>
          </div>
        </div>

      </div>

      <div class="um-actions">
        <button type="button" class="um-btn" data-um="btn-edit" id="edit" disabled>Edit</button>
        <button type="button" class="um-btn um-btn--ghost" data-um="btn-toggle" id="toggle" disabled>Disable</button>
        <button type="button" class="um-btn um-btn--danger" data-um="btn-delete" id="delete" disabled>Delete user</button>
      </div>
    </div>

    <!-- ADD (FULL WIDTH) -->
    <section class="um-panel um-panel--add" data-um="add-section" aria-label="Add user section">
      <header class="um-add__header">
        <h3 data-um="add-title">Add user</h3>
        <p data-um="add-desc">Create a new user and assign platform access.</p>
      </header>

      <form class="um-form" data-um="form" novalidate>
        <input type="hidden" name="id" data-um="field-id" id="user_id" value="">

        <label class="um-field">
          <span>Full name</span>
          <input type="text" name="name" data-um="field-name" id="name" placeholder="e.g. Pepito Pérez" required>
        </label>

        <label class="um-field">
          <span>Email</span>
          <input type="email" name="email" data-um="field-email" id="email" placeholder="e.g. pepito@company.com" required>
        </label>

        <label class="um-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            data-um="field-password"
            id="password"
            placeholder="••••••••"
            autocomplete="new-password"
          >
        </label>

        <!-- <label class="um-field">
          <span>Status</span>
          <select name="status" data-um="field-status" id="status" required>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </label> -->

        <div class="um-field um-field--full">
          <span>Access (roles)</span>

          <div class="um-roles" role="group" aria-label="Access roles">
            <label class="um-role"><input type="checkbox" name="roles[]" value="Ullman Sails"><span>Ullman Sails</span></label>
            <label class="um-role"><input type="checkbox" name="roles[]" value="W3P"><span>W3P</span></label>
            <label class="um-role"><input type="checkbox" name="roles[]" value="Amazon"><span>Amazon</span></label>
            <label class="um-role"><input type="checkbox" name="roles[]" value="eBay"><span>eBay</span></label>
            <label class="um-role"><input type="checkbox" name="roles[]" value=".63"><span>.63</span></label>
            <label class="um-role"><input type="checkbox" name="roles[]" value="Hello Print"><span>Hello Print</span></label>
            <label class="um-role um-role--admin"><input type="checkbox" name="roles[]" value="Admin"><span>Admin (all access)</span></label>
          </div>

          <div class="um-roles-hint" data-um="roles-hint" aria-live="polite"></div>
        </div>

        <!-- <label class="um-field um-field--full um-field--file">
          <span>Avatar image (optional)</span>

          <input type="file" name="avatar" accept="image/*" data-um="field-avatar" id="avatar">

          <div class="um-file" aria-hidden="true">
            <span class="um-file__btn">Choose file</span>
            <span class="um-file__name" data-um="file-name">No file chosen</span>
          </div>
        </label> -->

        <div class="um-form__actions">
          <button type="reset" class="um-btn um-btn--ghost">Clear</button>
          <button type="submit" class="um-btn" data-um="btn-submit" id="create">Create user</button>
        </div>
      </form>
    </section>

  </div>
</section>



<script src="<?= $jsStoreHref ?>?v=<?= $jsStoreTime ?>" defer></script>
<script src="<?= $jsUIHref ?>?v=<?= $jsUITime ?>" defer></script>
