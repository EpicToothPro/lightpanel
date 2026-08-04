// LightPanel custom JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize things on page load if needed
});

// Toggle PHP version field based on site type select
function togglePhpVersion() {
    const siteTypeSelect = document.getElementById('site_type');
    const phpVersionContainer = document.getElementById('php_version_container');
    
    if (siteTypeSelect && phpVersionContainer) {
        if (siteTypeSelect.value === 'php') {
            phpVersionContainer.classList.remove('hidden');
            // Small delay to allow display:block to apply before changing opacity for smooth transition
            setTimeout(() => {
                phpVersionContainer.classList.remove('opacity-0');
            }, 10);
        } else {
            phpVersionContainer.classList.add('opacity-0');
            setTimeout(() => {
                phpVersionContainer.classList.add('hidden');
            }, 300); // Wait for fade out transition
        }
    }
}

// HTMX events
document.body.addEventListener('htmx:afterSwap', function(event) {
    // Re-bind or re-initialize any JS components after HTMX swap if necessary
    
    // Auto-dismiss alerts - wait for CSS animation to finish then remove element
    const alerts = document.querySelectorAll('.alert-dismiss');
    alerts.forEach(alert => {
        // CSS animation takes 5s total (1s delay + 4s fade)
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 6000);
    });
});

// Listen for HTMX errors
document.body.addEventListener('htmx:responseError', function(event) {
    console.error('HTMX Error:', event.detail.xhr.status, event.detail.xhr.statusText);
});
