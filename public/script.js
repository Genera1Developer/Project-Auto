document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;

        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            contentDiv.classList.add('error');
            return;
        }

        contentDiv.classList.remove('error');
        contentDiv.textContent = 'Loading...';

        try {
            const response = await fetch('/api/proxy?url=' + encodeURIComponent(url));

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.text();
            contentDiv.textContent = data;
        } catch (error) {
            console.error('Error fetching content:', error);
            contentDiv.textContent = 'Failed to load content. Please check the URL and try again.';
            contentDiv.classList.add('error');
        }
    });
});