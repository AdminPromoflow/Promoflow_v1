class MessagesSection {
  constructor() {
    this.form = document.getElementById("msg-form-promoflow");
    this.input = document.getElementById("msg-input-promoflow");
    this.previewBody = document.getElementById("msg-preview-body");
    this.sendButton = document.getElementById("send_promoflow");
    this.caseTitle = document.getElementById("selected-case-title");
    this.caseSubtitle = document.getElementById("selected-case-subtitle");

    this.busy = false;
    this.revision = 0;
    this.init();
  }

  init() {
    this.listenFormSubmit();

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("case");

    if (!caseId) {
      this.showNoCaseSelected();
    }
  }

  showNoCaseSelected() {
    if (this.caseTitle) {
      this.caseTitle.textContent = "No case selected";
    }

    if (this.caseSubtitle) {
      this.caseSubtitle.textContent = "Select a case to view the conversation.";
    }

    if (this.previewBody) {
      this.previewBody.classList.add("msg-preview-body-empty");
      this.previewBody.innerHTML = `
        <p class="msg-empty">Select a case to view the conversation.</p>
      `;
    }

    this.disableMessageForm();
  }

  setSelectedCaseHeader(caseName) {
    if (this.caseTitle) {
      this.caseTitle.textContent = caseName || "Selected case";
    }

    if (this.caseSubtitle) {
      this.caseSubtitle.textContent = "Live conversation";
    }
  }

  enableMessageForm() {
    if (this.busy) return;
    if (this.form) {
      this.form.classList.remove("is-disabled");
    }

    if (this.input) {
      this.input.disabled = false;
      this.input.placeholder = "Write a message…";
    }

    if (this.sendButton) {
      this.sendButton.disabled = false;
    }
  }

  disableMessageForm() {
    if (this.form) {
      this.form.classList.add("is-disabled");
    }

    if (this.input) {
      this.input.disabled = true;
      this.input.placeholder = "Select a case before writing a message…";
    }

    if (this.sendButton) {
      this.sendButton.disabled = true;
    }
  }

  listenFormSubmit() {
    if (!this.form) return;

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.sendMessage();
    });
  }

  async sendMessage() {
    if (this.busy) return;
    const message = this.input.value.trim();
    if (!message) return;


    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("case");

    if (!caseId) {
      alert("Please select a case first.");
      return;
    }

    const data = {
      action: "send_message",
      caseId: caseId,
      message: message
    };

    const url = "../../controller/messages/messages.php";
    this.busy = true;
    this.sendButton.disabled = true;
    const response = await this.makeRequest(url, data);
    this.busy = false;
    this.sendButton.disabled = false;
    if (!response || response.response !== true) {
      this.feedback(response?.message || 'Message could not be sent. Your text has been kept.');
      return;
    }
    this.addMessageToView(message, "mine", {...response, can_delete: true});
    this.input.value = "";
    this.feedback('Message sent.');
  }

  async makeRequest(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({...data, csrf: document.querySelector('meta[name="messages-csrf"]')?.content})
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Request failed. Please try again.');
      return result;

    } catch (error) {
      (this.messagesSection || this).feedback(error.message || "Unable to connect. Please try again.");
      return null;
    }
  }

  feedback(message) {
    const status = document.getElementById('msg-feedback');
    status.hidden = false;
    status.textContent = message;
  }

  async deleteMessage(item, button) {
    if (this.busy || !window.confirm('Delete this message for everyone? This cannot be undone.')) return;
    this.busy = true;
    button.disabled = true;
    const result = await this.makeRequest('../../controller/messages/messages.php', {
      action: 'delete_message', messageId: item.id_message,
      caseId: new URLSearchParams(location.search).get('case')
    });
    this.busy = false;
    button.disabled = false;
    if (result?.response) {
      button.closest('.msg-row').remove();
      this.messagesSignature = null;
      this.feedback('Message deleted.');
      if (!this.previewBody.querySelector('.msg-row')) this.drawMessages([]);
    } else if (result) this.feedback(result.message || 'Unable to delete this message.');
  }

  addMessageToView(message, type = "mine", item = {}) {
    if (!this.previewBody) return;

    this.previewBody.classList.remove("msg-preview-body-empty");

    const emptyMessage = this.previewBody.querySelector(".msg-empty");

    if (emptyMessage) {
      emptyMessage.remove();
    }

    const row = document.createElement("div");
    const bubble = document.createElement("div");
    const text = document.createElement("p");

    row.classList.add("msg-row", type === "mine" ? "is-mine" : "is-other");
    bubble.classList.add("msg-bubble");
    text.classList.add("msg-bubble-text");

    text.textContent = message;

    const meta = document.createElement('div');
    meta.className = 'msg-meta';
    const author = document.createElement('span');
    author.textContent = `${item.can_delete ? 'You' : type === 'mine' ? 'Team' : 'Supplier'}${item.created_at ? ' · ' + item.created_at : ''}`;
    meta.appendChild(author);
    if (item.can_delete && item.id_message) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'msg-delete';
      remove.textContent = 'Delete';
      remove.setAttribute('aria-label', 'Delete your message');
      remove.addEventListener('click', () => this.deleteMessage(item, remove));
      meta.appendChild(remove);
    }
    bubble.appendChild(text);
    bubble.appendChild(meta);
    row.appendChild(bubble);

    this.previewBody.appendChild(row);
    this.scrollToBottom();
  }

  drawMessages(messages) {
    if (!this.previewBody || this.busy) return;
    const signature = JSON.stringify(messages);
    if (signature === this.messagesSignature) return;
    const previousScroll = this.previewBody.scrollTop;
    const follow = !this.messagesSignature || this.previewBody.scrollHeight - previousScroll - this.previewBody.clientHeight < 80;
    this.messagesSignature = signature;

    this.previewBody.classList.remove("msg-preview-body-empty");
    this.previewBody.innerHTML = "";

    if (!Array.isArray(messages) || messages.length === 0) {
      this.previewBody.classList.add("msg-preview-body-empty");
      this.previewBody.innerHTML = `<p class="msg-empty">No messages yet.</p>`;
      return;
    }

    messages.forEach((messageItem) => {
      const type = messageItem.sender_type === "admin" ? "mine" : "other";
      this.addMessageToView(messageItem.message, type, messageItem);
    });

    if (follow) this.scrollToBottom();
    else this.previewBody.scrollTop = previousScroll;
  }

  scrollToBottom() {
    if (!this.previewBody) return;

    this.previewBody.scrollTop = this.previewBody.scrollHeight;
  }
}

