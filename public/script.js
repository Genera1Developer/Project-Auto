document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;
        if (url) {
            try {
                const response = await fetch('/api/proxy?url=' + encodeURIComponent(url));
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.text();
                contentDiv.innerHTML = data;
            } catch (error) {
                console.error('Error fetching content:', error);
                contentDiv.innerHTML = '<p class="error">Failed to load content. Please check the URL and your connection.</p>';
            }
        } else {
            contentDiv.innerHTML = '<p class="error">Please enter a URL.</p>';
        }
    });
});