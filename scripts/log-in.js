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
        event.preventDefault(); // Empêche l'envoi par défaut

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            // 1. Connexion - envoyer email et password à backend
            const response = await fetch("https://backend-m6sm.onrender.com/token", {
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
                // Stocker le token
                localStorage.setItem("token", data.access_token);

                // 2. Récupérer les informations de l'utilisateur
                const userResponse = await fetch("https://backend-m6sm.onrender.com/users/me", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + data.access_token
                    }
                });

                const userData = await userResponse.json();

                if (userResponse.ok) {
                    const role = userData.profile.fonction; // Récupérer le rôle

                    // Redirection en fonction du rôle
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
                alert("Erreur de connexion : " + (data.detail || "Vérifiez vos identifiants."));
            }

        } catch (err) {
            console.error("Erreur de requête :", err);
            alert("Impossible de contacter le serveur.");
        }
    });

    // Redirection vers création de compte
    const redirectButton = document.querySelector(".btn-submit1");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/Sign-in.html";
        });
    }
});
