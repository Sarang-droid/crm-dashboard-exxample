document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const profileBtn = document.getElementById('profile-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const notificationBtn = document.getElementById('notification-btn');
    const floatingBtn = document.getElementById('floating-btn');
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-bar input');

    // Toggle sidebar on mobile
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });

    // Close sidebar when clicking the toggle button
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.remove('show');
    });

    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.setAttribute('data-theme', 
            document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        
        // Update icon
        const icon = darkModeToggle.querySelector('i');
        if (document.body.getAttribute('data-theme') === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // Toggle profile dropdown
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownMenu.classList.remove('show');
    });

    // Notification button click handler
    notificationBtn.addEventListener('click', function() {
        alert('You have 3 new notifications!');
        // In a real app, you would show a dropdown with notifications
    });

    // Floating action button click handler
    floatingBtn.addEventListener('click', function() {
        alert('Add New Property clicked!');
        // In a real app, this would open a form/modal to add a new property
    });

    // Search bar focus handler
    searchInput.addEventListener('focus', function() {
        searchBar.classList.add('show');
    });

    searchInput.addEventListener('blur', function() {
        // Only hide on mobile
        if (window.innerWidth <= 768) {
            searchBar.classList.remove('show');
        }
    });

    // Close sidebar when clicking on a link (for mobile)
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('show');
            }
        });
    });
});