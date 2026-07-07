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

    this.init();

  //  this.readCases();


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

  async readCasesAndMessages(){
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("case");

    if (!this.modal) return;

    const data = {
      action: "get_cases_and_messages",
      caseId: caseId
    };
    const url = "../../controller/messages/messages.php";
    const response = await this.makeRequest(url, data);
    if (!response) return

    alert(JSON.stringify(response));
  }

  async readCases(){


    if (!this.modal) return;

    const data = {
      action: "get_cases"
    };
    const url = "../../controller/messages/messages.php";
    const response = await this.makeRequest(url, data);
    if (!response) return

    if (response.response === true) {
      this.drawCases(response.result);
    }

  }

  drawCases(result){
    alert(JSON.stringify(result));

    const group_cases = document.getElementById("group_cases");
    group_cases.innerHTML = '' ;

    for (var i = 0; i < result.length; i++) {

      group_cases.innerHTML += `
      <button id="case_${result[i]["id_case"]}" class="msg-folder is-active" type="button" aria-current="page">
        <span class="msg-folder-dot" aria-hidden="true"></span>
        <span class="msg-folder-name">${result[i]["id_case"]}</span>
      </button>
      `
      //
    }



  }

  async openModal() {

    if (!this.modal) return;

    const params = new URLSearchParams(window.location.search);
    const sku = params.get('sku');

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
    const caseSupplier = document.getElementById("case-supplier");

    if (!caseSupplier) return;

    caseSupplier.innerHTML = `
      <option value="">Select supplier</option>
    `;

    if (!response || response.response !== true || !Array.isArray(response.result)) {
      return;
    }

    response.result.forEach((supplier) => {
      const option = document.createElement("option");

      option.value = supplier.supplier_id;
      option.textContent = `${supplier.contact_name} - ${supplier.email}`;

      caseSupplier.appendChild(option);
    });
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

  closeModal() {
    if (!this.modal) return;

    this.modal.hidden = true;
  }

  async createCase() {
    const caseName = this.caseNameInput.value.trim();
    const supplierId = this.supplierSelect.value;
    const supplierText = this.supplierSelect.options[this.supplierSelect.selectedIndex].text;

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

    if (response.response === true) {

      alert(response.message);

    }
    // console.log("Case name:", caseName);
    // console.log("Supplier ID:", supplierId);



    this.form.reset();
    this.closeModal();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MessagesSection();
  new CreateCaseModal();
});
