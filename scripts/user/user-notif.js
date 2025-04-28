// Global variables
let notifications = [];
let currentNotification = null;

// Function to handle navigation bar display
function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Function to fetch notifications from the backend
async function fetchNotifications() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch('/notifications/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        notifications = await response.json();
        renderNotifications();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        showError('Failed to load notifications');
    }
}

// Function to render notifications in the list
function renderNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '';

    notifications.forEach(notification => {
        const li = document.createElement('li');
        li.className = `notification ${notification.is_read ? '' : 'unread'}`;
        li.dataset.id = notification.id;
        li.dataset.content = notification.content;
        li.dataset.type = notification.type;
        li.dataset.timestamp = new Date(notification.created_at).toLocaleTimeString();
        
        li.innerHTML = `
            ${notification.content}
            <span class="timestamp">${new Date(notification.created_at).toLocaleTimeString()}</span>
        `;
        
        li.onclick = () => showNotification(notification);
        notificationsList.appendChild(li);
    });
}

// Function to display a notification's content
function showNotification(notification) {
    const contentArea = document.getElementById('notificationContent');
    const backButton = document.getElementById('backButton');
    const sidebar = document.querySelector('.sidebar1');

    contentArea.innerHTML = `
        <div class="notification-details">
            <h3>${notification.title || 'Notification'}</h3>
            <p>${notification.content}</p>
            <p class="timestamp">${new Date(notification.created_at).toLocaleString()}</p>
        </div>
    `;

    backButton.style.display = 'block';
    sidebar.classList.add('hidden');
    contentArea.classList.add('visible');

    // Mark notification as read
    if (!notification.is_read) {
        markNotificationAsRead(notification.id);
    }

    currentNotification = notification;
}

// Function to mark a notification as read
async function markNotificationAsRead(notificationId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to mark notification as read');
        }

        // Update local state
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.is_read = true;
            renderNotifications();
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Function to hide notification details
function hideNotification() {
    const contentArea = document.getElementById('notificationContent');
    const backButton = document.getElementById('backButton');
    const sidebar = document.querySelector('.sidebar1');

    contentArea.innerHTML = '<p>Sélectionnez une notification pour afficher son contenu.</p>';
    backButton.style.display = 'none';
    sidebar.classList.remove('hidden');
    contentArea.classList.remove('visible');
    currentNotification = null;
}

// Filter functions
function filterMentions() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notif => {
        notif.style.display = notif.dataset.type === 'mention' ? 'block' : 'none';
    });
}

function filterUnread() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notif => {
        notif.style.display = notif.classList.contains('unread') ? 'block' : 'none';
    });
}

function showAllNotifications() {
    document.querySelectorAll('.notification').forEach(notif => {
        notif.style.display = 'block';
    });
}

// Error handling function
function showError(message) {
    const contentArea = document.getElementById('notificationContent');
    contentArea.innerHTML = `<div class="error">${message}</div>`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchNotifications();
    
    // Set up periodic refresh (every 30 seconds)
    setInterval(fetchNotifications, 30000);
});
