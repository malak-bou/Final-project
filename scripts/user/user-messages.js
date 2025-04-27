document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../index.html";
        return;
    }

    // Gestion de la Sidebar
    const menuIcon = document.querySelector(".menu-icon");
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.getElementById("closeSidebar");

    if (menuIcon && sidebar) {
        menuIcon.addEventListener("click", function() {
            sidebar.classList.toggle("active");
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener("click", function() {
            sidebar.classList.remove("active");
        });
    }

    // Éléments DOM
    const messagesContainer = document.querySelector(".chat-box");
    const chatHeader = document.querySelector(".chat-header .username");
    const chatAvatar = document.querySelector(".chat-header .avatar img");
    const recentMessages = document.querySelectorAll(".message.supconvo");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const fileInput = document.getElementById("file");
    const searchIcon = document.getElementById("searchIcon");
    const searchInput = document.getElementById("searchInput");
    const hide = document.getElementById("hide-msg");
    const typeButtons = document.querySelectorAll("input[name='type']");
    const chatMessagesContainer = document.getElementById("chat-message");
    const rhMessagesContainer = document.getElementById("rh-messages");
    const profMessagesContainer = document.getElementById("prof-messages");
    const chatContainer = document.querySelector(".chat-container");
    const container1 = document.querySelector(".container1");
    const backButton = document.querySelector(".chat-header .material-symbols-outlined");

    let activeContact = null;
    let activeContactId = null;

    // Charger les utilisateurs au démarrage
    loadUsers();

    // Gestion des types de messages (RH, Prof, Chat)
    typeButtons.forEach(button => {
        button.addEventListener("change", function () {
            if (this.value === "RH") {
                chatMessagesContainer.style.display = "none";
                rhMessagesContainer.style.display = "block";
                profMessagesContainer.style.display = "none";
                loadRHMessages();
            } else if (this.value === "Prof") {
                rhMessagesContainer.style.display = "none";
                chatMessagesContainer.style.display = "none";
                profMessagesContainer.style.display = "block";
                loadProfMessages();
            } else {
                rhMessagesContainer.style.display = "none";
                chatMessagesContainer.style.display = "block";
                profMessagesContainer.style.display = "none";
                loadUsers();
            }
        });
    });

    // Fonction pour charger la liste des utilisateurs
    async function loadUsers() {
        try {
            const response = await fetch("https://backend-m6sm.onrender.com/public/users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des utilisateurs");
            }

            const users = await response.json();
            displayUsers(users);
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger la liste des utilisateurs");
        }
    }

    // Fonction pour afficher les utilisateurs
    function displayUsers(users) {
        const messageList = document.querySelector(".messages.chat");
        if (!messageList) return;

        messageList.innerHTML = "";

        if (!users || users.length === 0) {
            messageList.innerHTML = "<p>Aucun utilisateur trouvé</p>";
            return;
        }

        // Filtrer les utilisateurs par rôle
        const profs = users.filter(user => user.role === "prof");
        const admins = users.filter(user => user.role === "admin");
        const employers = users.filter(user => user.role === "employer");

        // Afficher les profs
        profs.forEach(user => {
            const messageElement = createUserElement(user, "Professeur");
            messageList.appendChild(messageElement);
        });

        // Afficher les admins
        admins.forEach(user => {
            const messageElement = createUserElement(user, "Administrateur");
            messageList.appendChild(messageElement);
        });

        // Afficher les autres employés
        employers.forEach(user => {
            const messageElement = createUserElement(user, "Employé");
            messageList.appendChild(messageElement);
        });
    }

    // Fonction pour créer un élément utilisateur
    function createUserElement(user, role) {
        const div = document.createElement("div");
        div.className = "message supconvo";
        div.setAttribute("data-name", `${user.nom} ${user.prenom}`);
        div.setAttribute("data-avatar", "../assets/images/profil-pic.png");
        div.setAttribute("data-id", user.id);

        div.innerHTML = `
            <span class="avatar">
                <img src="../assets/images/profil-pic.png" alt="profil-pic">
            </span>
            <div class="message-content">
                <strong>${user.nom} ${user.prenom}</strong>
                <span class="role">${role}</span>
                <p class="supp-msg">${user.departement}</p>
            </div>
        `;

        div.addEventListener("click", () => openChat(user.id, `${user.nom} ${user.prenom}`, "../assets/images/profil-pic.png"));
        return div;
    }

    // Charger les messages RH
    async function loadRHMessages() {
        try {
            const response = await fetch("https://backend-m6sm.onrender.com/messages/?type=rh", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des messages RH");
            }

            const messages = await response.json();
            displayRHMessages(messages);
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger les messages RH");
        }
    }

    // Charger les messages des profs
    async function loadProfMessages() {
        try {
            const response = await fetch("https://backend-m6sm.onrender.com/messages/?type=prof", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des messages des profs");
            }

            const messages = await response.json();
            displayProfMessages(messages);
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger les messages des profs");
        }
    }

    // Afficher les messages RH
    function displayRHMessages(messages) {
        const messageList = document.getElementById("rh-messages");
        messageList.innerHTML = "";

        messages.forEach(message => {
            const messageElement = createMessageElement(message);
            messageList.appendChild(messageElement);
        });
    }

    // Afficher les messages des profs
    function displayProfMessages(messages) {
        const messageList = document.getElementById("prof-messages");
        messageList.innerHTML = "";

        messages.forEach(message => {
            const messageElement = createMessageElement(message);
            messageList.appendChild(messageElement);
        });
    }

    // Créer un élément de message
    function createMessageElement(message) {
        const div = document.createElement("div");
        div.className = "message supconvo";
        div.setAttribute("data-name", message.sender_name);
        div.setAttribute("data-avatar", message.sender_avatar || "../assets/images/profil-pic.png");
        div.setAttribute("data-id", message.sender_id);

        div.innerHTML = `
            <span class="avatar">
                <img src="${message.sender_avatar || "../assets/images/profil-pic.png"}" alt="profil-pic">
            </span>
            <div class="message-content">
                <strong>${message.sender_name}</strong>
                <span class="timestamp">${formatDate(message.created_at)}</span>
                <p class="supp-msg">${message.content}</p>
            </div>
        `;

        div.addEventListener("click", () => openChat(message.sender_id, message.sender_name, message.sender_avatar));
        return div;
    }

    // Ouvrir une conversation
    async function openChat(userId, userName, userAvatar) {
        activeContact = userName;
        activeContactId = userId;

        chatHeader.innerText = userName;
        chatAvatar.src = userAvatar || "../assets/images/profil-pic.png";

        try {
            const response = await fetch(`https://backend-m6sm.onrender.com/messages/?receiver_id=${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement de la conversation");
            }

            const messages = await response.json();
            displayChatMessages(messages);

            if (window.innerWidth < 768) {
                container1.classList.add("hidden");
                chatContainer.classList.add("active");
                backButton.style.display = "block";
            }
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger la conversation");
        }
    }

    // Afficher les messages du chat
    function displayChatMessages(messages) {
        messagesContainer.innerHTML = "";

        messages.forEach(message => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", message.sender_id === activeContactId ? "received" : "sent");

            let content = `<div class="message-content">
                            <span class="timestamp">${formatDate(message.created_at)}</span>`;

            if (message.content) {
                content += `<p class="msg-chat">${message.content}</p>`;
            }

            if (message.file_path) {
                if (message.file_type.startsWith("image/")) {
                    content += `<img src="${message.file_path}" class="chat-image" alt="Image envoyée" />`;
                } else {
                    content += `<a href="${message.file_path}" download class="chat-file">Télécharger le fichier</a>`;
                }
            }

            content += `</div>`;
            messageDiv.innerHTML = content;
            messagesContainer.appendChild(messageDiv);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Envoyer un message
    async function sendMessage() {
        if (!activeContactId || !messageInput.value.trim()) return;

        const formData = new FormData();
        formData.append("content", messageInput.value);
        formData.append("receiver_id", activeContactId);

        if (fileInput.files[0]) {
            formData.append("file", fileInput.files[0]);
        }

        try {
            const response = await fetch("https://backend-m6sm.onrender.com/messages/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi du message");
            }

            const newMessage = await response.json();
            messageInput.value = "";
            fileInput.value = "";

            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", "sent");
            messageDiv.innerHTML = `
                <div class="message-content">
                    <span class="timestamp">${formatDate(newMessage.created_at)}</span>
                    <p class="msg-chat">${newMessage.content}</p>
                    ${newMessage.file_path ? 
                        (newMessage.file_type.startsWith("image/") ? 
                            `<img src="${newMessage.file_path}" class="chat-image" alt="Image envoyée" />` :
                            `<a href="${newMessage.file_path}" download class="chat-file">Télécharger le fichier</a>`) 
                        : ""}
                </div>
            `;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible d'envoyer le message");
        }
    }

    // Gestion de la recherche
    searchIcon.addEventListener("click", function () {
        if (searchInput.style.display === "none" || searchInput.style.display === "") {
            searchInput.style.display = "block";
            hide.style.display = "none";
            searchInput.focus();
        } else {
            searchInput.style.display = "none";
            hide.style.display = "block";
            searchInput.value = "";
        }
    });

    searchInput.addEventListener("keyup", function() {
        let filter = searchInput.value.toLowerCase();
        const messages = document.querySelectorAll(".message.supconvo");

        messages.forEach(message => {
            let name = message.getAttribute("data-name").toLowerCase();
            let content = message.querySelector(".supp-msg").textContent.toLowerCase();
            message.style.display = (name.includes(filter) || content.includes(filter)) ? "flex" : "none";
        });
    });

    // Événements
    sendButton.addEventListener("click", sendMessage);
    
    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Fonction goback globale
    window.goback = function () {
        container1.classList.remove("hidden");
        chatContainer.classList.remove("active");
        backButton.style.display = "none";
    };

    // Fonctions utilitaires
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'notification error';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'notification success';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
    }
});
