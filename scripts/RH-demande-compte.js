document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../index.html";
        return;
    }

    // Charger les demandes en attente et les comptes existants
    loadPendingRequests();
    loadExistingAccounts();

    // Function to handle 'Créer' button click
    document.querySelectorAll(".create").forEach(button => {
        button.addEventListener("click", async function () {
            const userId = this.getAttribute("data-user-id");
            try {
                const response = await fetch(`https://backend-m6sm.onrender.com/admin/approve-user/${userId}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        is_approved: true
                    })
                });

                if (response.ok) {
                    alert("Un nouveau compte a été créé !");
                    loadPendingRequests();
                    loadExistingAccounts();
                } else {
                    alert("Erreur lors de la création du compte");
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Erreur lors de la création du compte");
            }
        });
    });

    // Function to handle 'Modifier' button click
    document.querySelectorAll(".modify").forEach(button => {
        button.addEventListener("click", function () {
            const userId = this.getAttribute("data-user-id");
            window.location.href = `RH-modify-user.html?id=${userId}`;
        });
    });

    // Function to handle 'Supprimer' button click
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", async function () {
            const userId = this.getAttribute("data-user-id");
            if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
                try {
                    const response = await fetch(`https://backend-m6sm.onrender.com/admin/users/${userId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        this.closest("tr").remove();
                        alert("Élément supprimé !");
                        loadPendingRequests();
                        loadExistingAccounts();
                    } else {
                        alert("Erreur lors de la suppression");
                    }
                } catch (error) {
                    console.error("Erreur:", error);
                    alert("Erreur lors de la suppression");
                }
            }
        });
    });

    // Fonction pour charger les demandes en attente
    async function loadPendingRequests() {
        try {
            const response = await fetch("https://backend-m6sm.onrender.com/admin/pending-users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des demandes");
            }

            const users = await response.json();
            displayPendingRequests(users);
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger les demandes en attente");
        }
    }

    // Fonction pour afficher les demandes en attente
    function displayPendingRequests(users) {
        const tbody = document.getElementById("requests-body");
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = "<tr><td colspan='6'>Aucune demande en attente</td></tr>";
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.nom}</td>
                <td>${user.prenom}</td>
                <td>${user.departement}</td>
                <td>${user.role}</td>
                <td><button class="create" data-user-id="${user.id}">Créer</button></td>
                <td><button class="delete" data-user-id="${user.id}">Supprimer</button></td>
            </tr>
        `).join("");

        // Réattacher les événements aux nouveaux boutons
        attachButtonEvents();
    }

    // Fonction pour charger les comptes existants
    async function loadExistingAccounts() {
        try {
            const response = await fetch("https://backend-m6sm.onrender.com/public/users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des comptes");
            }

            const users = await response.json();
            displayExistingAccounts(users);
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger les comptes existants");
        }
    }

    // Fonction pour afficher les comptes existants
    function displayExistingAccounts(users) {
        const tbody = document.getElementById("accounts-body");
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.nom}</td>
                <td>${user.prenom}</td>
                <td>${user.departement}</td>
                <td>${user.role}</td>
                <td><button class="modify" data-user-id="${user.id}">Modifier</button></td>
                <td><button class="delete" data-user-id="${user.id}">Supprimer</button></td>
            </tr>
        `).join("");

        // Réattacher les événements aux nouveaux boutons
        attachButtonEvents();
    }

    // Fonction pour réattacher les événements aux boutons
    function attachButtonEvents() {
        // Réattacher les événements aux boutons Créer
        document.querySelectorAll(".create").forEach(button => {
            button.addEventListener("click", async function () {
                const userId = this.getAttribute("data-user-id");
                try {
                    const response = await fetch(`https://backend-m6sm.onrender.com/admin/approve-user/${userId}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            is_approved: true
                        })
                    });

                    if (response.ok) {
                        alert("Un nouveau compte a été créé !");
                        loadPendingRequests();
                        loadExistingAccounts();
                    } else {
                        alert("Erreur lors de la création du compte");
                    }
                } catch (error) {
                    console.error("Erreur:", error);
                    alert("Erreur lors de la création du compte");
                }
            });
        });

        // Réattacher les événements aux boutons Modifier
        document.querySelectorAll(".modify").forEach(button => {
            button.addEventListener("click", function () {
                const userId = this.getAttribute("data-user-id");
                window.location.href = `RH-modify-user.html?id=${userId}`;
            });
        });

        // Réattacher les événements aux boutons Supprimer
        document.querySelectorAll(".delete").forEach(button => {
            button.addEventListener("click", async function () {
                const userId = this.getAttribute("data-user-id");
                if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
                    try {
                        const response = await fetch(`https://backend-m6sm.onrender.com/admin/users/${userId}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            this.closest("tr").remove();
                            alert("Élément supprimé !");
                            loadPendingRequests();
                            loadExistingAccounts();
                        } else {
                            alert("Erreur lors de la suppression");
                        }
                    } catch (error) {
                        console.error("Erreur:", error);
                        alert("Erreur lors de la suppression");
                    }
                }
            });
        });
    }

    // Fonctions utilitaires pour les messages
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
    }
});

// Function to open/close the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

// Gestion de l'image de profil
document.addEventListener("DOMContentLoaded", function () {
    const profilePic = document.querySelector(".profileimg");
    if (profilePic) {
        profilePic.addEventListener("click", function () {
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.background = "rgba(0, 0, 0, 0.7)";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.zIndex = "1000";

            const enlargedImg = document.createElement("img");
            enlargedImg.src = profilePic.src;
            enlargedImg.style.width = "300px";
            enlargedImg.style.height = "300px";
            enlargedImg.style.borderRadius = "50%";
            enlargedImg.style.border = "5px solid white";
            enlargedImg.style.cursor = "pointer";

            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", function () {
                document.body.removeChild(overlay);
            });
        });
    }
});
