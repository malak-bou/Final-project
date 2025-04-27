// Vérification du token
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '../index.html';
}

// Function to open/close the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    // Check the current width of the sidebar and adjust it
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; // Close the sidebar
    } else {
        sidebar.style.width = "250px"; // Open the sidebar
    }
}

// Fermer la sidebar quand on clique en dehors
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.querySelector('.menuicon');
    
    if (sidebar && !sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
        sidebar.style.width = "0";
    }
});

// Fonction pour charger les demandes en attente
async function loadPendingRequests() {
    try {
        const response = await fetch('https://backend-m6sm.onrender.com/admin/pending-users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des demandes');
        }

        const requests = await response.json();
        const requestsBody = document.getElementById('requests-body');
        requestsBody.innerHTML = '';

        if (requests.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center;">Aucune demande en attente</td>';
            requestsBody.appendChild(row);
            return;
        }

        requests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${request.nom || ''}</td>
                <td>${request.prenom || ''}</td>
                <td>${request.departement || ''}</td>
                <td>${request.role || ''}</td>
                <td><button class="create" data-id="${request._id}">Valider</button></td>
                <td><button class="delete" data-id="${request._id}">Supprimer</button></td>
            `;
            requestsBody.appendChild(row);
        });

        setupValidationButtons();
        setupDeleteButtons();

    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur lors du chargement des demandes', 'error');
    }
}

// Fonction pour charger les comptes existants
async function loadExistingAccounts() {
    try {
        const response = await fetch('https://backend-m6sm.onrender.com/public/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des comptes');
        }

        const accounts = await response.json();
        const accountsBody = document.getElementById('accounts-body');
        accountsBody.innerHTML = '';

        if (accounts.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center;">Aucun compte existant</td>';
            accountsBody.appendChild(row);
            return;
        }

        accounts.forEach(account => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${account.nom || ''}</td>
                <td>${account.prenom || ''}</td>
                <td>${account.departement || ''}</td>
                <td>${account.role || ''}</td>
                <td><button class="modify" data-id="${account._id}" data-nom="${account.nom}" data-prenom="${account.prenom}" data-departement="${account.departement}" data-role="${account.role}">Modifier</button></td>
                <td><button class="delete" data-id="${account._id}">Supprimer</button></td>
            `;
            accountsBody.appendChild(row);
        });

        setupModifyButtons();
        setupDeleteButtons();

    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur lors du chargement des comptes', 'error');
    }
}

// Configuration des boutons de validation
function setupValidationButtons() {
    const modal = document.getElementById('confirmationModal');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    let currentRequestId = null;

    document.querySelectorAll('.create').forEach(button => {
        button.addEventListener('click', (e) => {
            currentRequestId = e.target.dataset.id;
            modal.style.display = 'block';
        });
    });

    confirmBtn.addEventListener('click', async () => {
        if (currentRequestId) {
            try {
                const response = await fetch(`https://backend-m6sm.onrender.com/admin/approve-user/${currentRequestId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la validation');
                }

                showAlert('Compte validé avec succès', 'success');
                loadPendingRequests();
                loadExistingAccounts();

            } catch (error) {
                console.error('Erreur:', error);
                showAlert('Erreur lors de la validation', 'error');
            }
        }
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Configuration des boutons de modification
function setupModifyButtons() {
    const editPopup = document.getElementById('confirmEditPopup');
    const confirmEditBtn = document.getElementById('confirmEditBtn');
    let currentAccountId = null;
    let currentAccountData = null;

    document.querySelectorAll('.modify').forEach(button => {
        button.addEventListener('click', (e) => {
            currentAccountId = e.target.dataset.id;
            currentAccountData = {
                nom: e.target.dataset.nom,
                prenom: e.target.dataset.prenom,
                departement: e.target.dataset.departement,
                role: e.target.dataset.role
            };
            
            // Remplir le formulaire de modification
            document.getElementById('editNom').value = currentAccountData.nom;
            document.getElementById('editPrenom').value = currentAccountData.prenom;
            document.getElementById('editDepartement').value = currentAccountData.departement;
            document.getElementById('editRole').value = currentAccountData.role;
            
            editPopup.style.display = 'block';
        });
    });

    confirmEditBtn.addEventListener('click', async () => {
        if (currentAccountId) {
            try {
                const updatedData = {
                    nom: document.getElementById('editNom').value,
                    prenom: document.getElementById('editPrenom').value,
                    departement: document.getElementById('editDepartement').value,
                    role: document.getElementById('editRole').value
                };

                const response = await fetch(`https://backend-m6sm.onrender.com/admin/update-user/${currentAccountId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la modification');
                }

                showAlert('Compte modifié avec succès', 'success');
                loadExistingAccounts();
                closeEditConfirmPopup();

            } catch (error) {
                console.error('Erreur:', error);
                showAlert('Erreur lors de la modification', 'error');
            }
        }
    });
}

// Configuration des boutons de suppression
function setupDeleteButtons() {
    const deletePopup = document.getElementById('confirmDeletePopup');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let currentRequestId = null;

    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', (e) => {
            currentRequestId = e.target.dataset.id;
            deletePopup.style.display = 'block';
        });
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        if (currentRequestId) {
            try {
                const response = await fetch(`https://backend-m6sm.onrender.com/admin/reject-user/${currentRequestId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }

                showAlert('Demande supprimée avec succès', 'success');
                loadPendingRequests();
                loadExistingAccounts();

            } catch (error) {
                console.error('Erreur:', error);
                showAlert('Erreur lors de la suppression', 'error');
            }
        }
        deletePopup.style.display = 'none';
    });
}

// Fonction pour fermer le popup de modification
function closeEditConfirmPopup() {
    document.getElementById('confirmEditPopup').style.display = 'none';
}

// Fonction pour fermer le popup de suppression
function closeDeleteConfirmPopup() {
    document.getElementById('confirmDeletePopup').style.display = 'none';
}

// Fonction pour afficher les alertes
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Fonction de recherche
document.getElementById('search-bar').addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase().trim();
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const name = row.cells[0]?.textContent.toLowerCase();
            const prenom = row.cells[1]?.textContent.toLowerCase();
            
            if (name.includes(searchText) || prenom.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

// Chargement initial des données
document.addEventListener('DOMContentLoaded', () => {
    loadPendingRequests();
    loadExistingAccounts();
});

// Styles pour les alertes
const style = document.createElement('style');
style.textContent = `
    .alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    }
    .success {
        background-color: #4CAF50;
    }
    .error {
        background-color: #f44336;
    }
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .sidebar {
        transition: width 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);
