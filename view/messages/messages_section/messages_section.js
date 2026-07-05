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
      "other",
      "Supplier"
    );

    this.addMessageToView(
      "Sure, please let me know what changes are needed.",
      "mine",
      "Admin"
    );

    this.addMessageToView(
      "Please update the product description and upload a clearer main image.",
      "other",
      "Supplier"
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

    this.addMessageToView(message, "mine", "Admin");

    this.input.value = "";
  }

  addMessageToView(message, type = "mine", sender = "") {
    if (!this.previewBody) return;

    const emptyMessage = this.previewBody.querySelector(".msg-empty");

    if (emptyMessage) {
      emptyMessage.remove();
    }

    const row = document.createElement("div");
    const bubble = document.createElement("div");
    const senderName = document.createElement("strong");
    const text = document.createElement("p");
    const meta = document.createElement("span");

    row.classList.add("msg-row");

    if (type === "mine") {
      row.classList.add("is-mine");
    } else {
      row.classList.add("is-other");
    }

    bubble.classList.add("msg-bubble");
    senderName.classList.add("msg-bubble-sender");
    text.classList.add("msg-bubble-text");
    meta.classList.add("msg-bubble-meta");

    senderName.textContent = sender;
    text.textContent = message;
    meta.textContent = "Just now";

    if (sender) {
      bubble.appendChild(senderName);
    }

    bubble.appendChild(text);
    bubble.appendChild(meta);
    row.appendChild(bubble);

    this.previewBody.appendChild(row);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (!this.previewBody) return;

    this.previewBody.scrollTop = this.previewBody.scrollHeight;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MessagesSection();
});
