// API Configuration
const API_BASE_URL = 'http://localhost:8000'; // Update this with your actual backend URL

// Auth Functions
async function login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
}

async function register(userData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    return await response.json();
}

// Course Functions
async function getCourses() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/courses/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch courses');
    }

    return await response.json();
}

async function getCourseById(courseId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch course');
    }

    return await response.json();
}

async function enrollInCourse(courseId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to enroll in course');
    }

    return await response.json();
}

// User Functions
async function getUserProfile() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    return await response.json();
}

async function updateUserProfile(profileData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/personal-info`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return await response.json();
}

// Conference Functions
async function requestConference(conferenceData) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Add all fields to formData
    Object.keys(conferenceData).forEach(key => {
        if (key !== 'image') {
            formData.append(key, conferenceData[key]);
        }
    });

    if (conferenceData.image) {
        formData.append('image', conferenceData.image);
    }

    const response = await fetch(`${API_BASE_URL}/request`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to request conference');
    }

    return await response.json();
}

async function getCalendar() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/calendar`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch calendar');
    }

    return await response.json();
}

// Message Functions
async function sendMessage(receiverId, content, file = null) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('receiver_id', receiverId);
    formData.append('content', content);
    if (file) {
        formData.append('file', file);
    }

    const response = await fetch(`${API_BASE_URL}/messages/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return await response.json();
}

async function getMessages(messageType = 'received') {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages/?message_type=${messageType}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }

    return await response.json();
}

// Utility Functions
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

function logout() {
    localStorage.removeItem('token');
}

// Export all functions
export {
    login,
    register,
    getCourses,
    getCourseById,
    enrollInCourse,
    getUserProfile,
    updateUserProfile,
    requestConference,
    getCalendar,
    sendMessage,
    getMessages,
    isAuthenticated,
    logout
}; 