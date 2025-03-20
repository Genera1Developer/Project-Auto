document.addEventListener('DOMContentLoaded', function() {
    const captchaTextElement = document.getElementById('captcha-text');
    const captchaInputElement = document.getElementById('captcha-input');
    const errorMessageElement = document.getElementById('error-message');

    let encryptedCaptcha = '';
    let decryptedCaptcha = '';

    function generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function encrypt(text, key) {
        return CryptoJS.AES.encrypt(text, key).toString();
    }

    function decrypt(ciphertext, key) {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            return ''; // Decryption failed
        }
    }

    function initializeCaptcha() {
        decryptedCaptcha = generateRandomString(6);
        const encryptionKey = generateRandomString(16); // AES key size
        encryptedCaptcha = encrypt(decryptedCaptcha, encryptionKey);
        captchaTextElement.textContent = encryptedCaptcha;
        captchaTextElement.dataset.key = encryptionKey; // Store key in data attribute
    }

    window.validateCaptcha = function() {
        const userInput = captchaInputElement.value.trim();
        const storedKey = captchaTextElement.dataset.key;
        const decryptedInput = decrypt(encryptedCaptcha, storedKey);

        if (decryptedInput === userInput) {
            errorMessageElement.textContent = 'Captcha Matched!';
            errorMessageElement.style.color = 'green';
            // You can add a redirect or other actions here upon successful validation
             window.location.href = "/public/index.html"; // Redirect to index.html
        } else {
            errorMessageElement.textContent = 'Captcha Failed. Please try again.';
            errorMessageElement.style.color = 'red';
            initializeCaptcha(); // Regenerate captcha on failure
            captchaInputElement.value = ''; // Clear input field
        }
    };

    initializeCaptcha();
});