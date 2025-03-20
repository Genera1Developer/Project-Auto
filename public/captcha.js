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

    function displayEncryptedCaptcha() {
        const captcha = generateCaptcha();
        const encryptedCaptcha = CryptoJS.AES.encrypt(captcha, 'secret key 123').toString();
        captchaTextElement.textContent = encryptedCaptcha.substring(0, 12) + "...";
    }

    window.validateCaptcha = function() {
        const userInputValue = captchaInputElement.value;
        const decryptedCaptcha = CryptoJS.AES.decrypt(captchaTextElement.textContent.replace("...", ""), 'secret key 123').toString(CryptoJS.enc.Utf8);

        if (userInputValue === generatedCaptcha) {
            errorMessageElement.textContent = 'Captcha verified!';
            errorMessageElement.style.color = 'green';
            // Optionally, redirect or perform other actions upon successful validation
            // window.location.href = '/success.html';
        } else {
            errorMessageElement.textContent = 'Captcha verification failed. Please try again.';
            errorMessageElement.style.color = 'red';
            displayEncryptedCaptcha(); // Regenerate captcha on failure
            captchaInputElement.value = ''; // Clear input field
        }
    };

    displayEncryptedCaptcha();
});