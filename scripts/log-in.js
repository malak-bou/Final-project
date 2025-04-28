document.addEventListener("DOMContentLoaded", function () {
    // Éléments du DOM
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");
    const form = document.querySelector("form");
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Variables de sécurité
    let loginAttempts = 0;
    const MAX_LOGIN_ATTEMPTS = 3;
    const ADMIN_EMAIL = "admin@gig.dz";

    // Fonction pour valider l'email
    function isValidEmail(email) {
        const emailRegex = /^[a-z]+(?:\.[a-z]+)*@GIG\.com$/;
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

    // Fonction pour gérer l'état de chargement
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.innerHTML = isLoading ? 
            '<span class="spinner"></span> Connexion en cours...' : 
            'Se connecter';
    }

    // Gestion de l'affichage/masquage du mot de passe
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.textContent = type === "password" ? "👁️" : "👁️‍";
        });
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

        if (!isValidEmail(email)) {
            showError("Veuillez utiliser votre adresse email GIG (@GIG.com).");
            return;
        }

        // Vérification spéciale pour le compte admin
        if (email === ADMIN_EMAIL && password !== "admin123") {
            showError("Mot de passe incorrect pour le compte administrateur.");
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
                loginAttempts++;
                
                if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                    showError("Trop de tentatives. Veuillez réessayer plus tard.");
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

// Styles pour les messages
const style = document.createElement('style');
style.textContent = `
    .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background-color: #4CAF50;
        color: white;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    }
    
    .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background-color: #f44336;
        color: white;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
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

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 10px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
