document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uv-form');
    const address = document.getElementById('uv-address');
    const go = document.getElementById('uv-go');
    const error = document.getElementById('uv-error');
    const encodedPrefix = btoa('Ultraviolet');
    const encryptionKey = 'YOUR_SECURE_KEY'; // Replace with a strong, randomly generated key
    const iv = 'YOUR_SECURE_IV'; // Replace with a strong, randomly generated IV

    async function encrypt(text) {
        const key = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(encryptionKey),
            "AES-CBC",
            false,
            ["encrypt"]
        );

        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv: new TextEncoder().encode(iv)
            },
            key,
            new TextEncoder().encode(text)
        );

        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        try {
            let url = address.value.trim();
            if (!url) {
                throw new Error('Please enter a URL.');
            }

            if (!url.startsWith('https://') && !url.startsWith('http://')) {
                url = 'https://' + url;
            }

            const encryptedURL = await encrypt(url);
            const encodedURL = btoa(encryptedURL);
            const proxyURL = '/uv/service/' + encodedPrefix + '/' + encodedURL;

            window.location.href = proxyURL;
        } catch (e) {
            error.textContent = e.message;
            error.classList.remove('d-none');
        }
    });
});

edit filepath: encryption/aes_config.js
content: export const encryptionConfig = {
    key: 'YOUR_SECURE_KEY', // Replace with a strong, randomly generated key
    iv: 'YOUR_SECURE_IV' // Replace with a strong, randomly generated IV
};