class CreateCaseModal {
  constructor(messagesSection) {
    this.messagesSection = messagesSection;

    this.modal = document.getElementById("create-case-modal");
    this.openButton = document.getElementById("open-create-case");
    this.closeButton = document.getElementById("close-create-case");
    this.cancelButton = document.getElementById("cancel-create-case");
    this.form = document.getElementById("create-case-form");
    this.caseNameInput = document.getElementById("case-name");
    this.supplierSelect = document.getElementById("case-supplier");
    this.groupCases = document.getElementById("group_cases");
    this.caseActions = new CaseActions(this, '../../controller/messages/messages.php');

    document.getElementById('msg-search')?.addEventListener('input', () => this.drawCases(this.cases || []));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') this.closeModal(); });
    this.init();

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("case");

    if (caseId) {
      this.readCasesAndMessages();

      setInterval(() => {
        this.readCasesAndMessages();
      }, 3000);

    } else {
      this.readCases();
    }
  }

  init() {
    this.openButton?.addEventListener("click", () => {
      this.openModal();
    });

    this.closeButton?.addEventListener("click", () => {
      this.closeModal();
    });

    this.cancelButton?.addEventListener("click", () => {
      this.closeModal();
    });

    this.modal?.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });

    this.form?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.createCase();
    });
  }

  async readCasesAndMessages() {
    if (this.messagesSection.busy || document.hidden || !this.caseActions.menu.hidden) return;
    const revision = this.messagesSection.revision;
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("case");

    if (!caseId) {
      this.messagesSection.showNoCaseSelected();
      return;
    }

    const data = {
      action: "get_cases_and_messages",
      caseId: caseId
    };

    const url = "../../controller/messages/messages.php";
    const response = await this.makeRequest(url, data);

    if (!response || revision !== this.messagesSection.revision || this.messagesSection.busy || !this.caseActions.menu.hidden) return;

    if (response.response === true) {
      if (Array.isArray(response.cases)) {
        this.drawCases(response.cases);
        this.renderSelectedCase(response, caseId);
        this.renderMessages();
      }


      return;
    }

    this.messagesSection.feedback(response.message || "Unable to load case.");
    this.messagesSection.showNoCaseSelected();
  }

  renderMessages(){

  }

  renderSelectedCase(response, caseId) {
    if (response.case && response.case.name) {
      this.messagesSection.setSelectedCaseHeader(response.case.name);
    } else {
      const activeCase = document.getElementById(`case_${caseId}`);
      const activeCaseName = activeCase?.querySelector(".msg-folder-name")?.textContent;

      this.messagesSection.setSelectedCaseHeader(activeCaseName || `Case #${caseId}`);
    }

    this.messagesSection.enableMessageForm();
    this.setActiveCase(caseId);

    if (Array.isArray(response.messages)) {
      this.messagesSection.drawMessages(response.messages);
    } else if (Array.isArray(response.result)) {
      this.messagesSection.drawMessages(response.result);
    } else {
      this.messagesSection.drawMessages([]);
    }
  }

  async readCases() {
    const data = {
      action: "get_cases"
    };

    const url = "../../controller/messages/messages.php";
    const response = await this.makeRequest(url, data);

    if (!response) return;

    if (response.response === true) {
      this.drawCases(response.result || []);
    }

    this.messagesSection.showNoCaseSelected();
  }

  drawCases(result) {
    if (!this.groupCases || !this.caseActions.menu.hidden) return;
    this.cases = result;
    const search = document.getElementById('msg-search')?.value.trim().toLowerCase() || '';
    result = Array.isArray(result) ? result.filter(item => (item.name || '').toLowerCase().includes(search)) : [];

    this.groupCases.innerHTML = "";

    const params = new URLSearchParams(window.location.search);
    const currentCaseId = params.get("case");

    if (!Array.isArray(result) || result.length === 0) {
      this.groupCases.innerHTML = `
        <p class="msg-empty">No cases yet.</p>
      `;
      return;
    }

    result.forEach((caseItem) => {
      const button = document.createElement("button");
      const dot = document.createElement("span");
      const name = document.createElement("span");

      const idCase = String(caseItem.id_case);

      button.id = `case_${idCase}`;
      button.classList.add("msg-folder");
      button.type = "button";
      button.dataset.caseId = idCase;

      if (currentCaseId === idCase) {
        button.classList.add("is-active");
        button.setAttribute("aria-current", "page");
      }

      dot.classList.add("msg-folder-dot");
      dot.setAttribute("aria-hidden", "true");

      name.classList.add("msg-folder-name");
      name.textContent = caseItem.name || `Case #${idCase}`;

      button.appendChild(dot);
      button.appendChild(name);

      button.addEventListener("click", () => {
        this.handleCaseClick(idCase);
      });

      this.caseActions.attach(button, caseItem);
    });
  }

  handleCaseClick(caseId) {
    this.setActiveCase(caseId);

    const url = new URL(window.location.href);
    url.searchParams.set("case", caseId);

    window.location.href = url.toString();
  }

  setActiveCase(caseId) {
    const allFolders = document.querySelectorAll(".msg-folder");

    allFolders.forEach((folder) => {
      folder.classList.remove("is-active");
      folder.removeAttribute("aria-current");
    });

    const activeFolder = document.getElementById(`case_${caseId}`);

    if (activeFolder) {
      activeFolder.classList.add("is-active");
      activeFolder.setAttribute("aria-current", "page");
    }
  }

  async openModal() {
    if (!this.modal) return;

    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

    const url = "../../controller/messages/messages.php";

    const data = {
      action: "get_suppliers",
      sku: sku
    };

    const response = await this.makeRequest(url, data);

    if (!response) return;

    this.drawSuppliersCreateCase(response);

    this.modal.hidden = false;
    this.caseNameInput?.focus();
  }

  drawSuppliersCreateCase(response) {
    if (!this.supplierSelect) return;

    this.supplierSelect.innerHTML = `
      <option value="">Select supplier</option>
    `;

    if (!response || response.response !== true || !Array.isArray(response.result)) {
      return;
    }

    response.result.forEach((supplier) => {
      const option = document.createElement("option");

      option.value = supplier.supplier_id;
      option.textContent = `${supplier.contact_name} - ${supplier.email}`;

      this.supplierSelect.appendChild(option);
    });
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.hidden = true;
    this.openButton?.focus();
  }

  async createCase() {
    if (!this.caseNameInput || !this.supplierSelect || !this.form) return;

    const caseName = this.caseNameInput.value.trim();
    const supplierId = this.supplierSelect.value;

    if (!caseName || !supplierId) {
      alert("Please complete all fields.");
      return;
    }

    const url = "../../controller/messages/messages.php";

    const data = {
      action: "create_case",
      caseName: caseName,
      supplierId: supplierId
    };

    const response = await this.makeRequest(url, data);

    if (!response) return;

    if (response.response === true) {
      alert(response.message);

      this.form.reset();
      this.closeModal();

      if (response.id_case) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("case", response.id_case);
        window.location.href = currentUrl.toString();
        return;
      }

      this.readCases();
      return;
    }

    alert(response.message || "Unable to create case.");
  }

  async makeRequest(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({...data, csrf: document.querySelector('meta[name="messages-csrf"]')?.content})
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Request failed. Please try again.');
      return result;

    } catch (error) {
      (this.messagesSection || this).feedback(error.message || "Unable to connect. Please try again.");
      return null;
    }
  }
}

