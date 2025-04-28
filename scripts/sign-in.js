// Gestion de l'affichage/masquage des mots de passe
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

// Redirection vers la page de connexion
const redirectButton1 = document.querySelector(".btn-submit1");
if (redirectButton1) {
    redirectButton1.addEventListener("click", function () {
        window.location.href = "../pages/log-in.html";
    });
}


    // Redirection si on clique sur un bouton spécifique
    const redirectButton = document.querySelector(".btn-submit");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/user/user-dashboard.html";
        });
    }


// Gestion du formulaire d'inscription
const form = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const emailRegex = /^[a-zA-Z]+(?:\.[a-zA-Z]+)*@GIG\.com$/;

// Fonction pour afficher les messages d'erreur
function showError(message) {
    emailError.textContent = message;
    emailError.style.display = 'block';
}


    const departementSelect = document.getElementById("departement");
    const departementChoisi = departementSelect.value;
    console.log("Département choisi :", departementChoisi);

    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Gestion de la soumission du formulaire
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Masquer les messages d'erreur
        hideError();
        
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        const data = {
            nom: formData.get('nom'),
            prenom: formData.get('prenom'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            departement: formData.get('departement'),
            role: formData.get('fonction'),
            telephone: formData.get('telephone')
        };
        
        // Validation de l'email
        if (!emailRegex.test(data.email)) {
            showError('Format d\'email invalide. Utilisez un email @GIG.com');
            return;
        }
        
        // Validation des mots de passe
        if (data.password.length < 6) {
            showError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        
        if (data.password !== data.confirm_password) {
            showError('Les mots de passe ne correspondent pas');
            return;
        }
        
        try {
            // Envoyer les données au backend
            const response = await fetch('https://backend-m6sm.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.detail || 'Erreur lors de l\'inscription');
            }
            
            // Succès
            showSuccess('Inscription réussie ! Votre compte est en attente de validation.');
            form.reset();
            
            // Redirection après 2 secondes
            setTimeout(() => {
                window.location.href = "../pages/log-in.html";
            }, 2000);
            
        } catch (error) {
            console.error('Erreur:', error);
            showError(error.message || 'Une erreur est survenue lors de l\'inscription');
        }
    });
}

// Gestion des changements dans le champ email
if (emailInput) {
    emailInput.addEventListener('input', () => {

        emailError.style.display = 'none';
    });
