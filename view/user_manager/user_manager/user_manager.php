<?php
$cssHref = '../../view/user_manager/user_manager/user_manager.css';
$jsStoreHref = '../../view/user_manager/user_manager/user_manager_logic.js';
$jsUIHref = '../../view/user_manager/user_manager/user_manager.js';
$cssFile = __DIR__ . '/user_manager.css';
$jsStoreFile = __DIR__ . '/user_manager_logic.js';
$jsUIFile = __DIR__ . '/user_manager.js';
?>

<link rel="stylesheet" href="<?= $cssHref ?>?v=<?= filemtime($cssFile) ?>">

<section class="um" data-um-root>
  <div class="um-notice" data-um="notice" role="status" aria-live="polite" hidden></div>

  <div class="um-layout">
    <section class="um-panel um-panel-scroll" aria-labelledby="users-list-title">
      <div class="um-header">
        <div>
          <div class="um-title-row">
            <h2 class="um-header__title" id="users-list-title">Users</h2>
            <span class="um-count" data-um="count">0 users</span>
          </div>
          <p class="um-header__sub">Select a user to view details or edit access.</p>
        </div>

        <label class="um-search">
          <span class="sr-only">Search users</span>
          <input data-um="search" type="search" placeholder="Search by name, email or access..." autocomplete="off">
          <span class="um-search__icon" aria-hidden="true"></span>
        </label>
      </div>

      <div class="um-grid">
        <div class="um-grid__head" aria-hidden="true">
          <div class="um-grid__th">Full Name</div>
          <div class="um-grid__th">Access</div>
          <div class="um-grid__th">Email Address</div>
        </div>
        <div class="um-grid__body" data-um="grid" aria-label="Users list"></div>
      </div>
    </section>

    <aside class="um-panel um-panel--details is-empty" data-um="details" aria-labelledby="user-details-title">
      <div class="um-details__top">
        <h2 class="um-details__title" id="user-details-title">User Details</h2>
        <span class="um-badge" data-um="badge-access">—</span>
      </div>

      <div class="um-profile">
        <div class="um-profile__avatar" data-um="detail-avatar" aria-hidden="true"></div>
        <div class="um-profile__name" data-um="detail-name">Select a user</div>
        <div class="um-profile__email" data-um="detail-email-small">Click on a row to load details.</div>
      </div>

      <div class="um-cards">
        <div class="um-card">
          <div class="um-card__icon" aria-hidden="true">@</div>
          <div class="um-card__text">
            <h3>Email Address</h3>
            <p data-um="detail-email">—</p>
          </div>
        </div>

        <div class="um-card">
          <div class="um-card__icon" aria-hidden="true">#</div>
          <div class="um-card__text">
            <h3>User ID</h3>
            <p data-um="detail-id">—</p>
          </div>
        </div>

        <div class="um-card">
          <div class="um-card__icon" aria-hidden="true">✓</div>
          <div class="um-card__text">
            <h3>Access</h3>
            <p data-um="detail-roles">—</p>
          </div>
        </div>
      </div>

      <div class="um-actions">
        <button type="button" class="um-btn" data-um="btn-edit" disabled>Edit user</button>
        <button type="button" class="um-btn um-btn--danger" data-um="btn-delete" disabled>Delete user</button>
      </div>
    </aside>

    <section class="um-panel um-panel--add" data-um="add-section" aria-labelledby="user-form-title">
      <header class="um-add__header">
        <h2 id="user-form-title" data-um="add-title">Add user</h2>
        <p data-um="add-desc">Create a new user and assign platform access.</p>
      </header>

      <form class="um-form" data-um="form">
        <input type="hidden" name="id" data-um="field-id" value="">

        <label class="um-field">
          <span>Full name</span>
          <input type="text" name="name" data-um="field-name" placeholder="e.g. Pepito Pérez" maxlength="50" autocomplete="name" required>
        </label>

        <label class="um-field">
          <span>Email</span>
          <input type="email" name="email" data-um="field-email" placeholder="e.g. pepito@company.com" maxlength="50" autocomplete="email" required>
        </label>

        <label class="um-field um-field--full">
          <span>Password</span>
          <input type="password" name="password" data-um="field-password" placeholder="At least 6 characters" minlength="6" autocomplete="new-password">
          <small data-um="password-hint">Required when creating a user.</small>
        </label>

        <fieldset class="um-field um-field--full">
          <legend>Access (roles)</legend>
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
        </fieldset>

        <div class="um-form__actions">
          <button type="reset" class="um-btn um-btn--ghost">Cancel / clear</button>
          <button type="submit" class="um-btn um-btn--primary" data-um="btn-submit">Create user</button>
        </div>
      </form>
    </section>
  </div>
</section>

<script src="<?= $jsStoreHref ?>?v=<?= filemtime($jsStoreFile) ?>" defer></script>
<script src="<?= $jsUIHref ?>?v=<?= filemtime($jsUIFile) ?>" defer></script>
