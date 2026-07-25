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

    <!-- Sidebar -->

    <aside class="sidebar">

        <div class="sidebar-header">

            <h2>Messages</h2>

            <input
                type="text"
                placeholder="Search..."
                id="searchConversation">

        </div>

        <div class="conversation-list" id="conversationList">

        </div>

    </aside>

    <!-- Chat -->

    <section class="chat">

        <header class="chat-header">

            <div class="user">

                <div class="avatar large">
                    A
                </div>

                <div>

                    <h3 id="chatName">
                        Select conversation
                    </h3>

                    <span id="chatStatus">
                        Offline
                    </span>

                </div>

            </div>

        </header>

        <div
            class="chat-body"
            id="chatBody">

        </div>

        <footer class="chat-footer">

            <input
                type="text"
                id="messageInput"
                placeholder="Write a message...">

            <button id="sendButton">

                Send

            </button>

        </footer>

    </section>

</div>

<script src="app.js?v=<?php echo filemtime("app.js"); ?>"></script>

</body>

</html>
