document.addEventListener("DOMContentLoaded", function () {
    // Gestion de l'affichage du mot de passe
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        });
    }

    // Validation du formulaire
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Empêche l'envoi par défaut

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Vérification des identifiants
        const validEmail = "moumouhalem6@gmail.com";
        const validPassword = "123456";
        const validEmail1 = "sellamiamine@gmail.com";
        const validPassword1 = "123456";
        const validEmail2 = "Bazouzimohammed@gmail.com";
        const validPassword2 = "123456";

        if (email === validEmail && password === validPassword) {
            // Redirection vers le tableau de bord
            window.location.href = "../pages/user/user-dashboard.html";
        } else { if(email === validEmail1 && password === validPassword1){
            window.location.href = "../pages/dashboardprof.html";
            } else{if(email === validEmail2 && password === validPassword2){
                window.location.href = "../pages/RH-dashboard.html";
            }else {
                alert("Email ou mot de passe incorrect.");
            }
            }
        }
    });

    // Redirection si on clique sur un bouton spécifique
    const redirectButton = document.querySelector(".btn-submit1");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/Sign-in.html";
        });
    }
});

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const credentials = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok) {
      alert("Connexion réussie !");
      // Stocker le token si nécessaire
      localStorage.setItem("token", data.token);
      // Redirection vers la page d'accueil ou tableau de bord
      window.location.href = "dashboard.html";
    } else {
      alert("Erreur : " + data.detail);
    }

  } catch (err) {
    console.error("Erreur de requête :", err);
    alert("Impossible de contacter le serveur.");
  }
});
