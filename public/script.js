document.addEventListener('DOMContentLoaded', function() {
    const proxyForm = document.getElementById('proxyForm');
    const urlInput = document.getElementById('url');
    const outputDiv = document.getElementById('output');
    const encryptionKeyInput = document.getElementById('encryptionKey'); // New key input
    const encryptCheckbox = document.getElementById('encrypt'); // New encrypt checkbox

    proxyForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const url = urlInput.value;
        const encryptionKey = encryptionKeyInput.value; // Get the encryption key
        const shouldEncrypt = encryptCheckbox.checked; // Check if encryption is enabled

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
                body: JSON.stringify({ url: url, encrypt: shouldEncrypt, encryptionKey: encryptionKey }) // Send encryption options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let sanitizedContent = data.content;

            if (data.encrypted) {
                 try {
                    const decryptedContent = CryptoJS.AES.decrypt(data.content, encryptionKey).toString(CryptoJS.enc.Utf8);
                    if (decryptedContent) {
                        sanitizedContent = decryptedContent;
                    } else {
                        sanitizedContent = "Decryption failed: Invalid key or corrupted data.";
                    }
                 } catch (decryptionError) {
                     console.error("Decryption error:", decryptionError);
                     sanitizedContent = "Decryption error occurred.";
                 }
            }
            // Sanitize the content before displaying it to prevent XSS attacks
            outputDiv.textContent = DOMPurify.sanitize(sanitizedContent);
        } catch (error) {
            console.error('Error fetching proxied content:', error);
            outputDiv.textContent = 'An error occurred while fetching the content.';
        }
    });
});