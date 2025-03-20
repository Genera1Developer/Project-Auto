document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async () => {
        const url = urlInput.value;
        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            const response = await fetch('/api/proxy?url=' + encodeURIComponent(url)); // Assuming proxy endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            contentDiv.textContent = data;
        } catch (error) {
            console.error('Error fetching data:', error);
            contentDiv.textContent = 'Failed to load content. Please check the URL and try again.';
        }
    });
});