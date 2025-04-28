document.addEventListener("DOMContentLoaded", function () {
    // Sidebar toggle function
    function toggleNav() {
        let sidebar = document.getElementById("sidebar");
        sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
    }

    document.querySelector(".menu-icon").addEventListener("click", toggleNav);
    document.querySelector(".close-btn").addEventListener("click", toggleNav);

    // Fetch user profile data from backend
    async function fetchUserProfile() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login.html';
                return;
            }

            const response = await fetch('/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const userData = await response.json();
            updateProfileUI(userData);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            showError('Failed to load profile data');
        }
    }

    // Update UI with user data
    function updateProfileUI(userData) {
        // Update profile information
        document.getElementById("nom").value = userData.profile.nom;
        document.getElementById("prenom").value = userData.profile.prenom;
        document.getElementById("email").value = userData.profile.email;
        document.getElementById("telephone").value = userData.profile.telephone;
        document.getElementById("departement").value = userData.profile.departement;
        document.getElementById("fonction").value = userData.profile.fonction;

        // Update statistics
        document.getElementById("totalCourses").textContent = userData.statistics.total_cours_suivis;
        document.getElementById("completedCourses").textContent = userData.statistics.cours_termines;
        document.getElementById("averageProgress").textContent = userData.statistics.progression_moyenne;

        // Update courses table
        updateCoursesTable(userData.courses);
    }

    // Update courses table
    function updateCoursesTable(courses) {
        const courseTableBody = document.getElementById("courseTableBody");
        courseTableBody.innerHTML = '';

        courses.forEach(course => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${course.nom_du_cours}</td>
                <td>
                    <div class="progress-bar">
                        <span style="width: ${course.progres}"></span>
                    </div>
                    ${course.progres}
                </td>
                <td>${course.date_debut}</td>
                <td>${course.date_fin}</td>
                <td>${course.statut}</td>
            `;
            courseTableBody.appendChild(row);
        });
    }

    // Profile picture handling
    const profilePic = document.getElementById("profilePic");
    const uploadInput = document.getElementById("uploadProfilePic");
    const changePicBtn = document.getElementById("changePicBtn");
    const deletePicBtn = document.getElementById("deletePicBtn");
    const defaultImage = "./profil-pic.png";

    // Function to open overlay with enlarged image
    profilePic.addEventListener("click", function () {
        const existingOverlay = document.getElementById("imgOverlay");
        if (existingOverlay) {
            existingOverlay.remove();
        }

        const overlay = document.createElement("div");
        overlay.id = "imgOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0, 0, 0, 0.7)";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "1000";

        const enlargedImg = document.createElement("img");
        enlargedImg.src = profilePic.src;
        enlargedImg.style.width = "300px";
        enlargedImg.style.height = "300px";
        enlargedImg.style.borderRadius = "50%";
        enlargedImg.style.border = "5px solid white";
        enlargedImg.style.cursor = "pointer";

        const btnContainer = document.createElement("div");
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "10px";
        btnContainer.style.marginTop = "10px";

        const newChangePicBtn = document.createElement("button");
        newChangePicBtn.textContent = "Modifier";
        newChangePicBtn.style.backgroundColor = "#7c3aed";
        newChangePicBtn.style.color = "white";
        newChangePicBtn.style.padding = "10px 15px";
        newChangePicBtn.style.border = "none";
        newChangePicBtn.style.borderRadius = "5px";
        newChangePicBtn.style.cursor = "pointer";
        newChangePicBtn.addEventListener("click", function () {
            uploadInput.click();
        });

        const newDeletePicBtn = document.createElement("button");
        newDeletePicBtn.textContent = "Supprimer";
        newDeletePicBtn.style.backgroundColor = "red";
        newDeletePicBtn.style.color = "white";
        newDeletePicBtn.style.padding = "10px 15px";
        newDeletePicBtn.style.border = "none";
        newDeletePicBtn.style.borderRadius = "5px";
        newDeletePicBtn.style.cursor = "pointer";
        newDeletePicBtn.addEventListener("click", function () {
            const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer votre photo de profil ?");
            if (confirmDelete) {
                profilePic.src = defaultImage;
                enlargedImg.src = defaultImage;
                localStorage.removeItem("profileImage");
                overlay.remove();
            }
        });

        btnContainer.appendChild(newChangePicBtn);
        btnContainer.appendChild(newDeletePicBtn);
        overlay.appendChild(enlargedImg);
        overlay.appendChild(btnContainer);
        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    });

    // Upload profile picture
    uploadInput.addEventListener("change", async function (event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/users/me/profile-picture', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload profile picture');
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    profilePic.src = e.target.result;
                    localStorage.setItem("profileImage", e.target.result);

                    const enlargedImg = document.querySelector("#imgOverlay img");
                    if (enlargedImg) {
                        enlargedImg.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                showError('Failed to upload profile picture');
            }
        }
    });

    // Load saved profile picture from local storage
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        profilePic.src = savedImage;
    }

    // Error handling function
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.querySelector('.profile-container').prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    // Initialize the page
    fetchUserProfile();
});
