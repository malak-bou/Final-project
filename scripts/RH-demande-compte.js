
// Vérification du token
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '../index.html';
}

// Function to open/close the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
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




// agrandissement de limage 

        setupModifyButtons();
        setupDeleteButtons();

    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors du chargement des comptes');
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
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        is_approved: true
                    })
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la validation');
                }

                showSuccess('Compte validé avec succès');
                loadPendingRequests();
                loadExistingAccounts();

            } catch (error) {
                console.error('Erreur:', error);
                showError('Erreur lors de la validation');
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

    document.querySelectorAll('.modify').forEach(button => {
        button.addEventListener('click', (e) => {
            currentAccountId = e.target.dataset.id;
            const row = e.target.closest('tr');
            
            // Remplir le formulaire de modification
            document.getElementById('editNom').value = row.cells[0].textContent;
            document.getElementById('editPrenom').value = row.cells[1].textContent;
            document.getElementById('editDepartement').value = row.cells[2].textContent;
            document.getElementById('editRole').value = row.cells[3].textContent;
            
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

                showSuccess('Compte modifié avec succès');
                loadExistingAccounts();
                closeEditConfirmPopup();

            } catch (error) {
                console.error('Erreur:', error);
                showError('Erreur lors de la modification');
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
                const response = await fetch(`https://backend-m6sm.onrender.com/admin/users/${currentRequestId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }

                showSuccess('Compte supprimé avec succès');
                loadPendingRequests();
                loadExistingAccounts();

            } catch (error) {
                console.error('Erreur:', error);
                showError('Erreur lors de la suppression');
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

// Fonction pour afficher les messages d'erreur
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Fonction pour afficher les messages de succès
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
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


  let editRow = null;

  function showEditConfirmPopup() {
    document.getElementById("confirmEditPopup").style.display = "flex";
  }

  function closeEditConfirmPopup() {
    if (editRow) {
      // Annuler les modifications visuelles (remettre le texte original)
      for (let i = 0; i < 4; i++) {
        const cell = editRow.cells[i];
        const input = cell.querySelector("input");
        if (input) {
          cell.textContent = input.defaultValue; // valeur initiale
        }
      }
      // Remettre le bouton à "Modifier"
      editRow.querySelector(".modify").textContent = "Modifier";
      editRow = null;

    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }

      });
    });

    // Bouton "Oui" dans le pop-up
    document.getElementById("confirmEditBtn").addEventListener("click", function () {
      if (!editRow) return;

      for (let i = 0; i < 4; i++) {
        const cell = editRow.cells[i];
        const input = cell.querySelector("input");
        if (input) {
          cell.textContent = input.value;
        }
      }

      editRow.querySelector(".modify").textContent = "Modifier";
      editRow = null;
      closeEditConfirmPopup();
    });
  });

  let rowToDelete = null;

  function setupDeleteConfirmation() {
    document.querySelectorAll(".delete").forEach(button => {
      button.addEventListener("click", function () {
        rowToDelete = this.closest("tr");
        document.getElementById("confirmDeletePopup").style.display = "flex";
      });
    });
  
    document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
      if (rowToDelete) {
        rowToDelete.remove();
        rowToDelete = null;
      }
      closeDeleteConfirmPopup();
    });
  }
  
  function closeDeleteConfirmPopup() {
    document.getElementById("confirmDeletePopup").style.display = "none";
    rowToDelete = null;
  }
  window.onload = function () {
    setupDeleteConfirmation();
    // appelle aussi d'autres fonctions ici si besoin
  };
  
