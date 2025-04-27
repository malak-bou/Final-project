const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        });
    }

    const passwordInput2 = document.getElementById("confirmer-password");
    const togglePassword2 = document.querySelector(".toggle-password1");
    if (togglePassword2) {
        togglePassword2.addEventListener("click", function () {
            passwordInput2.type = passwordInput2.type === "password" ? "text" : "password";
        });
    }

    

    // Redirection si on clique sur un bouton spécifique

    const redirectButton1 = document.querySelector(".btn-submit1");
    if (redirectButton1) {
        redirectButton1.addEventListener("click", function () {
            window.location.href = "../pages/log-in.html";
        });
    }




document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const user = {
    nom: document.getElementById("nom").value,
    prenom: document.getElementById("prenom").value,
    departement: document.getElementById("departement").value,
    role: document.getElementById("role").value,
    email: document.getElementById("email").value,
    telephone: document.getElementById("telephone").value,
    password: document.getElementById("password").value,
    confirm_password: document.getElementById("confirmer-password").value
  };

  try {
    const response = await fetch("https://backend-m6sm.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    if (response.ok) {
      alert("Compte créé avec succès ! En attente d'approbation par l'administrateur.");
      window.location.href = "../pages/log-in.html";
    } else {
      // Handle specific error messages
      if (data.detail === "Email already registered") {
        alert("Cette adresse email est déjà utilisée.");
      } else if (data.detail === "Passwords do not match") {
        alert("Les mots de passe ne correspondent pas.");
      } else {
        alert("Erreur : " + data.detail);
      }
    }

  } catch (err) {
    console.error("Erreur de requête :", err);
    alert("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
  }
});
