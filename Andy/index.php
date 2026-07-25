<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Messenger System</title>

    <link rel="stylesheet"
          href="style.css?v=<?php echo filemtime("style.css"); ?>">

</head>

<body>

<div class="messenger">

    <!-- ==========================
         SIDEBAR
    =========================== -->

    <aside class="sidebar">

        <div class="sidebar-header">

            <h2>Messages</h2>

            <input
                type="text"
                id="searchConversation"
                placeholder="Search conversation...">

        </div>

        <div
            class="conversation-list"
            id="conversationList">

            <!-- Conversations generated with JavaScript -->

        </div>

    </aside>

    <!-- ==========================
         CHAT
    =========================== -->

    <section class="chat">

        <header class="chat-header">

            <button
                id="backButton"
                class="back-button"
                type="button">

                ←

            </button>

            <div class="user">

                <div
                    class="avatar large"
                    id="chatAvatar">

                    ?

                </div>

                <div>

                    <h3 id="chatName">

                        Select a conversation

                    </h3>

                    <span id="chatStatus">

                        Offline

                    </span>

                </div>

            </div>

        </header>

        <main
            class="chat-body"
            id="chatBody">

            <div class="empty-chat">

                <div class="empty-icon">

                    💬

                </div>

                <h2>

                    Messenger System

                </h2>

                <p>

                    Select a conversation to start chatting.

                </p>

            </div>

        </main>

        <footer class="chat-footer">

            <input
                type="text"
                id="messageInput"
                placeholder="Write a message..."
                autocomplete="off">

            <button
                id="sendButton"
                type="button">

                Send

            </button>

        </footer>

    </section>

</div>

<script src="app.js?v=<?php echo filemtime("app.js"); ?>"></script>

</body>

</html>
