/* =========================
   USER MANAGER — UI
========================= */

class UserManagerUI {
  constructor(root, store) {
    this.root = root;
    this.store = store;

    this.users = [];
    this.selectedId = null;
    this.editingId = null;

    this.els = this._cacheEls();
    if (!this.els.grid || !this.els.form) return;
  }

  init() {
    this._bindStoreEvents();
    this._bindUIEvents();

    this._setEditMode(false);
    this._syncAdminCheckbox();
    this._updateFileName();

    this.store.init();
  }

  _safeStr(v) { return (v == null) ? "" : String(v); }

  _normalizeRoles(r) {
    if (Array.isArray(r)) return r.map(x => this._safeStr(x)).filter(Boolean);
    if (typeof r === "string" && r.trim()) return [r.trim()];
    return [];
  }

  statusLabel(s) {
    if (s === "active") return "Active";
    if (s === "invited") return "Invited";
    if (s === "disabled") return "Disabled";
    return "—";
  }

  rolesPretty(rolesArr) {
    const roles = this._normalizeRoles(rolesArr);
    if (!roles.length) return "—";
    if (roles.includes("Admin")) return "Admin (all access)";
    return roles.join(", ");
  }

  rolesCompact(rolesArr) {
    const roles = this._normalizeRoles(rolesArr);
    if (!roles.length) return "—";
    if (roles.includes("Admin")) return "Admin";
    if (roles.length <= 2) return roles.join(", ");
    return `${roles[0]}, ${roles[1]} +${roles.length - 2}`;
  }

  _cacheEls() {
    const q = (sel) => this.root.querySelector(sel);
    return {
      grid: q('[data-um="grid"]'),
      search: q('[data-um="search"]'),

      detailsContainer: q('[data-um="details"]'),
      fullName: q('[data-um="detail-name"]'),
      email: q('[data-um="detail-email"]'),
      emailSmall: q('[data-um="detail-email-small"]'),
      avatar: q('[data-um="detail-avatar"]'),
      statusBadge: q('[data-um="badge-status"]'),
      accessBadge: q('[data-um="badge-access"]'),
      rolesText: q('[data-um="detail-roles"]'),

      btnEdit: q('[data-um="btn-edit"]'),
      btnToggle: q('[data-um="btn-toggle"]'),
      btnDelete: q('[data-um="btn-delete"]'),

      sectionAdd: q('[data-um="add-section"]'),
      titleEl: q('[data-um="add-title"]'),
      descEl: q('[data-um="add-desc"]'),
      btnSubmit: q('[data-um="btn-submit"]'),

      form: q('[data-um="form"]'),
      hidId: q('[data-um="field-id"]'),
      inName: q('[data-um="field-name"]'),
      inEmail: q('[data-um="field-email"]'),
      inPassword: q('[data-um="field-password"]'),
      selStatus: q('[data-um="field-status"]'),
      fileInput: q('[data-um="field-avatar"]'),

      rolesHint: q('[data-um="roles-hint"]'),
      fileNameOut: q('[data-um="file-name"]'),
    };
  }

  _bindStoreEvents() {
    const EVT = this.store.constructor.EVENTS || window.EVT;

    window.addEventListener(EVT.READ, (e) => {
      this.users = Array.isArray(e.detail?.users) ? e.detail.users : [];
      this._render(this._getFilteredUsers());

      const keep = this._findById(this.selectedId);
      if (keep) this._showUserDetails(keep);
      else if (this.users[0]) this._showUserDetails(this.users[0]);
      else this._clearDetails();
    });

    window.addEventListener(EVT.CREATE, (e) => {
      if (Array.isArray(e.detail?.users)) this.users = e.detail.users;
      this._render(this._getFilteredUsers());

      const created = e.detail?.user || null;
      if (created) this._showUserDetails(created);

      this.els.form.reset();
      this._setEditMode(false);
    });

    window.addEventListener(EVT.UPDATE, (e) => {
      if (Array.isArray(e.detail?.users)) this.users = e.detail.users;
      this._render(this._getFilteredUsers());

      const updated = e.detail?.user || null;
      if (updated) this._showUserDetails(updated);

      this.els.form.reset();
      this._setEditMode(false);
    });

    window.addEventListener(EVT.DELETE, (e) => {
      if (Array.isArray(e.detail?.users)) this.users = e.detail.users;

      const deletedId = Number(e.detail?.deletedId);
      if (Number(this.selectedId) === deletedId) this.selectedId = null;

      this._render(this._getFilteredUsers());

      const keep = this._findById(this.selectedId);
      if (keep) this._showUserDetails(keep);
      else if (this.users[0]) this._showUserDetails(this.users[0]);
      else this._clearDetails();

      if (this.editingId && Number(this.editingId) === deletedId) {
        this.els.form.reset();
        this._setEditMode(false);
      }
    });
  }

