document.addEventListener('DOMContentLoaded', function() {
    const captchaTextElement = document.getElementById('captcha-text');
    const captchaInputElement = document.getElementById('captcha-input');
    const errorMessageElement = document.getElementById('error-message');
    let generatedCaptcha = '';

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
        // Use AES encryption
        const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16-byte key
        const iv = CryptoJS.enc.Utf8.parse('abcdefghijklmnop'); // 16-byte IV
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(captcha), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    function displayEncryptedCaptcha() {
        const captcha = generateCaptcha();
        const encryptedCaptcha = encryptCaptcha(captcha);
        captchaTextElement.textContent = encryptedCaptcha;
    }

    window.validateCaptcha = function() {
        const userInput = captchaInputElement.value;
        const key = CryptoJS.enc.Utf8.parse('1234567890123456');
        const iv = CryptoJS.enc.Utf8.parse('abcdefghijklmnop');
    
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