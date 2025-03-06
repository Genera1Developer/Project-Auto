document.addEventListener('DOMContentLoaded', function() {
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.getElementById('urlInput');
    const contentArea = document.getElementById('contentArea');
    const themeSelector = document.getElementById('themeSelector');
    const themeDropdown = document.querySelector('.theme-dropdown');
    const themeItems = document.querySelectorAll('.theme-item');

    urlForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const url = urlInput.value;
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;

        // Clear previous iframe content
        contentArea.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.src = proxyUrl;
        iframe.sandbox = 'allow-forms allow-scripts allow-same-origin allow-top-navigation'; // Added sandbox attribute

        contentArea.appendChild(iframe);
    });

    themeSelector.addEventListener('click', function() {
        themeDropdown.classList.toggle('active');
    });

    themeItems.forEach(item => {
        item.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            const themeLink = document.getElementById('theme-link');

            if (theme === 'default') {
                themeLink.href = ''; // Reset to default
            } else {
                themeLink.href = `themes/${theme}.css`;
            }

            themeDropdown.classList.remove('active');
        });
    });

    // Close the dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!themeSelector.contains(event.target) && !themeDropdown.contains(event.target)) {
            themeDropdown.classList.remove('active');
        }
    });
});