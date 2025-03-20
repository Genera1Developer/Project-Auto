document.addEventListener('DOMContentLoaded', function() {
    const captchaTextElement = document.getElementById('captcha-text');
    const captchaInputElement = document.getElementById('captcha-input');
    const errorMessageElement = document.getElementById('error-message');
    let generatedCaptcha = '';
    let encryptionKey = '';
    let encryptionIV = '';

    function generateEncryptionKeys() {
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
        generateEncryptionKeys();
        const captcha = generateCaptcha();
        const encryptedCaptcha = encryptCaptcha(captcha);
        captchaTextElement.textContent = encryptedCaptcha;
        sessionStorage.setItem('encryptionKey', encryptionKey);
        sessionStorage.setItem('encryptionIV', encryptionIV);
        sessionStorage.setItem('generatedCaptcha', captcha); // Store original
    }

    window.validateCaptcha = function() {
        const userInput = captchaInputElement.value;
        const storedKey = sessionStorage.getItem('encryptionKey');
        const storedIV = sessionStorage.getItem('encryptionIV');
        const originalCaptcha = sessionStorage.getItem('generatedCaptcha'); // Retrieve

        if (!storedKey || !storedIV || !originalCaptcha) {
            errorMessageElement.textContent = 'Encryption keys missing. Refresh.';
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

             if (decryptedText.trim() === originalCaptcha) {
                errorMessageElement.textContent = 'Captcha verified!';
                errorMessageElement.style.color = 'green';
            } else {
                errorMessageElement.textContent = 'Incorrect captcha. Please try again.';
                errorMessageElement.style.color = 'red';
                displayEncryptedCaptcha();
                captchaInputElement.value = '';
            }
        } catch (error) {
            errorMessageElement.textContent = 'Decryption error.  Double check.';
            errorMessageElement.style.color = 'red';
            displayEncryptedCaptcha();
            captchaInputElement.value = '';
        }
    };

    displayEncryptedCaptcha();
});