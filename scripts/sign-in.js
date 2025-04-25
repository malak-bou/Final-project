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
    const redirectButton = document.querySelector(".btn-submit");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/user/user-dashboard.html";
        });
    }

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
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    if (response.ok) {
      alert("Compte créé avec succès !");
      // Redirection vers la page de connexion
      window.location.href = "log-in.html";
    } else {
      alert("Erreur : " + data.detail);
    }

  } catch (err) {
    console.error("Erreur de requête :", err);
    alert("Impossible de contacter le serveur.");
  }
});
