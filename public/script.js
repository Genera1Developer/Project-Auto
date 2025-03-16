document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;
        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            const response = await fetch('/api/proxy?url=' + encodeURIComponent(url));

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                contentDiv.textContent = JSON.stringify(data, null, 2);
            } else {
                const text = await response.text();
                contentDiv.textContent = text;
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            contentDiv.textContent = 'Error fetching content. Please check the URL and try again.';
            contentDiv.classList.add('error');
        }
    });
});