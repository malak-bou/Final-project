document.addEventListener("DOMContentLoaded", function () {
    // Éléments du DOM
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const submitButton = form.querySelector('button[type="submit"]');

    // Gestion de l'affichage/masquage du mot de passe
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
        });
    }

    // Fonction pour afficher les messages d'erreur
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Supprimer l'ancien message d'erreur s'il existe
        const oldError = form.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }
        
        form.appendChild(errorDiv);
    }

    // Fonction pour afficher les messages de succès
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Fonction pour gérer l'état de chargement
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.innerHTML = isLoading ? 
            '<span class="spinner"></span> Connexion en cours...' : 
            'Se connecter';
    }

    // Gestion de la soumission du formulaire
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation des champs
        if (!email || !password) {
            showError("Veuillez remplir tous les champs.");
            return;
        }

        setLoading(true);

        try {
            // Connexion
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

                // Récupérer les informations de l'utilisateur
                const userResponse = await fetch("https://backend-m6sm.onrender.com/users/me", {
                    headers: {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                });

                const userData = await userResponse.json();

                if (userResponse.ok) {
                    const role = userData.profile.fonction;
                    
                    // Stocker les informations utilisateur
                    localStorage.setItem("userRole", role);
                    localStorage.setItem("userData", JSON.stringify(userData.profile));

                    // Afficher un message de succès
                    showSuccess("Connexion réussie ! Redirection...");

                    // Redirection en fonction du rôle
                    const roleRoutes = {
                        "admin": "../pages/RH-dashboard.html",
                        "prof": "../pages/dashboardprof.html",
                        "employer": "../pages/user/user-dashboard.html"
                    };

                    const redirectUrl = roleRoutes[role];
                    if (redirectUrl) {
                        setTimeout(() => {
                            window.location.href = redirectUrl;
                        }, 1000);
                    } else {
                        showError("Rôle non reconnu !");
                    }
                } else {
                    throw new Error("Erreur lors de la récupération des informations utilisateur.");
                }
            } else {
                showError(data.detail || "Email ou mot de passe incorrect.");
            }
        } catch (err) {
            console.error("Erreur de requête :", err);
            showError("Une erreur est survenue. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    });
});
