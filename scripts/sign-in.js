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

// Gestion du département
const departementSelect = document.getElementById("departement");
if (departementSelect) {
    departementSelect.addEventListener("change", function() {
        console.log("Département choisi:", this.value);
    });
}

// Gestion du formulaire d'inscription
const form = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const emailRegex = /^[a-z]+(?:\.[a-z]+)*@GIG\.com$/;

// Fonction pour afficher les messages d'erreur
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

// Fonction pour masquer les messages d'erreur
function hideError(element) {
    element.style.display = 'none';
}

// Fonction pour valider le formulaire
function validateForm(formData) {
    const errors = [];
    
    // Validation de l'email
    if (!emailRegex.test(formData.get('email'))) {
        errors.push('Format d\'email invalide. Utilisez un email @GIG.com');
    }
    
    // Validation du mot de passe
    if (formData.get('password').length < 6) {
        errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }
    
    // Validation de la confirmation du mot de passe
    if (formData.get('password') !== formData.get('confirmer-password')) {
        errors.push('Les mots de passe ne correspondent pas');
    }
    
    // Validation des champs requis
    const requiredFields = ['nom', 'prenom', 'departement', 'role'];
    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            errors.push(`Le champ ${field} est requis`);
        }
    });
    
    return errors;
}

// Gestion de la soumission du formulaire
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Masquer tous les messages d'erreur
        hideError(emailError);
        
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        const data = {
            nom: formData.get('nom'),
            prenom: formData.get('prenom'),
            email: formData.get('email'),
            password: formData.get('password'),
            departement: formData.get('departement'),
            role: formData.get('role')
        };
        
        // Valider le formulaire
        const errors = validateForm(formData);
        if (errors.length > 0) {
            errors.forEach(error => {
                showError(emailError, error);
            });
            return;
        }
        
        try {
            // Envoyer les données au backend
            const response = await fetch('https://backend-m6sm.onrender.com/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de l\'inscription');
            }
            
            // Succès
            alert('Inscription réussie ! Votre compte est en attente de validation.');
            form.reset();
            window.location.href = "../pages/log-in.html";
            
        } catch (error) {
            console.error('Erreur:', error);
            showError(emailError, error.message || 'Une erreur est survenue lors de l\'inscription');
        }
    });
}

// Gestion des changements dans le champ email
if (emailInput) {
    emailInput.addEventListener('input', () => {
        hideError(emailError);
    });
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
`;
document.head.appendChild(style);
