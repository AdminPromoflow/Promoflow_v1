class UserManagerUI {
  constructor(root, store) {
    this.root = root;
    this.store = store;
    this.users = [];
    this.selectedId = null;
    this.editingId = null;
    this.noticeTimer = null;
    this.els = this._cacheElements();
  }

  init() {
    if (!this.els.grid || !this.els.form) return;
    this._bindStoreEvents();
    this._bindUIEvents();
    this._setEditMode(false);
    this._syncAdminCheckbox();
    this._clearDetails();
    this.store.init();
  }

  _cacheElements() {
    const query = (selector) => this.root.querySelector(selector);
    return {
      grid: query('[data-um="grid"]'),
      search: query('[data-um="search"]'),
      count: query('[data-um="count"]'),
      notice: query('[data-um="notice"]'),
      details: query('[data-um="details"]'),
      detailName: query('[data-um="detail-name"]'),
      detailEmail: query('[data-um="detail-email"]'),
      detailEmailSmall: query('[data-um="detail-email-small"]'),
      detailId: query('[data-um="detail-id"]'),
      detailAvatar: query('[data-um="detail-avatar"]'),
      detailRoles: query('[data-um="detail-roles"]'),
      accessBadge: query('[data-um="badge-access"]'),
      btnEdit: query('[data-um="btn-edit"]'),
      btnDelete: query('[data-um="btn-delete"]'),
      sectionAdd: query('[data-um="add-section"]'),
      title: query('[data-um="add-title"]'),
      description: query('[data-um="add-desc"]'),
      form: query('[data-um="form"]'),
      fieldId: query('[data-um="field-id"]'),
      fieldName: query('[data-um="field-name"]'),
      fieldEmail: query('[data-um="field-email"]'),
      fieldPassword: query('[data-um="field-password"]'),
      passwordHint: query('[data-um="password-hint"]'),
      rolesHint: query('[data-um="roles-hint"]'),
      btnSubmit: query('[data-um="btn-submit"]'),
    };
  }

  _bindStoreEvents() {
    const events = this.store.constructor.EVENTS;

    window.addEventListener(events.READ, (event) => this._replaceUsers(event.detail?.users));
    window.addEventListener(events.CREATE, (event) => {
      this._replaceUsers(event.detail?.users, event.detail?.user?.id);
      this.els.form.reset();
      this._setEditMode(false);
    });
    window.addEventListener(events.UPDATE, (event) => {
      this._replaceUsers(event.detail?.users, event.detail?.user?.id);
      this.els.form.reset();
      this._setEditMode(false);
    });
    window.addEventListener(events.DELETE, (event) => {
      if (Number(this.selectedId) === Number(event.detail?.deletedId)) this.selectedId = null;
      this._replaceUsers(event.detail?.users);
      this.els.form.reset();
      this._setEditMode(false);
    });
    window.addEventListener(events.BUSY, (event) => this._setBusy(Boolean(event.detail?.isBusy)));
    window.addEventListener(events.NOTICE, (event) => {
      this._showNotice(event.detail?.message || "", event.detail?.type || "info");
    });
  }

  _bindUIEvents() {
    this.els.grid.addEventListener("click", (event) => {
      const row = event.target.closest(".um-row[data-id]");
      if (row) this._selectUser(Number(row.dataset.id));
    });

    this.els.grid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const row = event.target.closest(".um-row[data-id]");
      if (!row) return;
      event.preventDefault();
      this._selectUser(Number(row.dataset.id));
    });

    this.els.search?.addEventListener("input", () => this._renderUsers());
    this.els.btnEdit?.addEventListener("click", () => {
      const user = this._findById(this.selectedId);
      if (user) this._fillForm(user);
    });

    this.els.form.addEventListener("change", (event) => {
      if (event.target.matches('input[name="roles[]"]')) this._syncAdminCheckbox();
    });

    this.els.form.addEventListener("reset", () => {
      window.setTimeout(() => {
        this._setEditMode(false);
        this._syncAdminCheckbox();
      }, 0);
    });
  }

  _replaceUsers(users, preferredId = null) {
    this.users = Array.isArray(users) ? users : [];
    const desired = this._findById(preferredId || this.selectedId) || this.users[0] || null;
    if (desired) this._showDetails(desired);
    else this._clearDetails();
    this._renderUsers();
  }

  _renderUsers() {
    const list = this._filteredUsers();
    this.els.grid.replaceChildren();

    if (this.els.count) {
      this.els.count.textContent = list.length === this.users.length
        ? `${this.users.length} ${this.users.length === 1 ? "user" : "users"}`
        : `${list.length} of ${this.users.length}`;
    }

    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "um-row";
      const cell = document.createElement("div");
      cell.className = "um-cell";
      cell.style.gridColumn = "1 / -1";
      cell.textContent = this.users.length ? "No users match your search." : "No users have been created yet.";
      empty.appendChild(cell);
      this.els.grid.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    list.forEach((user) => fragment.appendChild(this._createUserRow(user)));
    this.els.grid.appendChild(fragment);
  }

  _createUserRow(user) {
    const row = document.createElement("div");
    row.className = "um-row";
    row.dataset.id = String(user.id);
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `View ${user.name}`);
    if (Number(user.id) === Number(this.selectedId)) row.classList.add("is-selected");

    const nameCell = document.createElement("div");
    nameCell.className = "um-cell";
    nameCell.dataset.col = "name";
    const userWrap = document.createElement("div");
    userWrap.className = "um-user";
    const avatar = document.createElement("div");
    avatar.className = "um-user__avatar";
    avatar.textContent = this._initials(user.name);
    const meta = document.createElement("div");
    meta.className = "um-user__meta";
    const name = document.createElement("strong");
    name.textContent = user.name || "—";
    const id = document.createElement("small");
    id.textContent = `User #${user.id}`;
    meta.append(name, id);
    userWrap.append(avatar, meta);
    nameCell.appendChild(userWrap);

    const accessCell = document.createElement("div");
    accessCell.className = "um-cell";
    accessCell.dataset.col = "access";
    accessCell.textContent = this._rolesCompact(user.roles);

    const emailCell = document.createElement("div");
    emailCell.className = "um-cell";
    emailCell.dataset.col = "email";
    emailCell.textContent = user.email || "—";

    row.append(nameCell, accessCell, emailCell);
    return row;
  }

  _selectUser(idUser) {
    const user = this._findById(idUser);
    if (!user) return;
    this._showDetails(user);
    this._renderUsers();
  }

  _showDetails(user) {
    this.selectedId = Number(user.id);
    this.root.dataset.selectedId = String(user.id);
    this.els.details?.classList.remove("is-empty");
    this.els.detailName.textContent = user.name || "—";
    this.els.detailEmail.textContent = user.email || "—";
    this.els.detailEmailSmall.textContent = user.email || "—";
    this.els.detailId.textContent = String(user.id);
    this.els.detailRoles.textContent = this._rolesPretty(user.roles);
    this.els.accessBadge.textContent = this._rolesCompact(user.roles);
    this.els.detailAvatar.textContent = this._initials(user.name);
    this.els.btnEdit.disabled = false;
    this.els.btnDelete.disabled = false;
  }

  _clearDetails() {
    this.selectedId = null;
    delete this.root.dataset.selectedId;
    this.els.details?.classList.add("is-empty");
    this.els.detailName.textContent = "Select a user";
    this.els.detailEmail.textContent = "—";
    this.els.detailEmailSmall.textContent = "Click on a row to load details.";
    this.els.detailId.textContent = "—";
    this.els.detailRoles.textContent = "—";
    this.els.accessBadge.textContent = "—";
    this.els.detailAvatar.textContent = "";
    this.els.btnEdit.disabled = true;
    this.els.btnDelete.disabled = true;
  }

  _fillForm(user) {
    this.els.fieldName.value = user.name;
    this.els.fieldEmail.value = user.email;
    this.els.fieldPassword.value = "";
    this._setRoleCheckboxes(user.roles);
    this._setEditMode(true, user);
    this.els.sectionAdd.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => this.els.fieldName.focus(), 300);
  }

  _setEditMode(isEditing, user = null) {
    this.editingId = isEditing && user ? Number(user.id) : null;
    this.els.fieldId.value = this.editingId ? String(this.editingId) : "";
    this.els.title.textContent = this.editingId ? "Edit user" : "Add user";
    this.els.description.textContent = this.editingId
      ? "Update profile details or platform access."
      : "Create a new user and assign platform access.";
    this.els.btnSubmit.textContent = this.editingId ? "Save changes" : "Create user";
    this.els.btnSubmit.classList.add("um-btn--primary");
    if (this.els.passwordHint) {
      this.els.passwordHint.textContent = this.editingId
        ? "Leave blank to keep the current password."
        : "Use at least 6 characters.";
    }
  }

  _setRoleCheckboxes(roles) {
    const values = Array.isArray(roles) ? roles : [];
    this._roleCheckboxes().forEach((checkbox) => {
      checkbox.disabled = false;
      checkbox.checked = values.includes(checkbox.value);
    });
    this._syncAdminCheckbox();
  }

  _syncAdminCheckbox() {
    const checkboxes = this._roleCheckboxes();
    const admin = checkboxes.find((checkbox) => checkbox.value === "Admin");
    if (!admin) return;
    const others = checkboxes.filter((checkbox) => checkbox !== admin);

    others.forEach((checkbox) => {
      checkbox.disabled = admin.checked;
      if (admin.checked) checkbox.checked = true;
    });

    if (this.els.rolesHint) {
      this.els.rolesHint.textContent = admin.checked ? "Admin selected: all platform access is enabled." : "";
      this.els.rolesHint.classList.toggle("is-ok", admin.checked);
    }
  }

  _setBusy(isBusy) {
    this.root.classList.toggle("is-busy", isBusy);
    this.els.btnSubmit.disabled = isBusy;
    if (isBusy) this.els.btnSubmit.setAttribute("aria-busy", "true");
    else this.els.btnSubmit.removeAttribute("aria-busy");
  }

  _showNotice(message, type) {
    if (!this.els.notice || !message) return;
    window.clearTimeout(this.noticeTimer);
    this.els.notice.textContent = message;
    this.els.notice.className = `um-notice is-${type}`;
    this.els.notice.hidden = false;
    this.noticeTimer = window.setTimeout(() => {
      this.els.notice.hidden = true;
    }, type === "error" ? 7000 : 4000);
  }

  _filteredUsers() {
    const query = String(this.els.search?.value || "").trim().toLowerCase();
    if (!query) return [...this.users];
    return this.users.filter((user) => {
      return `${user.name} ${user.email} ${this._rolesPretty(user.roles)}`.toLowerCase().includes(query);
    });
  }

  _roleCheckboxes() {
    return Array.from(this.els.form.querySelectorAll('input[name="roles[]"]'));
  }

  _findById(idUser) {
    return this.users.find((user) => Number(user.id) === Number(idUser)) || null;
  }

  _rolesPretty(roles) {
    if (!Array.isArray(roles) || !roles.length) return "No access";
    return roles.includes("Admin") ? "Admin (all access)" : roles.join(", ");
  }

  _rolesCompact(roles) {
    if (!Array.isArray(roles) || !roles.length) return "No access";
    if (roles.includes("Admin")) return "Admin";
    return roles.length > 2 ? `${roles[0]}, ${roles[1]} +${roles.length - 2}` : roles.join(", ");
  }

  _initials(name) {
    const parts = String(name || "User").trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "U";
  }

  static boot() {
    const root = document.querySelector("[data-um-root]");
    if (!root || !window.UMStore) return null;
    const ui = new UserManagerUI(root, window.UMStore);
    ui.init();
    window.UserManagerUI = ui;
    return ui;
  }
}

document.addEventListener("DOMContentLoaded", () => UserManagerUI.boot());
