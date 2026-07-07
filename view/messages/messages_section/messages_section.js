class MessagesSection {
  constructor() {
    this.form = document.getElementById("msg-form-promoflow");
    this.input = document.getElementById("msg-input-promoflow");
    this.previewBody = document.getElementById("msg-preview-body");
    this.sendButton = document.getElementById("send_promoflow");

    this.init();
  }

  init() {
    this.renderInitialMessages();
    this.listenFormSubmit();
  }

  renderInitialMessages() {
    this.addMessageToView(
      "Hello, we have reviewed the product and need a few changes before approval.",
      "other"
    );

    this.addMessageToView(
      "Sure, please let me know what changes are needed.",
      "mine"
    );

    this.addMessageToView(
      "Please update the product description and upload a clearer main image.",
      "other"
    );
  }

  listenFormSubmit() {
    if (!this.form) return;

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.sendMessage();
    });
  }

  sendMessage() {
    if (!this.input) return;

    const message = this.input.value.trim();

    if (!message) return;

    this.addMessageToView(message, "mine");
    this.input.value = "";
  }

  addMessageToView(message, type = "mine") {
    if (!this.previewBody) return;

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

    bubble.appendChild(text);
    row.appendChild(bubble);

    this.previewBody.appendChild(row);
    this.scrollToBottom();
  }

  clearMessages() {
    if (!this.previewBody) return;

    this.previewBody.innerHTML = `<p class="msg-empty">No messages yet.</p>`;
  }

  scrollToBottom() {
    if (!this.previewBody) return;

    this.previewBody.scrollTop = this.previewBody.scrollHeight;
  }
}

class CreateCaseModal {
  constructor() {
    this.modal = document.getElementById("create-case-modal");
    this.openButton = document.getElementById("open-create-case");
    this.closeButton = document.getElementById("close-create-case");
    this.cancelButton = document.getElementById("cancel-create-case");
    this.form = document.getElementById("create-case-form");
    this.caseNameInput = document.getElementById("case-name");
    this.supplierSelect = document.getElementById("case-supplier");
    this.groupCases = document.getElementById("group_cases");

    this.init();

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("case");

    if (caseId) {
      this.readCasesAndMessages();
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
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("case");

    if (!caseId) return;

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
      }

      if (Array.isArray(response.messages)) {
        this.drawMessages(response.messages);
      }

      this.setActiveCase(caseId);
      return;
    }

    alert(response.message || "Unable to load case.");
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
  }

  drawCases(result) {
    if (!this.groupCases) return;

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

  drawMessages(messages) {
    const previewBody = document.getElementById("msg-preview-body");

    if (!previewBody) return;

    previewBody.innerHTML = "";

    if (!Array.isArray(messages) || messages.length === 0) {
      previewBody.innerHTML = `<p class="msg-empty">No messages yet.</p>`;
      return;
    }

    messages.forEach((messageItem) => {
      const type = messageItem.sender_type === "admin" ? "mine" : "other";
      this.addMessageToPreview(messageItem.message, type);
    });

    previewBody.scrollTop = previewBody.scrollHeight;
  }

  addMessageToPreview(message, type = "mine") {
    const previewBody = document.getElementById("msg-preview-body");

    if (!previewBody) return;

    const row = document.createElement("div");
    const bubble = document.createElement("div");
    const text = document.createElement("p");

    row.classList.add("msg-row", type === "mine" ? "is-mine" : "is-other");
    bubble.classList.add("msg-bubble");
    text.classList.add("msg-bubble-text");

    text.textContent = message;

    bubble.appendChild(text);
    row.appendChild(bubble);
    previewBody.appendChild(row);
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
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Network error.");
      }

      return await response.json();

    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MessagesSection();
  new CreateCaseModal();
});
