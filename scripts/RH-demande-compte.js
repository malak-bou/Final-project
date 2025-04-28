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






  // Run filter every time the input changes
  document.getElementById("search-bar").addEventListener("input", filterTable);

  function filterTable() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase().trim();

    // Rows from "Les demandes"
    const requestsRows = document.querySelectorAll("#requests-body tr");

    // Rows from "La liste des comptes"
    const accountsRows = document.querySelectorAll(".accounts tbody tr");

    filterRows(requestsRows, searchValue);
    filterRows(accountsRows, searchValue);
  }

  function filterRows(rows, value) {
    rows.forEach(row => {
        const name = row.cells[0]?.textContent.toLowerCase();
        const prenom = row.cells[1]?.textContent.toLowerCase();
        

      if (name.includes(value) || prenom.includes(value)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

// valider le compet


document.addEventListener("DOMContentLoaded", function () {
  const requestsBody = document.getElementById("requests-body");
  const accountsBody = document.getElementById("accounts-body");
  const modal = document.getElementById("confirmationModal");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  let selectedRow = null;

  requestsBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("create")) {
      selectedRow = e.target.closest("tr");
      modal.style.display = "block";
    }
  });

  confirmBtn.addEventListener("click", function () {
    if (selectedRow) {
      const nom = selectedRow.cells[0].textContent;
      const prenom = selectedRow.cells[1].textContent;
      const department = selectedRow.cells[2].textContent;
      const fonction = selectedRow.cells[3].textContent;

      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${nom}</td>
        <td>${prenom}</td>
        <td>${department}</td>
        <td>${fonction}</td>
        <td><button class="modify">Modifier</button></td>
        <td><button class="delete">Supprimer</button></td>
      `;
      accountsBody.appendChild(newRow);
      selectedRow.remove();
    }
    modal.style.display = "none";
  });

  cancelBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
});

// modify


            const users = await response.json();
            displayExistingAccounts(users);
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger les comptes existants");
        }
    }


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
  
    // Fermer le popup
    document.getElementById("confirmEditPopup").style.display = "none";
  }
  

  document.addEventListener("DOMContentLoaded", function () {
    // Gestion du bouton "Modifier"
    document.querySelectorAll(".modify").forEach(btn => {
      btn.addEventListener("click", function (e) {
        const row = e.target.closest("tr");

        if (e.target.textContent === "Modifier") {
          for (let i = 0; i < 4; i++) {
            const cell = row.cells[i];
            const input = document.createElement("input");
            input.defaultValue = cell.textContent;
            input.value = cell.textContent;
            cell.innerHTML = "";
            cell.appendChild(input);
          }
          e.target.textContent = "Enregistrer";
        } else {
          // Stocker la ligne temporaire + montrer le pop-up
          editRow = row;
          showEditConfirmPopup();
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
  