  _bindUIEvents() {
    const { grid, search, btnEdit, form } = this.els;

    grid.addEventListener("click", (e) => {
      const row = e.target.closest(".um-row");
      if (!row) return;
      const id = Number(row.dataset.id);
      const u = this._findById(id);
      if (u) this._showUserDetails(u);
    });

    if (search) {
      search.addEventListener("input", () => this._render(this._getFilteredUsers()));
    }

    btnEdit && btnEdit.addEventListener("click", () => {
      const u = this._getSelectedUser();
      if (!u) return;
      this._fillFormFromUser(u);
    });

    form.addEventListener("change", (e) => {
      const t = e.target;
      if (t && t.matches('input[type="checkbox"][name="roles[]"]')) this._syncAdminCheckbox();
      if (t && t.matches('input[type="file"][name="avatar"]')) this._updateFileName();
    });

    form.addEventListener("reset", () => {
      setTimeout(() => {
        this._resetRolesUI();
        this._updateFileName();
        this._setEditMode(false);
        if (this.els.inPassword) this.els.inPassword.value = "";
      }, 0);
    });
  }

  _render(list) {
    const { grid } = this.els;
    grid.innerHTML = "";

    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "um-row";
      empty.style.cursor = "default";

      const cell = document.createElement("div");
      cell.className = "um-cell";
      cell.style.gridColumn = "1 / -1";
      cell.style.opacity = ".85";
      cell.textContent = "No users found.";

      empty.appendChild(cell);
      grid.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();

    list.forEach((u) => {
      const row = document.createElement("div");
      row.className = "um-row";
      row.dataset.id = String(u.id);
      if (Number(u.id) === Number(this.selectedId)) row.classList.add("is-selected");

      const c1 = document.createElement("div");
      c1.className = "um-cell";
      c1.dataset.col = "name";

      const wrap = document.createElement("div");
      wrap.className = "um-user";

      const av = document.createElement("div");
      av.className = "um-user__avatar";
      if (u.img) {
        av.style.backgroundImage = `url('${u.img}')`;
        av.textContent = "";
      } else {
        av.style.backgroundImage = "";
        av.textContent = (u.name?.trim()?.slice(0, 1).toUpperCase() || "U");
      }

      const meta = document.createElement("div");
      meta.className = "um-user__meta";

      const strong = document.createElement("strong");
      strong.textContent = u.name || "—";

      const small = document.createElement("small");
      small.textContent = this.statusLabel(u.status);

      meta.appendChild(strong);
      meta.appendChild(small);

      wrap.appendChild(av);
      wrap.appendChild(meta);
      c1.appendChild(wrap);

      const c2 = document.createElement("div");
      c2.className = "um-cell";
      c2.dataset.col = "access";
      c2.textContent = this.rolesCompact(u.roles);

      const c3 = document.createElement("div");
      c3.className = "um-cell";
      c3.dataset.col = "email";
      c3.textContent = u.email || "—";

      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);

      frag.appendChild(row);
    });

