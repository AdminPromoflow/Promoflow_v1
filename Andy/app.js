"use strict";

const conversations = [
    {
        id: 1,
        name: "Andrew",
        online: true,
        messages: [
            {
                from: "them",
                text: "Hello!"
            },
            {
                from: "me",
                text: "Hi Andrew!"
            },
            {
                from: "them",
                text: "How are you today?"
            }
        ]
    },
    {
        id: 2,
        name: "Sophia",
        online: false,
        messages: [
            {
                from: "them",
                text: "Can we talk tomorrow?"
            }
        ]
    },
    {
        id: 3,
        name: "Michael",
        online: true,
        messages: [
            {
                from: "me",
                text: "Everything is ready."
            }
        ]
    }
];

const messenger = document.querySelector(".messenger");

const conversationList = document.getElementById("conversationList");
const chatBody = document.getElementById("chatBody");
const chatName = document.getElementById("chatName");
const chatStatus = document.getElementById("chatStatus");
const chatAvatar = document.getElementById("chatAvatar");

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const searchConversation = document.getElementById("searchConversation");
const backButton = document.getElementById("backButton");

let currentConversation = null;

/* ==========================================
   RENDER CONVERSATIONS
========================================== */

function renderConversations(filter = "") {

    conversationList.innerHTML = "";

    conversations
        .filter(conversation =>
            conversation.name
                .toLowerCase()
                .includes(filter.toLowerCase())
        )
        .forEach(conversation => {

            const lastMessage =
                conversation.messages[
                    conversation.messages.length - 1
                ];

            const div = document.createElement("div");

            div.className = "conversation";

            if (
                currentConversation &&
                currentConversation.id === conversation.id
            ) {
                div.classList.add("active");
            }

            div.innerHTML = `
                <div class="avatar">
                    ${conversation.name.charAt(0)}
                </div>

                <div class="info">

                    <h4>${conversation.name}</h4>

                    <p>${lastMessage ? lastMessage.text : ""}</p>

                </div>

                <span class="time">
                    Now
                </span>
            `;

            div.addEventListener("click", () => {

                currentConversation = conversation;

                renderConversations(searchConversation.value);

                renderMessages();

                messenger.classList.add("chat-open");

            });

            conversationList.appendChild(div);

        });

}

/* ==========================================
   RENDER MESSAGES
========================================== */

function renderMessages() {

    if (!currentConversation) {
        return;
    }

    chatName.textContent = currentConversation.name;

    chatStatus.textContent = currentConversation.online
        ? "Online"
        : "Offline";

    chatStatus.style.color = currentConversation.online
        ? "#22c55e"
        : "#9ca3af";

    chatAvatar.textContent =
        currentConversation.name.charAt(0);

    chatBody.innerHTML = "";

    currentConversation.messages.forEach(message => {

        const div = document.createElement("div");

        div.className =
            "message " +
            (message.from === "me"
                ? "sent"
                : "received");

        div.textContent = message.text;

        chatBody.appendChild(div);

    });

    chatBody.scrollTop = chatBody.scrollHeight;

}

/* ==========================================
   SEND MESSAGE
========================================== */

function sendMessage() {

    if (!currentConversation) {
        return;
    }

    const text = messageInput.value.trim();

    if (text === "") {
        return;
    }

    currentConversation.messages.push({

        from: "me",

        text: text

    });

    messageInput.value = "";

    renderConversations(searchConversation.value);

    renderMessages();

}

/* ==========================================
   EVENTS
========================================== */

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        sendMessage();

    }

});

searchConversation.addEventListener("input", () => {

    renderConversations(searchConversation.value);

});

backButton.addEventListener("click", () => {

    messenger.classList.remove("chat-open");

});

/* ==========================================
   INITIALIZE
========================================== */

renderConversations();
