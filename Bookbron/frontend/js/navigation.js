// Global variables
let hasUnsavedChanges = false;

// Navigation functions
function goBack() {
    const btn = event.currentTarget;
    animateButton(btn);
    setTimeout(() => {
        history.back();
    }, 300);
}

function goHome() {
    const btn = event.currentTarget;
    animateButton(btn);
    setTimeout(() => {
        window.location.href = '/dashboard';
    }, 300);
}

function refreshPage() {
    const btn = event.currentTarget;
    const icon = btn.querySelector('.refresh-icon');
    icon.classList.add('rotating');
    btn.classList.add('loading');
    
    setTimeout(() => {
        location.reload();
    }, 500);
}

// Button animation
function animateButton(btn) {
    btn.classList.add('loading');
    const icon = btn.querySelector('i');
    icon.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        btn.classList.remove('loading');
        icon.style.transform = '';
    }, 300);
}

// Page unload confirmation
window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const icon = btn.querySelector('i');
            icon.style.transform = 'scale(1.2)';
        });
        
        btn.addEventListener('mouseleave', () => {
            const icon = btn.querySelector('i');
            icon.style.transform = '';
        });
    });
});

// Set unsaved changes flag
function setUnsavedChanges(value) {
    hasUnsavedChanges = value;
}

// Export functions for use in other files
window.goBack = goBack;
window.goHome = goHome;
window.refreshPage = refreshPage;
window.setUnsavedChanges = setUnsavedChanges;
