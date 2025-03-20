let captchaText = null;

function generateCaptcha() {
    const captchaLength = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < captchaLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    captchaText = CryptoJS.AES.encrypt(result, 'secret passphrase'); // Encrypt the captcha
    document.getElementById('captcha-text').innerText = 'Encrypted';
}

function validateCaptcha() {
    const userInput = document.getElementById('captcha-input').value;
    try {
        const decryptedText = CryptoJS.AES.decrypt(captchaText, 'secret passphrase').toString(CryptoJS.enc.Utf8);

        if (decryptedText === userInput) {
            alert('Captcha verified!');
            // Optionally, redirect the user or perform an action
        } else {
            document.getElementById('error-message').innerText = 'Incorrect captcha. Please try again.';
            generateCaptcha(); // Regenerate captcha on incorrect input
        }
    } catch (e) {
        document.getElementById('error-message').innerText = 'Decryption error. Please try again.';
        generateCaptcha();
    }
}

// Generate a new captcha when the page loads
generateCaptcha();