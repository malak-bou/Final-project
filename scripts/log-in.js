document.addEventListener("DOMContentLoaded", function () {
    // Password toggle functionality
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
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            // Login request
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
                // Store token
                localStorage.setItem("token", data.access_token);

                // Get user information
                const userResponse = await fetch("https://backend-m6sm.onrender.com/users/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                });

                const userData = await userResponse.json();

                if (userResponse.ok) {
                    // Check if user is approved
                    if (!userData.profile.is_approved) {
                        alert("Votre compte n'est pas encore approuvé par l'administrateur.");
                        return;
                    }

                    const role = userData.profile.role; // Changed from fonction to role

                    // Redirect based on role
                    switch (role) {
                        case "admin":
                            window.location.href = "../pages/admin/admin-dashboard.html";
                            break;
                        case "prof":
                            window.location.href = "../pages/dashboardprof.html";
                            break;
                        case "employer":
                            window.location.href = "../pages/user/user-dashboard.html";
                            break;
                        default:
                            alert("Rôle non reconnu !");
                    }
                } else {
                    alert("Erreur lors de la récupération des informations utilisateur.");
                }
            } else {
                // Handle specific error messages
                if (data.detail === "Incorrect email or password") {
                    alert("Email ou mot de passe incorrect.");
                } else if (data.detail === "Account not approved yet") {
                    alert("Votre compte n'est pas encore approuvé par l'administrateur.");
                } else {
                    alert("Erreur de connexion : " + (data.detail || "Vérifiez vos identifiants."));
                }
            }

        } catch (err) {
            console.error("Erreur de requête :", err);
            alert("Impossible de contacter le serveur.");
        }
    });

    // Redirect to sign up page
    const redirectButton = document.querySelector(".btn-submit1");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/Sign-in.html";
        });
    }
});
