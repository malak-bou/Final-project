// Gestion de la sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

// Gestion de la recherche
document.getElementById("search-bar").addEventListener("input", filterTable);

function filterTable() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase().trim();
    const requestsRows = document.querySelectorAll("#requests-body tr");
    const accountsRows = document.querySelectorAll(".accounts tbody tr");

    filterRows(requestsRows, searchValue);
    filterRows(accountsRows, searchValue);
}

function filterRows(rows, value) {
    rows.forEach(row => {
        const name = row.cells[0]?.textContent.toLowerCase();
        const prenom = row.cells[1]?.textContent.toLowerCase();
        const department = row.cells[2]?.textContent.toLowerCase();

        if (name.includes(value) || prenom.includes(value) || department.includes(value)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Gestion des demandes de compte
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../index.html";
        return;
    }

    const requestsBody = document.getElementById("requests-body");
    const accountsBody = document.getElementById("accounts-body");
    const modal = document.getElementById("confirmationModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    let selectedUserId = null;

    // Charger les demandes en attente
    async function loadPendingRequests() {
        try {
            const response = await fetch("https://backend-m6sm.onrender.com/admin/pending-users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Erreur lors du chargement des demandes");

            const users = await response.json();
            displayPendingRequests(users);
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger les demandes en attente");
        }
    }

    // Afficher les demandes en attente
    function displayPendingRequests(users) {
        if (!requestsBody) return;

        requestsBody.innerHTML = users.map(user => `
            <tr data-user-id="${user.id}">
                <td>${user.nom || ''}</td>
                <td>${user.prenom || ''}</td>
                <td>${user.departement || ''}</td>
                <td>${user.role || ''}</td>
                <td><button class="create" data-user-id="${user.id}">Accepter</button></td>
                <td><button class="delete" data-user-id="${user.id}">Refuser</button></td>
            </tr>
        `).join("");

        // Attacher les événements
        attachPendingRequestEvents();
    }

    function attachPendingRequestEvents() {
        // Gérer le clic sur Accepter
        document.querySelectorAll(".create").forEach(button => {
            button.addEventListener("click", function() {
                selectedUserId = this.getAttribute("data-user-id");
                modal.style.display = "block";
            });
        });

        // Gérer le clic sur Refuser
        document.querySelectorAll(".delete").forEach(button => {
            button.addEventListener("click", async function() {
                const userId = this.getAttribute("data-user-id");
                if (confirm("Voulez-vous vraiment refuser cette demande ?")) {
                    try {
                        const response = await fetch(`https://backend-m6sm.onrender.com/admin/users/${userId}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            showSuccess("Demande refusée avec succès");
                            loadPendingRequests();
                        } else {
                            throw new Error("Erreur lors du refus de la demande");
                        }
                    } catch (error) {
                        console.error("Erreur:", error);
                        showError("Impossible de refuser la demande");
                    }
                }
            });
        });
    }

    // Gérer la confirmation d'acceptation
    confirmBtn.addEventListener("click", async function() {
        if (!selectedUserId) return;

        try {
            const response = await fetch(`https://backend-m6sm.onrender.com/admin/approve-user/${selectedUserId}`, {
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
                showSuccess("Compte créé avec succès");
                loadPendingRequests();
                loadExistingAccounts();
            } else {
                throw new Error("Erreur lors de la création du compte");
            }
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de créer le compte");
        }

        modal.style.display = "none";
        selectedUserId = null;
    });

    // Gérer l'annulation
    cancelBtn.addEventListener("click", function() {
        modal.style.display = "none";
        selectedUserId = null;
    });

    // Fermer le modal en cliquant à l'extérieur
    window.addEventListener("click", function(e) {
        if (e.target == modal) {
            modal.style.display = "none";
            selectedUserId = null;
        }
    });

    // Fonctions utilitaires
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

    // Charger les données initiales
    loadPendingRequests();
    loadExistingAccounts();
});
