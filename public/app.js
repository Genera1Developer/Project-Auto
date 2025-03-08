document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const outputDiv = document.getElementById('output');

    proxyButton.addEventListener('click', async () => {
        const url = urlInput.value;
        if (!url) {
            outputDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            // Simulate encryption before sending to proxy
            const encryptedUrl = await encryptURL(url);

            // Call the proxy endpoint (replace with your actual proxy endpoint)
            const response = await fetch(`/api/proxy?url=${encryptedUrl}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Assuming the proxy returns decrypted content
            const data = await response.text();
            outputDiv.textContent = data; // Display the response in a basic way
        } catch (error) {
            console.error('Error fetching from proxy:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }
    });

    // Simple encryption function (replace with a real encryption method)
    async function encryptURL(url) {
        // This is a placeholder. In a real application, use a proper encryption library (e.g., AES)
        // and ensure the encryption key is securely managed.
        const encodedURL = btoa(url);
        console.log('Encrypted URL:', encodedURL);
        return encodedURL;
    }

    particlesJS.load('particles-js', 'particlesjs-config.json', function() {
        console.log('particles.js loaded - encryption theme');
    });
});