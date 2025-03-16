document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.getElementById('url');
    const resultDiv = document.getElementById('result');

    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value;

        if (!url) {
            resultDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const encryptedData = await response.text();

            // Decrypt the data (simulated client-side decryption)
            const decryptedData = await decryptData(encryptedData);

            resultDiv.innerHTML = `<iframe srcdoc="${decryptedData}" width="100%" height="500px"></iframe>`;


        } catch (error) {
            console.error('Fetch error:', error);
            resultDiv.textContent = `Error: ${error.message}`;
        }
    });

    // Simulated decryption function (replace with actual client-side decryption)
    async function decryptData(encryptedData) {
        try {
            const response = await fetch('/api/encryption?data=' + encodeURIComponent(encryptedData));
            if (!response.ok) {
                throw new Error(`HTTP decryption error! Status: ${response.status}`);
            }
            const decryptedText = await response.text();
            return decryptedText;

        } catch (error) {
            console.error('Decryption error:', error);
            return `Decryption Error: ${error.message}`;
        }
    }
});