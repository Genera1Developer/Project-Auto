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

            const data = await response.text();
            contentDiv.textContent = data;
        } catch (error) {
            console.error('Error fetching data:', error);
            contentDiv.textContent = 'An error occurred while fetching the content. Check the console for details.';
            contentDiv.classList.add('error');
        }
    });
});