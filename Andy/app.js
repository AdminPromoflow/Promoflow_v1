"use strict";

const conversations = [
{
    id:1,
    name:"Andrew",
    online:true,
    messages:[
        {
            from:"them",
            text:"Hello!"
        },
        {
            from:"me",
            text:"Hi Andrew!"
        }
    ]
},
{
    id:2,
    name:"Sophia",
    online:false,
    messages:[
        {
            from:"them",
            text:"Can we talk tomorrow?"
        }
    ]
},
{
    id:3,
    name:"Michael",
    online:true,
    messages:[
        {
            from:"me",
            text:"Everything is ready."
        }
    ]
}
];

const conversationList = document.getElementById("conversationList");
const chatBody = document.getElementById("chatBody");
const chatName = document.getElementById("chatName");
const chatStatus = document.getElementById("chatStatus");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const search = document.getElementById("searchConversation");

let currentConversation = null;

function renderConversations(filter = ""){

    conversationList.innerHTML = "";

    conversations
    .filter(c=>c.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(conversation=>{

        const div = document.createElement("div");

        div.className="conversation";

        div.innerHTML=`

            <div class="avatar">
                ${conversation.name.charAt(0)}
            </div>

            <div class="info">

                <h4>${conversation.name}</h4>

                <p>
                    ${
                        conversation.messages.at(-1)?.text || ""
                    }
                </p>

            </div>

            <span class="time">
                Now
            </span>

        `;

        div.onclick=()=>{

            document
            .querySelectorAll(".conversation")
            .forEach(c=>c.classList.remove("active"));

            div.classList.add("active");

            currentConversation=conversation;

            renderMessages();

        };

        conversationList.appendChild(div);

    });

}

function renderMessages(){

    if(!currentConversation) return;

    chatName.textContent=currentConversation.name;

    chatStatus.textContent=currentConversation.online
        ? "Online"
        : "Offline";

    chatBody.innerHTML="";

    currentConversation.messages.forEach(message=>{

        const div=document.createElement("div");

        div.className=`message ${
            message.from==="me"
            ? "sent"
            : "received"
        }`;

        div.textContent=message.text;

        chatBody.appendChild(div);

    });

    chatBody.scrollTop=chatBody.scrollHeight;

}

function sendMessage(){

    if(!currentConversation) return;

    const text=messageInput.value.trim();

    if(text==="") return;

    currentConversation.messages.push({

        from:"me",

        text

    });

    messageInput.value="";

    renderMessages();

}

sendButton.onclick=sendMessage;

messageInput.addEventListener("keypress",(event)=>{

    if(event.key==="Enter"){

        sendMessage();

    }

});

search.addEventListener("input",()=>{

    renderConversations(search.value);

});

renderConversations();
