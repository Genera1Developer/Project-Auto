function generateCaptchaText(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function encryptCaptcha(text) {
    const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16-byte key for AES-128
    const iv = CryptoJS.enc.Utf8.parse('abcdefghijklmnop'); // 16-byte IV
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encrypted.toString();
}

function displayEncryptedCaptcha() {
    const captchaText = generateCaptchaText(6); // Generate a 6-character CAPTCHA
    const encryptedCaptcha = encryptCaptcha(captchaText);
    document.getElementById('captcha-text').innerText = encryptedCaptcha;
    // Store the original captcha text for validation
    sessionStorage.setItem('captcha', captchaText);
}

function decryptCaptcha(encryptedText) {
    const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // Same key as encryption
    const iv = CryptoJS.enc.Utf8.parse('abcdefghijklmnop'); // Same IV as encryption

    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error("Decryption error:", e);
        return null;
    }
}

function validateCaptcha() {
    const userInput = document.getElementById('captcha-input').value;
    const encryptedCaptchaText = document.getElementById('captcha-text').innerText; // Get the encrypted text from display
    const originalCaptcha = sessionStorage.getItem('captcha'); // Get the original CAPTCHA from sessionStorage
    const decryptedUserInput = decryptCaptcha(encryptedCaptchaText);
    if (decryptedUserInput && userInput === originalCaptcha) {
        alert('Captcha Matched!');
        // You can redirect the user or perform other actions here
    } else {
        document.getElementById('error-message').innerText = 'Captcha does not match. Please try again.';
        displayEncryptedCaptcha(); // Regenerate CAPTCHA on failure
    }
}

// Call this function when the page loads
window.onload = function() {
    displayEncryptedCaptcha();
};