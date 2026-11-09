class MessagesSection {
  constructor() {
    this.form = document.getElementById("msg-form-promoflow");
    this.input = document.getElementById("msg-input-promoflow");
    this.previewBody = document.getElementById("msg-preview-body");
    this.sendButton = document.getElementById("send_promoflow");
    this.caseTitle = document.getElementById("selected-case-title");
    this.caseSubtitle = document.getElementById("selected-case-subtitle");

    this.busy = false;
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
    if (this.messagesSection.busy || document.hidden) return;
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

    if (!response) return;

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
    if (!this.groupCases) return;
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

      this.groupCases.appendChild(button);
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

document.addEventListener("DOMContentLoaded", () => {
  const messagesSection = new MessagesSection();
  new CreateCaseModal(messagesSection);
});
