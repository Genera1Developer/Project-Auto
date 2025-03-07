document.addEventListener('DOMContentLoaded', function() {
    const proxyForm = document.getElementById('proxyForm');
    const urlInput = document.getElementById('url');
    const outputDiv = document.getElementById('output');

    proxyForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const url = urlInput.value;
        if (!url) {
            outputDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Sanitize the content before displaying it to prevent XSS attacks
            outputDiv.textContent = DOMPurify.sanitize(data.content);
        } catch (error) {
            console.error('Error fetching proxied content:', error);
            outputDiv.textContent = 'An error occurred while fetching the content.';
        }
    });
});