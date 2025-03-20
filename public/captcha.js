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

    function encryptCaptcha(captcha, key, iv) {
         const parsedKey = CryptoJS.enc.Hex.parse(key);
         const parsedIv = CryptoJS.enc.Hex.parse(iv);
         const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(captcha), parsedKey, {
            iv: parsedIv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    function decryptCaptcha(encryptedCaptcha, key, iv) {
        const parsedKey = CryptoJS.enc.Hex.parse(key);
        const parsedIv = CryptoJS.enc.Hex.parse(iv);

        const decrypted = CryptoJS.AES.decrypt(encryptedCaptcha, parsedKey, {
            iv: parsedIv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    function displayEncryptedCaptcha() {
        generateEncryptionKeys();
        const captcha = generateCaptcha();
        const encryptedCaptcha = encryptCaptcha(captcha, encryptionKey, encryptionIV);
        captchaTextElement.textContent = encryptedCaptcha;
        sessionStorage.setItem('encryptionKey', encryptionKey);
        sessionStorage.setItem('encryptionIV', encryptionIV);
        const hash = CryptoJS.SHA256(encryptedCaptcha).toString();
        sessionStorage.setItem('encryptedCaptchaHash', hash);
        sessionStorage.setItem('encryptedCaptchaSalt', CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex));
        sessionStorage.removeItem('encryptedCaptcha');
    }

    window.validateCaptcha = function() {
        const userInput = captchaInputElement.value;
        const storedKey = sessionStorage.getItem('encryptionKey');
        const storedIV = sessionStorage.getItem('encryptionIV');
        const encryptedCaptchaHash = sessionStorage.getItem('encryptedCaptchaHash');
        const salt = sessionStorage.getItem('encryptedCaptchaSalt');

        if (!storedKey || !storedIV || !encryptedCaptchaHash || !salt) {
            errorMessageElement.textContent = 'Encryption keys missing. Refresh.';
            errorMessageElement.style.color = 'red';
            displayEncryptedCaptcha();
            captchaInputElement.value = '';
            return;
        }

        try {
            const saltedInput = userInput + salt;
            const encryptedUserInput = encryptCaptcha(saltedInput, storedKey, storedIV);
            const userInputHash = CryptoJS.SHA256(encryptedUserInput).toString();
            if (userInputHash === encryptedCaptchaHash) {
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