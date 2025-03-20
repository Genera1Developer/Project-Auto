const passwordToggle = document.querySelector('.password-toggle');
const passwordInput = document.querySelector('#password');

if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('active'); // Change the class for a different icon, if needed
    });
}

function secureSubmit(formId) {
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

        // AES encryption key (replace with a securely generated key and proper key exchange)
        const encryptionKey = "YOUR_SECURE_KEY"; // INSECURE: Replace with a secure key!

        // Encrypt the data
        const encryptedData = await encryptData(JSON.stringify(data), encryptionKey);

        // Prepare the encrypted payload
        const payload = {
            encrypted: encryptedData
        };

        // Send the encrypted data to the server
        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Handle successful submission
                console.log('Submission successful');
                window.location.href = '/login.html';
                // Optionally, redirect or display a success message
            } else {
                // Handle errors
                console.error('Submission error:', response.status);
            }
        } catch (error) {
            console.error('Submission error:', error);
        }
    });
}

async function encryptData(data, key) {
    const keyBytes = new TextEncoder().encode(key);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const algorithm = { name: "AES-GCM", iv: iv };
    const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        algorithm,
        false,
        ["encrypt", "decrypt"]
    );

    const encodedData = new TextEncoder().encode(data);
    const cipherText = await window.crypto.subtle.encrypt(algorithm, cryptoKey, encodedData);

    // Return IV + Ciphertext
    return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(cipherText)));
}

// Initialize secure submission for signup and login forms
document.addEventListener('DOMContentLoaded', function () {
    secureSubmit('signupForm'); // Assuming you have a signup form with id="signupForm"
    secureSubmit('loginForm'); // Assuming you have a login form with id="loginForm"
});