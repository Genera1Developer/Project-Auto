document.addEventListener('DOMContentLoaded', function() {
    const captchaTextElement = document.getElementById('captcha-text');
    const captchaInputElement = document.getElementById('captcha-input');
    const errorMessageElement = document.getElementById('error-message');
    let generatedCaptcha = '';
    let encryptionKey = '';
    let encryptionIV = '';

    function generateEncryptionKeys() {
        // Generate a random 16-byte key and IV
        encryptionKey = CryptoJS.lib.WordArray.random(16).toString();
        encryptionIV = CryptoJS.lib.WordArray.random(16).toString();
    }

    function generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        generatedCaptcha = captcha;
        return captcha;
    }

    function encryptCaptcha(captcha) {
        const key = CryptoJS.enc.Utf8.parse(encryptionKey); // Use dynamically generated key
        const iv = CryptoJS.enc.Utf8.parse(encryptionIV); // Use dynamically generated IV
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(captcha), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    function displayEncryptedCaptcha() {
        generateEncryptionKeys(); // Generate new keys on each display
        const captcha = generateCaptcha();
        const encryptedCaptcha = encryptCaptcha(captcha);
        captchaTextElement.textContent = encryptedCaptcha;
        // Store keys in sessionStorage (more secure than global variable)
        sessionStorage.setItem('encryptionKey', encryptionKey);
        sessionStorage.setItem('encryptionIV', encryptionIV);
    }

    window.validateCaptcha = function() {
        const userInput = captchaInputElement.value;
        const storedKey = sessionStorage.getItem('encryptionKey');
        const storedIV = sessionStorage.getItem('encryptionIV');

        if (!storedKey || !storedIV) {
            errorMessageElement.textContent = 'Encryption keys missing. Please refresh.';
            errorMessageElement.style.color = 'red';
            displayEncryptedCaptcha();
            captchaInputElement.value = '';
            return;
        }

        const key = CryptoJS.enc.Utf8.parse(storedKey);
        const iv = CryptoJS.enc.Utf8.parse(storedIV);

        try {
            const decrypted = CryptoJS.AES.decrypt(userInput, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

             if (decryptedText.trim() === generatedCaptcha) {
                errorMessageElement.textContent = 'Captcha verified!';
                errorMessageElement.style.color = 'green';
                // Optionally, redirect or perform an action upon successful validation
                // window.location.href = '/success.html';
            } else {
                errorMessageElement.textContent = 'Incorrect captcha. Please try again.';
                errorMessageElement.style.color = 'red';
                displayEncryptedCaptcha(); // Refresh captcha on failure
                captchaInputElement.value = ''; // Clear input field
            }
        } catch (error) {
            errorMessageElement.textContent = 'Decryption error.  Are you sure you decrypted it?';
            errorMessageElement.style.color = 'red';
            displayEncryptedCaptcha(); // Refresh captcha on failure
            captchaInputElement.value = ''; // Clear input field
        }
    };

    displayEncryptedCaptcha(); // Initial captcha display
});