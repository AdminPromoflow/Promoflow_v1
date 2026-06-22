class MessagesSection {
  constructor() {
    this.modal = document.querySelector(".msg-modal");
    this.openButton = document.querySelector("[data-compose-open]");
    this.closeButtons = document.querySelectorAll("[data-compose-close]");

    this.mainForm = document.getElementById("msg-form-dot63");
    this.mainInput = document.getElementById("msg-input-dot63-main");
    this.modalInput = document.getElementById("msg-input-dot63-modal");
    this.modalSendButton = document.getElementById("send_dot63_modal");

    this.messagesContainer = document.getElementById("msg-preview-body");
    this.currentUserEmail = "ian@kan-do-it.com";

    if (!this.modal || !this.openButton || !this.messagesContainer) return;

    this.bindEvents();
    this.fetchGetMessages();
    this.startPolling();
  }

  bindEvents() {
    this.mainForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.fetchSaveMessages(this.mainInput);
    });

    this.modalSendButton?.addEventListener("click", () => {
      this.fetchSaveMessages(this.modalInput, true);
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

  startPolling() {
    this.polling = setInterval(() => {
      this.fetchGetMessages();
    }, 3000);
  }

  fetchSaveMessages(inputElement, closeAfterSave = false) {
    const message = inputElement?.value?.trim() || "";

    if (!message) return;

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
          inputElement.value = "";
          this.fetchGetMessages();

          if (closeAfterSave) {
            this.closeModal();
          }
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
    if (!messages.length) {
      this.messagesContainer.innerHTML = `<p class="msg-empty">No messages found.</p>`;
      return;
    }

    let html = "";

    for (let i = 0; i < messages.length; i++) {
      const item = messages[i];

      const senderEmail = this.getSenderEmail(item);
      const senderLabel = this.formatUserLabel(senderEmail);
      const dateLabel = this.formatDate(item.date ?? item.created_at ?? "");
      const isMine = senderEmail.toLowerCase() === this.currentUserEmail.toLowerCase();

      html += `
        <div class="msg-row ${isMine ? "is-mine" : "is-other"}">
          <div class="msg-bubble">
            <div class="msg-bubble-top">
              <span class="msg-bubble-user">${this.escapeHtml(senderLabel)}</span>
              <span class="msg-bubble-date">${this.escapeHtml(dateLabel)}</span>
            </div>
            <p class="msg-bubble-text">${this.escapeHtml(item.message ?? "")}</p>
          </div>
        </div>
      `;
    }

    this.messagesContainer.innerHTML = html;
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  getSenderEmail(item) {
    return String(
      item.user_1 ??
      item.user ??
      item.email ??
      item.sender ??
      ""
    ).trim();
  }

  formatUserLabel(email) {
    if (!email) return "Unknown user";

    const localPart = email.split("@")[0];

    return localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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