class CaseActions {
  constructor(owner, endpoint) {
    this.owner = owner;
    this.endpoint = endpoint;
    this.menu = document.createElement('div');
    this.menu.className = 'msg-case-actions';
    this.menu.setAttribute('role', 'menu');
    this.menu.setAttribute('aria-label', 'Case actions');
    this.menu.hidden = true;
    for (const [action, label] of [['rename_case', 'Rename case'], ['delete_case', 'Delete case']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.setAttribute('role', 'menuitem');
      if (action === 'delete_case') button.className = 'is-danger';
      button.addEventListener('click', () => this.run(action));
      this.menu.appendChild(button);
    }
    document.body.appendChild(this.menu);
    document.addEventListener('pointerdown', event => {
      if (!this.menu.contains(event.target)) this.close(false);
    });
    document.addEventListener('keydown', event => {
      if (this.menu.hidden) return;
      if (event.key === 'Escape' || event.key === 'Tab') this.close(event.key === 'Escape');
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const buttons = [...this.menu.querySelectorAll('button')];
        const current = buttons.indexOf(document.activeElement);
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
          : (current + (event.key === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length;
        buttons[index].focus();
      }
    });
    window.addEventListener('resize', () => this.close(false));
    window.addEventListener('scroll', () => this.close(false), true);
  }

  attach(button, item) {
    if (item.can_manage === false) {
      this.owner.groupCases.appendChild(button);
      return;
    }
    const row = document.createElement('div');
    row.className = 'msg-case-row';
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'msg-case-more';
    more.textContent = '⋯';
    more.setAttribute('aria-label', `Actions for ${item.name || 'case'}`);
    more.setAttribute('aria-haspopup', 'menu');
    more.setAttribute('aria-expanded', 'false');
    more.addEventListener('click', () => {
      const rect = more.getBoundingClientRect();
      this.open(item, more, rect.left, rect.bottom + 4);
    });
    row.addEventListener('contextmenu', event => {
      event.preventDefault();
      this.open(item, more, event.clientX, event.clientY);
    });
    button.addEventListener('keydown', event => {
      if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
        event.preventDefault();
        const rect = button.getBoundingClientRect();
        this.open(item, more, rect.left, rect.bottom);
      }
    });
    row.append(button, more);
    this.owner.groupCases.appendChild(row);
  }

  open(item, trigger, x, y) {
    if (this.owner.messagesSection.busy) return;
    this.close(false);
    this.item = item;
    this.trigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');
    this.menu.hidden = false;
    this.menu.style.left = `${Math.max(8, Math.min(x, window.innerWidth - this.menu.offsetWidth - 8))}px`;
    this.menu.style.top = `${Math.max(8, Math.min(y, window.innerHeight - this.menu.offsetHeight - 8))}px`;
    this.menu.querySelector('button').focus();
  }

  close(restore = true) {
    if (this.menu.hidden) return;
    this.menu.hidden = true;
    this.trigger?.setAttribute('aria-expanded', 'false');
    if (restore && this.trigger?.isConnected) this.trigger.focus();
  }

  async run(action) {
    const item = this.item;
    const ui = this.owner.messagesSection;
    this.close();
    if (!item || ui.busy) return;
    let name;
    if (action === 'rename_case') {
      name = window.prompt('New case name (up to 100 characters):', item.name || '');
      if (name === null) return;
      name = name.trim();
      if (!name || [...name].length > 100) {
        ui.feedback('Enter a case name of 1–100 characters.');
        return;
      }
      if (name === item.name) return;
    } else if (!window.confirm(`Delete case "${item.name || item.id_case}" and all its messages for everyone? This cannot be undone.`)) return;
    ui.busy = true;
    ui.revision = (ui.revision || 0) + 1;
    ui.disableMessageForm();
    try {
      const result = await this.owner.makeRequest(this.endpoint, {action, caseId: item.id_case, name});
      if (!result?.response) {
        if (result) ui.feedback(result.error || result.message || 'Unable to update this case.');
        return;
      }
      const selected = new URLSearchParams(location.search).get('case') === String(item.id_case);
      if (action === 'delete_case' && selected) {
        const url = new URL(location.href);
        url.searchParams.delete('case');
        location.assign(url.toString());
        return;
      }
      this.owner.cases = (this.owner.cases || []).flatMap(entry => {
        if (String(entry.id_case) !== String(item.id_case)) return [entry];
        return action === 'delete_case' ? [] : [{...entry, name: result.name || name}];
      });
      this.owner.drawCases(this.owner.cases);
      if (selected && action === 'rename_case') ui.setSelectedCaseHeader(result.name || name);
      ui.feedback(result.message);
    } finally {
      ui.busy = false;
      if (new URLSearchParams(location.search).has('case')) ui.enableMessageForm();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const messagesSection = new MessagesSection();
  new CreateCaseModal(messagesSection);
});
