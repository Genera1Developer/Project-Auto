const form = document.querySelector('form');
const input = document.querySelector('input');
const proxyUrl = '/'; // Proxied through server

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = input.value;

    if (!url) {
        alert('Please enter a URL.');
        return;
    }

    try {
        const response = await fetch(proxyUrl + url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();

        // Encrypt the data before displaying
        const encryptedData = await encryptData(data);

        displayContent(encryptedData);
    } catch (error) {
        console.error('Proxy error:', error);
        displayError('Failed to load content. Check console for details.');
    }
});

async function encryptData(data) {
    const key = await generateKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const cipher = await window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: iv
    }, key, encodedData);

    const encryptedData = new Uint8Array(cipher);
    const combinedData = new Uint8Array(iv.length + encryptedData.length);
    combinedData.set(iv, 0);
    combinedData.set(encryptedData, iv.length);

    // Return the combined IV and encrypted data as a Base64 string
    return btoa(String.fromCharCode(...combinedData));
}

async function generateKey() {
    return await window.crypto.subtle.generateKey({
        name: 'AES-GCM',
        length: 256
    }, true, ['encrypt', 'decrypt']);
}

function displayContent(content) {
    const contentDiv = document.getElementById('content');
    contentDiv.textContent = 'Encrypted Data: ' + content;
}

function displayError(message) {
    const contentDiv = document.getElementById('content');
    contentDiv.textContent = 'Error: ' + message;
}