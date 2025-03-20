document.addEventListener('DOMContentLoaded', function() {
    const captchaTextElement = document.getElementById('captcha-text');
    const captchaInputElement = document.getElementById('captcha-input');
    const errorMessageElement = document.getElementById('error-message');
    let generatedCaptcha = '';
    let encryptionKey = '';
    let encryptionIV = '';

    function generateEncryptionKeys() {
        // Generate a random 16-byte key and IV (using typed arrays)
        const keyArray = new Uint8Array(16);
        const ivArray = new Uint8Array(16);
        window.crypto.getRandomValues(keyArray);
        window.crypto.getRandomValues(ivArray);

        encryptionKey = Array.from(keyArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
        encryptionIV = Array.from(ivArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
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
         const key = CryptoJS.enc.Hex.parse(encryptionKey);
         const iv = CryptoJS.enc.Hex.parse(encryptionIV);
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

        const key = CryptoJS.enc.Hex.parse(storedKey);
        const iv = CryptoJS.enc.Hex.parse(storedIV);

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