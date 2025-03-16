document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.getElementById('url');
    const resultDiv = document.getElementById('result');
    const proxyUrl = '/api/proxy';

    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const targetUrl = urlInput.value;

        if (!targetUrl) {
            resultDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(targetUrl)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const encryptedData = await response.text();

            // Decrypt the data (assuming decryption function is available)
            const decryptedData = decryptData(encryptedData);

            // Display the decrypted data
            resultDiv.textContent = `Decrypted Content: ${decryptedData}`;

        } catch (error) {
            console.error('Error fetching data:', error);
            resultDiv.textContent = `Error: ${error.message}`;
        }
    });

    // Placeholder for decryption function (implement in encryption.js)
    function decryptData(encryptedData) {
        //  Call a function from encryption.js to decrypt
        return "PLACEHOLDER - Implement decryption";
    }
});