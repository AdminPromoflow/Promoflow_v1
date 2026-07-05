class MessagesSection {
  constructor() {
    this.form = document.getElementById("msg-form-promoflow");
    this.input = document.getElementById("msg-input-promoflow");
    this.previewBody = document.getElementById("msg-preview-body");
    this.sendButton = document.getElementById("send_promoflow");

    this.init();
  }

  init() {
    this.listenFormSubmit();
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

    if (message === "") {
      return;
    }

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
    row.classList.add("msg-row");

    if (type === "mine") {
      row.classList.add("is-mine");
    } else {
      row.classList.add("is-other");
    }

    row.innerHTML = `
      <div class="msg-bubble">
        <p class="msg-bubble-text">${message}</p>
        <span class="msg-bubble-meta">Just now</span>
      </div>
    `;

    this.previewBody.appendChild(row);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.previewBody.scrollTop = this.previewBody.scrollHeight;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MessagesSection();
});
