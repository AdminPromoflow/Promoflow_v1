/* =========================
   USER MANAGER — Store (DOM + FETCH + EVENTS)
   Events: READ, CREATE, UPDATE, DELETE

   Backend:
   Controller: ../../controller/promoflow/user.php
   Actions: createUser, updateUser, readUsers, deleteUsers
========================= */

const EVT = (window.EVT = window.EVT || Object.freeze({
  READ: "um:users:read",
  CREATE: "um:user:create",
  UPDATE: "um:user:update",
  DELETE: "um:user:delete",
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
    this.selStatus = document.querySelector('[data-um="field-status"]');
    this.fileAvatar = document.querySelector('[data-um="field-avatar"]');

    this.btnDelete = document.getElementById("delete");
    this.btnToggle = document.getElementById("toggle");

    this._bindEvents();
  }

  init(initialUsers = window.UM_USERS) {
    this._users = this._normalizeUsers(initialUsers);
    this._emit(EVT.READ, { users: this.getUsers() }); // demo render
    this.read(); // real backend
    return this.getUsers();
  }

  _bindEvents() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = this.hidId?.value ? Number(this.hidId.value) : null;

        this._verifyBeforeSave({ isCreate: !id })
          .then((v) => {
            if (!v?.ok) return alert(v?.error || "Validation error.");
            return id ? this.update(id, v.user) : this.create(v.user);
          })
          .catch((error) => console.error("FORM Error:", error));
      });
    }

    if (this.btnDelete) {
      this.btnDelete.addEventListener("click", () => {
        const id = this._getSelectedId();
        if (!id) return;

        const u = this._findById(id);
        if (!u) return alert("User not found.");

        const ok = confirm(`Delete user "${u.name}"? This action cannot be undone.`);
        if (!ok) return;

        this.delete(id);
      });
    }

    if (this.btnToggle) {
      this.btnToggle.addEventListener("click", () => {
        const id = this._getSelectedId();
        if (!id) return;

        const u = this._findById(id);
        if (!u) return alert("User not found.");

        const nextStatus = (String(u.status || "").toLowerCase() === "disabled") ? "active" : "disabled";
        this.toggleStatus(id, nextStatus);
      });
    }
  }

  /* =========================
     READ
  ========================= */
  read() {
    const url = "../../controller/promoflow/user.php";
    const data = { action: "readUsers" };

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Network error."))))
      .then((resp) => {
      //  alert(resp);
        // Backend puede devolver: [..] o {users:[..]}
        const list = Array.isArray(resp) ? resp : (Array.isArray(resp?.users) ? resp.users : []);
        this._users = this._normalizeUsers(list);
        this._emit(EVT.READ, { users: this.getUsers() });
        return this.getUsers();
      })
      .catch((error) => {
        console.error("READ Error:", error);
        return null;
      });
  }

  /* =========================
     CREATE
  ========================= */
  create(user) {
    const url = "../../controller/promoflow/user.php";
    const data = {
      action: "createUser",
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
      // ✅ Avatar: solo se envía si existe
      ...(user.avatarDataUrl ? { avatar: user.avatarDataUrl } : {}),
    };

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Network error."))))
      .then((resp) => {
        if (!resp?.success) {
          alert(resp?.message || "Create user failed.");
          return false;
        }

        return this.read().then(() => {
          const created = this._findByEmail(user.email);
          this._emit(EVT.CREATE, { success: true, users: this.getUsers(), user: created });
          return true;
        });
      })
      .catch((error) => {
        console.error("CREATE Error:", error);
        alert("Create user failed (network/server error).");
        return false;
      });
  }

  /* =========================
     UPDATE
  ========================= */
  update(idUser, user) {
    const url = "../../controller/promoflow/user.php";

    const data = {
      action: "updateUser",
      idUser: Number(idUser),

      // Se envían siempre
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,

      // ✅ Solo si no está vacío
      ...(String(user.password || "").trim() ? { password: user.password } : {}),

      // ✅ Solo si se eligió un archivo y se pudo convertir a base64
      ...(user.avatarDataUrl ? { avatar: user.avatarDataUrl } : {}),
    };

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Network error."))))
      .then((resp) => {
        alert(resp.message);
        if (resp?.success === false) {
          alert(resp?.message || "Update failed.");
          return false;
        }

        return this.read().then(() => {
          const updated = this._findById(idUser);
          this._emit(EVT.UPDATE, { success: true, users: this.getUsers(), user: updated });
          return true;
        });
      })
      .catch((error) => {
        console.error("UPDATE Error:", error);
        return false;
      });
  }

  /* =========================
     TOGGLE STATUS
  ========================= */
  toggleStatus(idUser, status) {
    const u = this._findById(idUser);
    if (!u) return Promise.resolve(false);

    const url = "../../controller/promoflow/user.php";
    const data = {
      action: "updateUser",
      idUser: Number(idUser),
      name: u.name,
      email: u.email,
      role: u.role,
      status: status,
      // ⚠️ NO mandamos password/avatar aquí (para no pisarlos)
    };

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Network error."))))
      .then((resp) => {
        if (resp?.success === false) {
          alert(resp?.message || "Toggle failed.");
          return false;
        }

        return this.read().then(() => {
          const updated = this._findById(idUser);
          this._emit(EVT.UPDATE, { success: true, users: this.getUsers(), user: updated });
          return true;
        });
      })
      .catch((error) => {
        console.error("TOGGLE Error:", error);
        return false;
      });
  }

  /* =========================
     DELETE
  ========================= */
  delete(idUser) {
    const url = "../../controller/promoflow/user.php";
    const data = { action: "deleteUsers", idUser: Number(idUser) };

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Network error."))))
      .then((resp) => {
        if (resp?.success === false) {
          alert(resp?.message || "Delete failed.");
          return false;
        }

        this._users = this._users.filter((u) => Number(u.id) !== Number(idUser));
        this._emit(EVT.DELETE, { deletedId: idUser, users: this.getUsers() });
        return true;
      })
      .catch((error) => {
        console.error("DELETE Error:", error);
        return false;
      });
  }

  /* =========================
     Validation (async por avatar)
  ========================= */
  _verifyBeforeSave({ isCreate = true } = {}) {
    const name = String(this.inName?.value ?? "").trim();
    const email = String(this.inEmail?.value ?? "").trim();
    const password = String(this.inPassword?.value ?? "").trim();
    const status = String(this.selStatus?.value ?? "invited").trim();

    const roles = this._getCheckedRoles();
    const role = roles.includes("Admin") ? "Admin" : roles.join(", ");

    if (!name || !email) return Promise.resolve({ ok: false, error: "Please enter name and email." });
    if (!roles.length) return Promise.resolve({ ok: false, error: "Please select at least one access role." });

    if (isCreate) {
      if (!password) return Promise.resolve({ ok: false, error: "Please enter a password." });
      if (password.length < 6) return Promise.resolve({ ok: false, error: "Password must be at least 6 characters." });
      if (this._emailExists(email)) return Promise.resolve({ ok: false, error: "That email already exists." });
    } else {
      if (password && password.length < 6) return Promise.resolve({ ok: false, error: "Password must be at least 6 characters." });
      const id = this.hidId?.value ? Number(this.hidId.value) : null;
      if (this._emailExists(email, id)) return Promise.resolve({ ok: false, error: "That email already exists." });
    }

    // ✅ Upload image (avatar):
    // - Si hay archivo: FileReader -> base64 DataURL -> avatarDataUrl
    // - Si NO hay archivo: avatarDataUrl = null (no se envía al backend)
    const file = this.fileAvatar?.files?.[0] || null;

    if (!file) {
      return Promise.resolve({ ok: true, user: { name, email, password, role, status, avatarDataUrl: null } });
    }

    return this._fileToDataURL(file)
      .then((avatarDataUrl) => ({ ok: true, user: { name, email, password, role, status, avatarDataUrl } }))
      .catch(() => ({ ok: false, error: "Avatar file could not be read." }));
  }

  _fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result || ""));
      fr.onerror = () => reject(new Error("File read error"));
      fr.readAsDataURL(file);
    });
  }

  /* =========================
     Helpers
  ========================= */
  getUsers() {
    return this._users.map((u) => {
      const { password, ...safe } = u;
      return { ...safe, roles: [...(safe.roles || [])] };
    });
  }

  _normalizeUsers(list) {
    const arr = Array.isArray(list) ? list : [];
    return arr.map((u) => {
      const id = Number(u.id ?? u.idUser ?? 0);
      const roleStr = String(u.role ?? "");
      const status = String(u.status ?? "invited");

      return {
        id,
        idUser: id,
        name: String(u.name ?? ""),
        email: String(u.email ?? ""),
        password: "", // nunca guardamos password desde backend
        status,
        role: roleStr,
        roles: this._roleStringToRolesArray(roleStr),

        // ✅ avatar puede venir como avatar (base64) o avatar_url
        img: String(u.avatar ?? u.avatar_url ?? u.img ?? ""),
      };
    });
  }

  _roleStringToRolesArray(roleStr) {
    const s = String(roleStr ?? "").trim();
    if (!s) return [];
    if (s === "Admin") return ["Admin"];
    return s.split(",").map((x) => x.trim()).filter(Boolean);
  }

  _getCheckedRoles() {
    const cbs = Array.from(this.form?.querySelectorAll('input[type="checkbox"][name="roles[]"]') || []);
    const checked = cbs.filter((cb) => cb.checked).map((cb) => cb.value);
    if (!checked.length) return [];
    return checked.includes("Admin") ? ["Admin"] : checked.filter((r) => r !== "Admin");
  }

  _emailExists(email, excludeId = null) {
    const em = String(email || "").toLowerCase();
    return this._users.some((u) => {
      if (excludeId != null && Number(u.id) === Number(excludeId)) return false;
      return String(u.email || "").toLowerCase() === em;
    });
  }

  _findById(id) {
    return this._users.find((u) => Number(u.id) === Number(id)) || null;
  }

  _findByEmail(email) {
    const em = String(email || "").toLowerCase();
    return this._users.find((u) => String(u.email || "").toLowerCase() === em) || null;
  }

  _getSelectedId() {
    const idStr = this.root?.dataset?.selectedId || "";
    const id = Number(idStr);
    return id ? id : null;
  }

  _emit(type, detail) {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

UMStore.EVENTS = EVT;
window.UMStoreClass = UMStore;
window.UMStore = window.UMStore || new UMStore(window.UM_USERS || []);
