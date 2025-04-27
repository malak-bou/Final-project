document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../index.html";
        return;
    }

    // Charger les comptes existants au démarrage
    loadExistingAccounts();

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
        const tbody = document.querySelector("tbody"); // Sélectionner le tbody de votre tableau
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.nom}</td>
                <td>${user.prenom}</td>
                <td>${user.departement}</td>
                <td>${user.role}</td>
                <td>
                    <button class="modifier" data-user-id="${user.id}">Modifier</button>
                </td>
                <td>
                    <button class="supprimer" data-user-id="${user.id}">Supprimer</button>
                </td>
            </tr>
        `).join("");

        // Attacher les événements aux boutons
        attachButtonEvents();
    }

    // Fonction pour attacher les événements aux boutons
    function attachButtonEvents() {
        // Événements pour les boutons Modifier
        document.querySelectorAll(".modifier").forEach(button => {
            button.addEventListener("click", function() {
                const userId = this.getAttribute("data-user-id");
                handleModify(userId);
            });
        });

        // Événements pour les boutons Supprimer
        document.querySelectorAll(".supprimer").forEach(button => {
            button.addEventListener("click", function() {
                const userId = this.getAttribute("data-user-id");
                handleDelete(userId);
            });
        });
    }

    // Fonction pour gérer la modification
    async function handleModify(userId) {
        try {
            // Récupérer les informations de l'utilisateur
            const response = await fetch(`https://backend-m6sm.onrender.com/public/users/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des informations");
            }

            const user = await response.json();

            // Créer le formulaire de modification
            const form = document.createElement("div");
            form.className = "modal";
            form.innerHTML = `
                <div class="modal-content">
                    <h2>Modifier l'utilisateur</h2>
                    <input type="text" id="nom" value="${user.nom}" placeholder="Nom">
                    <input type="text" id="prenom" value="${user.prenom}" placeholder="Prénom">
                    <input type="text" id="departement" value="${user.departement}" placeholder="Département">
                    <select id="role">
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        <option value="prof" ${user.role === 'prof' ? 'selected' : ''}>Professeur</option>
                        <option value="employer" ${user.role === 'employer' ? 'selected' : ''}>Employé</option>
                        <option value="etudiant" ${user.role === 'etudiant' ? 'selected' : ''}>Étudiant</option>
                    </select>
                    <button id="saveChanges">Enregistrer</button>
                    <button id="cancelChanges">Annuler</button>
                </div>
            `;

            document.body.appendChild(form);

            // Gérer la sauvegarde des modifications
            document.getElementById("saveChanges").addEventListener("click", async () => {
                const updatedUser = {
                    nom: document.getElementById("nom").value,
                    prenom: document.getElementById("prenom").value,
                    departement: document.getElementById("departement").value,
                    role: document.getElementById("role").value
                };

                try {
                    const updateResponse = await fetch(`https://backend-m6sm.onrender.com/admin/users/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedUser)
                    });

                    if (updateResponse.ok) {
                        showSuccess("Utilisateur modifié avec succès");
                        document.body.removeChild(form);
                        loadExistingAccounts(); // Recharger la liste
                    } else {
                        throw new Error("Erreur lors de la modification");
                    }
                } catch (error) {
                    showError("Erreur lors de la modification");
                }
            });

            // Gérer l'annulation
            document.getElementById("cancelChanges").addEventListener("click", () => {
                document.body.removeChild(form);
            });

        } catch (error) {
            showError("Erreur lors de la récupération des informations");
        }
    }

    // Fonction pour gérer la suppression
    async function handleDelete(userId) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                const response = await fetch(`https://backend-m6sm.onrender.com/admin/users/${userId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    showSuccess("Utilisateur supprimé avec succès");
                    loadExistingAccounts(); // Recharger la liste
                } else {
                    throw new Error("Erreur lors de la suppression");
                }
            } catch (error) {
                showError("Erreur lors de la suppression");
            }
        }
    }

    // Fonctions pour afficher les messages
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
