document.addEventListener('DOMContentLoaded', function() {
    const captchaTextElement = document.getElementById('captcha-text');
    const captchaInputElement = document.getElementById('captcha-input');
    const errorMessageElement = document.getElementById('error-message');

    let captchaText = generateCaptcha();
    captchaTextElement.textContent = captchaText;

    function generateCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    }

    window.validateCaptcha = function() {
        if (captchaInputElement.value === captchaText) {
            // Captcha is correct.  Replace this with proper success handling
            alert('Captcha correct! Redirecting...');
            //window.location.href = '/'; // Redirect to homepage or desired page
        } else {
            errorMessageElement.textContent = 'Incorrect captcha. Please try again.';
            captchaText = generateCaptcha();
            captchaTextElement.textContent = captchaText;
            captchaInputElement.value = '';
        }
    };

    // Optional: Add a refresh button for the captcha
    const captchaContainer = document.getElementById('captcha-container');
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Captcha';
    refreshButton.onclick = function() {
        captchaText = generateCaptcha();
        captchaTextElement.textContent = captchaText;
        captchaInputElement.value = '';
        errorMessageElement.textContent = '';
    };
    captchaContainer.appendChild(refreshButton);
});