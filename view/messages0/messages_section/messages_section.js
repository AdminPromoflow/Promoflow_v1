class MessagesSection {
  constructor() {
    this.modal = document.querySelector(".msg-modal");
    this.openButton = document.querySelector("[data-compose-open]");
    this.closeButtons = document.querySelectorAll("[data-compose-close]");

    this.form = document.getElementById("msg-form-promoflow");
    this.input = document.getElementById("msg-input-promoflow");
    this.messagesContainer = document.getElementById("msg-preview-body");

    this.lastRenderKey = "";

    if (!this.modal || !this.openButton || !this.form || !this.input || !this.messagesContainer) {
      return;
    }

    this.bindEvents();
    this.fetchGetMessages();
    this.startMessagesPolling();
  }

  bindEvents() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.fetchSaveMessages();
    });

    this.openButton.addEventListener("click", () => {
      this.openModal();
    });

    this.closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.closeModal();
      });
    });

    this.modal.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.modal.hidden) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.modal.hidden = false;
  }

  closeModal() {
    this.modal.hidden = true;
  }

  startMessagesPolling() {
    this.polling = setInterval(() => {
      this.fetchGetMessages();
    }, 3000);
  }

  fetchSaveMessages() {
    const message = this.input.value.trim();

    if (!message) {
      return;
    }

    const url = "../../controller/messages/messages.php";
    const data = {
      action: "save_messages",
      message: message
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error.");
        }
        return response.json();
      })
      .then((result) => {
        if (result.status === "success") {
          this.input.value = "";
          this.fetchGetMessages();
        }
      })
      .catch((error) => {
        console.error("Error saving messages:", error);
      });
  }

  fetchGetMessages() {
    const url = "../../controller/messages/messages.php";
    const data = {
      action: "get_data_messages"
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error.");
        }
        return response.json();
      })
      .then((result) => {
        if (result.status === "success") {
          this.renderMessages(result.result || []);
        }
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });
  }

  renderMessages(messages) {
    const renderKey = JSON.stringify(messages);

    if (this.lastRenderKey === renderKey) {
      return;
    }

    this.lastRenderKey = renderKey;

    if (!messages.length) {
      this.messagesContainer.innerHTML = `<p class="msg-empty">No messages found.</p>`;
      return;
    }

    let html = "";

    for (let i = 0; i < messages.length; i++) {
      const item = messages[i];
      const isMine = item.user_1 === "ian@kan-do-it.com";

      html += `
        <div class="msg-row ${isMine ? "is-mine" : "is-other"}">
          <div class="msg-bubble">
            <p class="msg-bubble-text">${this.escapeHtml(item.message ?? "")}</p>
            <span class="msg-bubble-meta">${this.escapeHtml(item.date ?? "")}</span>
          </div>
        </div>
      `;
    }

    this.messagesContainer.innerHTML = html;
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MessagesSection();
});
