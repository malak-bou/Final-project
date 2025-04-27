document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");
    const form = document.querySelector("form");
    const submitButton = form.querySelector('button[type="submit"]');
    let loginAttempts = 0;
    const MAX_LOGIN_ATTEMPTS = 3;
    const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes en millisecondes

    // Fonction pour valider l'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Fonction pour afficher les messages d'erreur
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.marginTop = '10px';
        errorDiv.textContent = message;
        
        // Supprimer l'ancien message d'erreur s'il existe
        const oldError = form.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }
        
        form.appendChild(errorDiv);
    }

    // Fonction pour gérer l'état de chargement
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.innerHTML = isLoading ? 
            '<span class="spinner"></span> Connexion en cours...' : 
            'Se connecter';
    }

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.textContent = type === "password" ? "👁️" : "👁️‍��️";
        });
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation des champs
        if (!email || !password) {
            showError("Veuillez remplir tous les champs.");
            return;
        }

        if (!isValidEmail(email)) {
            showError("Veuillez entrer une adresse email valide.");
            return;
        }

        // Vérification du nombre de tentatives
        const lastAttemptTime = localStorage.getItem('lastLoginAttempt');
        if (lastAttemptTime && Date.now() - parseInt(lastAttemptTime) < LOCKOUT_TIME) {
            const remainingTime = Math.ceil((LOCKOUT_TIME - (Date.now() - parseInt(lastAttemptTime))) / 60000);
            showError(`Trop de tentatives. Veuillez réessayer dans ${remainingTime} minutes.`);
            return;
        }

        setLoading(true);

        try {
            // 1. Connexion
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
                // Réinitialiser le compteur de tentatives en cas de succès
                loginAttempts = 0;
                localStorage.removeItem('lastLoginAttempt');
                
                // Stocker le token
                localStorage.setItem("token", data.access_token);

                // 2. Récupérer les informations de l'utilisateur
                const userResponse = await fetch("https://backend-m6sm.onrender.com/users/me", {
                    method: "GET",
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

                    // Redirection en fonction du rôle
                    const roleRoutes = {
                        "admin": "../pages/admin/admin-dashboard.html",
                        "prof": "../pages/dashboardprof.html",
                        "employer": "../pages/user/user-dashboard.html"
                    };

                    const redirectUrl = roleRoutes[role];
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        showError("Rôle non reconnu !");
                    }
                } else {
                    throw new Error("Erreur lors de la récupération des informations utilisateur.");
                }
            } else {
                loginAttempts++;
                localStorage.setItem('lastLoginAttempt', Date.now().toString());
                
                if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                    showError(`Trop de tentatives. Veuillez réessayer dans 15 minutes.`);
                } else {
                    showError(data.detail || "Email ou mot de passe incorrect.");
                }
            }
        } catch (err) {
            console.error("Erreur de requête :", err);
            showError("Une erreur est survenue. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
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
