const passwordToggle = document.querySelector('.password-toggle');
const passwordInput = document.querySelector('#password');

if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('active');
    });
}

async function secureSubmit(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error('Form not found:', formId);
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Generate a new AES encryption key for each session
        const keyPair = await generateKeyPair();
        const encryptionKey = keyPair.privateKey;
        const publicKey = keyPair.publicKey;

        // Encrypt the data
        const encryptedData = await encryptData(JSON.stringify(data), encryptionKey);

        // Convert public key to a string
        const publicKeyString = await exportPublicKey(publicKey);

        // Prepare the encrypted payload, include the public key
        const payload = {
            encrypted: encryptedData,
            publicKey: publicKeyString
        };

        // Send the encrypted data and public key to the server
        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Submission successful');
                window.location.href = '/login.html';

            } else {
                console.error('Submission error:', response.status);
            }
        } catch (error) {
            console.error('Submission error:', error);
        }
    });
}

async function encryptData(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const algorithm = { name: "AES-GCM", iv: iv };
    const encodedData = new TextEncoder().encode(data);
    const cipherText = await window.crypto.subtle.encrypt(algorithm, key, encodedData);

    // Return IV + Ciphertext (IV is needed for decryption)
    return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(cipherText)));
}

async function generateKeyPair() {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function exportPublicKey(publicKey) {
    const exported = await window.crypto.subtle.exportKey(
        "jwk", // (private)
        publicKey // what key to export
    );
    return JSON.stringify(exported);
}

document.addEventListener('DOMContentLoaded', function () {
    secureSubmit('signupForm');
    secureSubmit('loginForm');
});