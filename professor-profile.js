import { 
    getUserProfile, 
    updateUserProfile, 
    getCourses, 
    createCourse, 
    requestConference, 
    getCalendar, 
    sendMessage, 
    getMessages,
    isAuthenticated
} from './api.js';

// DOM Elements
const profileName = document.getElementById('professorName');
const profileEmail = document.getElementById('professorEmail');
const profileForm = document.getElementById('profileForm');
const createCourseBtn = document.getElementById('createCourseBtn');
const courseForm = document.getElementById('courseForm');
const conferenceForm = document.getElementById('conferenceForm');
const sendMessageForm = document.getElementById('sendMessageForm');

// Navigation
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.dataset.section;
        showSection(section);
    });
});

// Show/Hide Course Form
createCourseBtn.addEventListener('click', () => {
    const form = document.getElementById('createCourseForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html'; // Redirect to login page if not authenticated
        return;
    }

    try {
        // Load profile data
        const profile = await getUserProfile();
        profileName.textContent = profile.full_name;
        profileEmail.textContent = profile.email;
        document.getElementById('profileName').value = profile.full_name;
        document.getElementById('profileEmail').value = profile.email;

        // Load dashboard data
        await loadDashboardData();
        
        // Load courses
        await loadCourses();
        
        // Load conferences
        await loadConferences();
        
        // Load messages
        await loadMessages();
    } catch (error) {
        console.error('Error loading initial data:', error);
        if (error.message.includes('Failed to fetch user profile')) {
            window.location.href = 'index.html'; // Redirect to login if token is invalid
        }
    }
});

// Profile Form Submission
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const profileData = {
            full_name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value
        };

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword && currentPassword) {
            if (newPassword !== confirmPassword) {
                throw new Error('New passwords do not match');
            }
            profileData.current_password = currentPassword;
            profileData.new_password = newPassword;
        }

        await updateUserProfile(profileData);
        alert('Profile updated successfully!');
    } catch (error) {
        alert('Failed to update profile: ' + error.message);
    }
});

// Course Form Submission
courseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const courseData = {
            title: document.getElementById('courseTitle').value,
            description: document.getElementById('courseDescription').value,
            skills: document.getElementById('courseSkills').value.split(',').map(skill => skill.trim())
        };

        await createCourse(courseData);
        alert('Course created successfully!');
        document.getElementById('createCourseForm').style.display = 'none';
        await loadCourses();
    } catch (error) {
        alert('Failed to create course: ' + error.message);
    }
});

// Conference Form Submission
conferenceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const conferenceData = {
            name: document.getElementById('confName').value,
            description: document.getElementById('confDescription').value,
            link: document.getElementById('confLink').value,
            type: document.getElementById('confType').value,
            departement: document.getElementById('confDepartment').value,
            date: document.getElementById('confDate').value,
            time: document.getElementById('confTime').value,
            image: document.getElementById('confImage').files[0]
        };

        await requestConference(conferenceData);
        alert('Conference request submitted successfully!');
        document.getElementById('conferenceRequestForm').style.display = 'none';
        await loadConferences();
    } catch (error) {
        alert('Failed to submit conference request: ' + error.message);
    }
});

// Message Form Submission
sendMessageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const receiverId = document.getElementById('receiverId').value;
        const content = document.getElementById('messageContent').value;
        const file = document.getElementById('messageFile').files[0];

        await sendMessage(receiverId, content, file);
        alert('Message sent successfully!');
        document.getElementById('messageContent').value = '';
        document.getElementById('messageFile').value = '';
        await loadMessages();
    } catch (error) {
        alert('Failed to send message: ' + error.message);
    }
});

// Helper Functions
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

async function loadDashboardData() {
    try {
        const courses = await getCourses();
        const conferences = await getCalendar();
        
        document.getElementById('totalCourses').textContent = courses.length;
        document.getElementById('upcomingConferences').textContent = conferences.length;
        
        // Calculate active students (this would need to be implemented in the backend)
        const activeStudents = courses.reduce((acc, course) => acc + course.enrolled_students, 0);
        document.getElementById('activeStudents').textContent = activeStudents;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadCourses() {
    try {
        const courses = await getCourses();
        const coursesList = document.getElementById('coursesList');
        coursesList.innerHTML = courses.map(course => `
            <div class="course-card">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p>Enrolled Students: ${course.enrolled_students || 0}</p>
                <p>Skills: ${course.skills.join(', ')}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadConferences() {
    try {
        const conferences = await getCalendar();
        const conferencesList = document.getElementById('conferencesList');
        conferencesList.innerHTML = conferences.map(conf => `
            <div class="conference-card">
                <h3>${conf.name}</h3>
                <p>${conf.description}</p>
                <p>Date: ${conf.date} ${conf.time}</p>
                <p>Type: ${conf.type}</p>
                <p>Department: ${conf.departement}</p>
                ${conf.link ? `<p>Link: <a href="${conf.link}" target="_blank">${conf.link}</a></p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading conferences:', error);
    }
}

async function loadMessages() {
    try {
        const messages = await getMessages();
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = messages.map(message => `
            <div class="message">
                <p>From: ${message.sender_name}</p>
                <p>${message.content}</p>
                <small>${new Date(message.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading messages:', error);
    }
} 