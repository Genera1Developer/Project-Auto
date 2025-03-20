document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = document.getElementById('darkModeIcon');

    // Check for saved preference
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // Function to enable dark mode
    function enableDarkMode() {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    }

    // Function to disable dark mode
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('darkMode', null);
    }

    // Set initial dark mode state
    if (isDarkMode) {
        enableDarkMode();
    }

    // Toggle dark mode on click
    darkModeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
});


    <script src="script.js"></script>
</body>
</html>
