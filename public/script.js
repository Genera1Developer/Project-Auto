document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const iframe = document.getElementById('proxyFrame');
    const themeSelector = document.getElementById('themeSelector');
    const themeDropdown = document.querySelector('.theme-dropdown');
    const themeItems = document.querySelectorAll('.theme-item');

    proxyButton.addEventListener('click', () => {
        const url = urlInput.value;
        if (url) {
            iframe.src = `/api/proxy?url=${encodeURIComponent(url)}`;
        } else {
            alert('Please enter a URL.');
        }
    });

    themeSelector.addEventListener('click', () => {
        themeDropdown.classList.toggle('active');
    });

    themeItems.forEach(item => {
        item.addEventListener('click', () => {
            const theme = item.dataset.theme;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = `/themes/${theme}.css`;
            link.id = 'theme-stylesheet';

            const existingTheme = document.getElementById('theme-stylesheet');
            if (existingTheme) {
                existingTheme.parentNode.removeChild(existingTheme);
            }

            document.head.appendChild(link);
            themeDropdown.classList.remove('active');
        });
    });
});