    grid.appendChild(frag);
  }

  _setDetailsEnabled(enabled) {
    const { btnEdit, btnToggle, btnDelete } = this.els;
    btnEdit && (btnEdit.disabled = !enabled);
    btnToggle && (btnToggle.disabled = !enabled);
    btnDelete && (btnDelete.disabled = !enabled);
  }

  _showUserDetails(u) {
    const {
      detailsContainer, statusBadge, accessBadge,
      fullName, email, emailSmall, rolesText,
      avatar, btnToggle
    } = this.els;

    this.selectedId = u.id;
    this.root.dataset.selectedId = String(u.id);

    detailsContainer && detailsContainer.classList.remove("is-empty");
    statusBadge && (statusBadge.textContent = this.statusLabel(u.status));
    accessBadge && (accessBadge.textContent = this.rolesCompact(u.roles));
    fullName && (fullName.textContent = u.name || "—");
    email && (email.textContent = u.email || "—");
    emailSmall && (emailSmall.textContent = u.email || "—");
    rolesText && (rolesText.textContent = this.rolesPretty(u.roles));

    if (avatar) {
      avatar.style.backgroundImage = u.img ? `url('${u.img}')` : "";
      avatar.textContent = "";
      avatar.style.display = "";
      avatar.style.placeItems = "";
      avatar.style.fontWeight = "";
      avatar.style.color = "";

      if (!u.img) {
        const initials = (u.name?.trim()?.slice(0, 1).toUpperCase() || "U");
        avatar.style.display = "grid";
        avatar.style.placeItems = "center";
        avatar.style.fontWeight = "880";
        avatar.style.color = "rgba(255,255,255,.92)";
        avatar.textContent = initials;
      }
    }

    this._setDetailsEnabled(true);
    btnToggle && (btnToggle.textContent = (String(u.status).toLowerCase() === "disabled") ? "Enable" : "Disable");
    this._render(this._getFilteredUsers());
  }

  _clearDetails() {
    const {
      detailsContainer, statusBadge, accessBadge,
      fullName, email, emailSmall, rolesText, avatar
    } = this.els;

    this.selectedId = null;
    delete this.root.dataset.selectedId;

    detailsContainer && detailsContainer.classList.add("is-empty");
    statusBadge && (statusBadge.textContent = "—");
    accessBadge && (accessBadge.textContent = "—");
    fullName && (fullName.textContent = "Select a user");
    email && (email.textContent = "—");
    emailSmall && (emailSmall.textContent = "Click on a row to load details.");
    rolesText && (rolesText.textContent = "—");

    if (avatar) {
      avatar.style.backgroundImage = "";
      avatar.textContent = "";
    }

    this._setDetailsEnabled(false);
  }

  _setEditMode(on, user = null) {
    const { hidId, titleEl, descEl, btnSubmit, sectionAdd } = this.els;

    this.editingId = (on && user) ? Number(user.id) : null;
    hidId && (hidId.value = this.editingId ? String(this.editingId) : "");

    titleEl && (titleEl.textContent = this.editingId ? "Update user" : "Add user");
    descEl && (descEl.textContent = this.editingId
      ? "Update an existing user and assign platform access."
      : "Create a new user and assign platform access."
    );
    btnSubmit && (btnSubmit.textContent = this.editingId ? "Update user" : "Create user");
    sectionAdd && sectionAdd.classList.toggle("is-editing", !!this.editingId);
  }

  _scrollToAddSection() {
    const { sectionAdd, inName } = this.els;
    if (!sectionAdd) return;
    sectionAdd.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { inName && inName.focus(); }, 350);
  }

  _fillFormFromUser(u) {
    const { inName, inEmail, selStatus, fileInput, inPassword } = this.els;

    inName && (inName.value = u.name || "");
    inEmail && (inEmail.value = u.email || "");
    selStatus && (selStatus.value = u.status || "invited");

    this._setRolesCheckboxes(u.roles);

    if (fileInput) fileInput.value = "";
    this._updateFileName();

    if (inPassword) inPassword.value = "";

    this._setEditMode(true, u);
    this._scrollToAddSection();
  }

  _getFilteredUsers() {
    const q = (this.els.search?.value || "").trim().toLowerCase();
    if (!q) return [...this.users];

    return this.users.filter(u => {
      const hay = `${u.name || ""} ${u.email || ""} ${u.status || ""} ${this.rolesPretty(u.roles)}`.toLowerCase();
      return hay.includes(q);
    });
  }

  _findById(id) { return this.users.find(u => Number(u.id) === Number(id)) || null; }
  _getSelectedUser() { return this._findById(this.selectedId); }

  _getRoleCheckboxes() {
    return Array.from(this.els.form?.querySelectorAll('input[type="checkbox"][name="roles[]"]') || []);
  }

  _setRolesCheckboxes(rolesArr) {
    const roles = this._normalizeRoles(rolesArr);
    const cbs = this._getRoleCheckboxes();

    cbs.forEach(cb => { cb.checked = false; cb.disabled = false; });

    const adminCb = cbs.find(cb => cb.value === "Admin");
    if (roles.includes("Admin") && adminCb) {
      adminCb.checked = true;
    } else {
      roles.forEach(r => {
        const cb = cbs.find(x => x.value === r);
        if (cb) cb.checked = true;
      });
    }
    this._syncAdminCheckbox();
  }

  _syncAdminCheckbox() {
    const { rolesHint } = this.els;

    const cbs = this._getRoleCheckboxes();
    const admin = cbs.find(cb => cb.value === "Admin");
    const others = cbs.filter(cb => cb.value !== "Admin");
    if (!admin) return;

    if (admin.checked) {
      others.forEach(cb => { cb.checked = true; cb.disabled = true; });
      if (rolesHint) {
        rolesHint.textContent = "Admin selected: full access enabled.";
        rolesHint.classList.add("is-ok");
      }
    } else {
      others.forEach(cb => { cb.disabled = false; });
      if (rolesHint) {
        rolesHint.textContent = "";
        rolesHint.classList.remove("is-ok");
      }
    }
  }

  _resetRolesUI() {
    const { rolesHint, fileInput } = this.els;
    this._getRoleCheckboxes().forEach(cb => { cb.disabled = false; cb.checked = false; });
    if (rolesHint) {
      rolesHint.textContent = "";
      rolesHint.classList.remove("is-ok");
    }
    if (fileInput) fileInput.value = "";
  }

  _updateFileName() {
    const { fileInput, fileNameOut } = this.els;
    if (!fileInput || !fileNameOut) return;
    const file = fileInput.files && fileInput.files[0];
    fileNameOut.textContent = file ? file.name : "No file chosen";
  }

  static boot() {
    const root = document.querySelector("[data-um-root]");
    if (!root) return null;

    if (!window.UMStore && window.UMStoreClass) {
      window.UMStore = new window.UMStoreClass(window.UM_USERS || []);
    }

    if (!window.UMStore) {
      console.error("UMStore not found. Load user_manager_logic.js before user_manager.js");
      return null;
    }

    const ui = new UserManagerUI(root, window.UMStore);
    ui.init();
    window.UserManagerUI = ui;
    return ui;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  UserManagerUI.boot();
});
