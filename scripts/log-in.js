document.addEventListener("DOMContentLoaded", function () {
    // Affichage du mot de passe
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        });
    }

    const form = document.querySelector("form");
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Annuler l'envoi par défaut

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            // Étape 1: Envoyer login
            const response = await fetch("http://127.0.0.1:8000/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    username: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Stocker token
                localStorage.setItem("token", data.access_token);

                // Étape 2: Récupérer infos user
                const userResponse = await fetch("http://127.0.0.1:8000/users/me", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + data.access_token
                    }
                });

                const userData = await userResponse.json();

                if (userResponse.ok) {
                    const role = userData.profile.fonction; // C'est ici le role

                    // Redirection selon le rôle
                    if (role === "admin") {
                        window.location.href = "../pages/admin/admin-dashboard.html";
                    } else if (role === "prof") {
                        window.location.href = "../pages/dashboardprof.html";
                    } else if (role === "employer") {
                        window.location.href = "../pages/user/user-dashboard.html";
                    } else {
                        alert("Rôle non reconnu !");
                    }
                } else {
                    alert("Erreur lors de la récupération des informations utilisateur.");
                }
            } else {
                alert("Erreur de connexion : " + data.detail);
            }

        } catch (err) {
            console.error("Erreur de requête :", err);
            alert("Impossible de contacter le serveur.");
        }
    });

    // Bouton "Créer un compte"
    const redirectButton = document.querySelector(".btn-submit1");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/Sign-in.html";
        });
    }
});
