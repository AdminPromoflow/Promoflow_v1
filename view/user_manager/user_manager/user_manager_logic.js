const EVT = (window.EVT = window.EVT || Object.freeze({
  READ: "um:users:read",
  CREATE: "um:user:create",
  UPDATE: "um:user:update",
  DELETE: "um:user:delete",
  BUSY: "um:busy",
  NOTICE: "um:notice",
}));

class UMStore {
  constructor(initialUsers = []) {
    this._users = this._normalizeUsers(initialUsers);
    this.root = document.querySelector("[data-um-root]");
    this.form = document.querySelector('[data-um="form"]');
    this.hidId = document.querySelector('[data-um="field-id"]');
    this.inName = document.querySelector('[data-um="field-name"]');
    this.inEmail = document.querySelector('[data-um="field-email"]');
    this.inPassword = document.querySelector('[data-um="field-password"]');
    this._bindEvents();
  }

  init() {
    return this.read();
  }

  _bindEvents() {
    this.form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const idUser = Number(this.hidId?.value || 0);
      const validation = this._verifyBeforeSave({ isCreate: !idUser });

      if (!validation.ok) {
        this._notify(validation.error, "error");
        return;
      }

      if (idUser) await this.update(idUser, validation.user);
      else await this.create(validation.user);
    });

    document.querySelector('[data-um="btn-delete"]')?.addEventListener("click", async () => {
      const idUser = this._getSelectedId();
      const user = this._findById(idUser);
      if (!user) return;

      if (!window.confirm(`Delete user "${user.name}"? This action cannot be undone.`)) return;
      await this.delete(idUser);
    });
  }

  async _request(action, payload = {}) {
    const response = await fetch("../../controller/promoflow/user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });

    const raw = await response.text();
    let data;

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (_error) {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok || data?.success === false) {
      throw new Error(data?.message || "The request could not be completed.");
    }

    return data;
  }

  async read({ emit = true } = {}) {
    this._setBusy(true);
    try {
      const response = await this._request("readUsers");
      const list = Array.isArray(response) ? response : response?.users;
      this._users = this._normalizeUsers(list);
      if (emit) this._emit(EVT.READ, { users: this.getUsers() });
      return this.getUsers();
    } catch (error) {
      this._notify(error.message || "Users could not be loaded.", "error");
      this._emit(EVT.READ, { users: [] });
      return [];
    } finally {
      this._setBusy(false);
    }
  }

  async create(user) {
    this._setBusy(true);
    try {
      const response = await this._request("createUser", user);
      await this.read({ emit: false });
      const created = response?.user ? this._normalizeUsers([response.user])[0] : this._findByEmail(user.email);
      this._emit(EVT.CREATE, { users: this.getUsers(), user: created });
      this._notify("User created successfully.", "success");
      return true;
    } catch (error) {
      this._notify(error.message || "User could not be created.", "error");
      return false;
    } finally {
      this._setBusy(false);
    }
  }

  async update(idUser, user) {
    this._setBusy(true);
    try {
      const response = await this._request("updateUser", { idUser, ...user });
      await this.read({ emit: false });
      const updated = response?.user ? this._normalizeUsers([response.user])[0] : this._findById(idUser);
      this._emit(EVT.UPDATE, { users: this.getUsers(), user: updated });
      this._notify("User updated successfully.", "success");
      return true;
    } catch (error) {
      this._notify(error.message || "User could not be updated.", "error");
      return false;
    } finally {
      this._setBusy(false);
    }
  }

  async delete(idUser) {
    this._setBusy(true);
    try {
      await this._request("deleteUsers", { idUser });
      this._users = this._users.filter((user) => Number(user.id) !== Number(idUser));
      this._emit(EVT.DELETE, { deletedId: idUser, users: this.getUsers() });
      this._notify("User deleted successfully.", "success");
      return true;
    } catch (error) {
      this._notify(error.message || "User could not be deleted.", "error");
      return false;
    } finally {
      this._setBusy(false);
    }
  }

  _verifyBeforeSave({ isCreate }) {
    const name = String(this.inName?.value || "").trim();
    const email = String(this.inEmail?.value || "").trim().toLowerCase();
    const password = String(this.inPassword?.value || "");
    const roles = this._getCheckedRoles();
    const role = roles.includes("Admin") ? "Admin" : roles.join(", ");

    if (name.length < 2 || name.length > 50) {
      return { ok: false, error: "Full name must contain between 2 and 50 characters." };
    }

    if (!email || email.length > 50 || !this.inEmail?.checkValidity()) {
      return { ok: false, error: "Enter a valid email address (maximum 50 characters)." };
    }

    if (!roles.length) return { ok: false, error: "Select at least one access role." };
    if (role.length > 50) return { ok: false, error: "The selected access roles exceed the allowed length." };

    if (isCreate && password.length < 6) {
      return { ok: false, error: "Password must contain at least 6 characters." };
    }

    if (!isCreate && password && password.length < 6) {
      return { ok: false, error: "A new password must contain at least 6 characters." };
    }

    const currentId = Number(this.hidId?.value || 0);
    if (this._emailExists(email, currentId || null)) {
      return { ok: false, error: "That email address is already in use." };
    }

    return { ok: true, user: { name, email, password, role } };
  }

  getUsers() {
    return this._users.map((user) => ({ ...user, roles: [...user.roles] }));
  }

  _normalizeUsers(list) {
    return (Array.isArray(list) ? list : []).map((user) => {
      const id = Number(user.id ?? user.idUser ?? 0);
      const role = String(user.role ?? "");
      return {
        id,
        idUser: id,
        name: String(user.name ?? ""),
        email: String(user.email ?? ""),
        role,
        roles: this._roleStringToRolesArray(role),
        img: String(user.imageURL ?? user.avatar ?? user.avatar_url ?? user.img ?? ""),
      };
    });
  }

  _roleStringToRolesArray(role) {
    const value = String(role || "").trim();
    if (!value) return [];
    if (value === "Admin") return ["Admin"];
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  _getCheckedRoles() {
    const checked = Array.from(this.form?.querySelectorAll('input[name="roles[]"]:checked') || [])
      .map((input) => input.value);
    return checked.includes("Admin") ? ["Admin"] : checked;
  }

  _emailExists(email, excludeId = null) {
    const normalized = String(email).toLowerCase();
    return this._users.some((user) => {
      if (excludeId && Number(user.id) === Number(excludeId)) return false;
      return user.email.toLowerCase() === normalized;
    });
  }

  _findById(idUser) {
    return this._users.find((user) => Number(user.id) === Number(idUser)) || null;
  }

  _findByEmail(email) {
    const normalized = String(email).toLowerCase();
    return this._users.find((user) => user.email.toLowerCase() === normalized) || null;
  }

  _getSelectedId() {
    const idUser = Number(this.root?.dataset.selectedId || 0);
    return idUser || null;
  }

  _setBusy(isBusy) {
    this._emit(EVT.BUSY, { isBusy });
  }

  _notify(message, type = "info") {
    this._emit(EVT.NOTICE, { message, type });
  }

  _emit(type, detail) {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

UMStore.EVENTS = EVT;
window.UMStoreClass = UMStore;
window.UMStore = window.UMStore || new UMStore(window.UM_USERS || []);
