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

document.addEventListener("DOMContentLoaded", () => {
  new MessagesSection();
});
