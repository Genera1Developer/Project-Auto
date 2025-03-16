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
            // AES key exchange endpoint (simulated)
            const keyResponse = await fetch('/api/keyExchange');
            const keyData = await keyResponse.json();
            const aesKey = keyData.key;

            // Fetch proxied content
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.encryptedContent && aesKey) {
                // Decrypt content
                const decryptedContent = await decryptAES(data.encryptedContent, aesKey);
                contentDiv.innerHTML = decryptedContent;
            } else {
                contentDiv.textContent = data.message || 'Failed to fetch or decrypt content.';
            }

        } catch (error) {
            console.error('Error fetching content:', error);
            contentDiv.textContent = 'An error occurred while fetching the content.';
            contentDiv.classList.add('error');
        }
    });

    // AES decryption function (simulated)
    async function decryptAES(encryptedContent, key) {
        // This is a placeholder for actual AES decryption.
        // In a real application, use the Web Crypto API for secure decryption.
        // Example using CryptoJS (include CryptoJS library in your HTML):
        // const decrypted = CryptoJS.AES.decrypt(encryptedContent, key).toString(CryptoJS.enc.Utf8);
        // return decrypted;
        return `Decrypted: ${encryptedContent} (using key: ${key})`; // Placeholder
    }
});