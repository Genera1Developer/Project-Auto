// Function to generate a random encryption key (AES)
function generateEncryptionKey() {
    return CryptoJS.lib.WordArray.random(16).toString(); // 128-bit key
}

// Function to encrypt the captcha text using AES
function encryptCaptcha(plainText, key) {
    const iv = CryptoJS.lib.WordArray.random(16); // Initialization Vector
    const encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return {
        cipherText: encrypted.toString(),
        iv: iv.toString()
    };
}

// Function to decrypt the captcha text using AES
function decryptCaptcha(cipherText, key, iv) {
    const decrypted = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// Function to generate the captcha
function generateCaptcha() {
    const captchaText = Math.random().toString(36).substring(2, 7).toUpperCase(); // Generate a random alphanumeric string
    const encryptionKey = generateEncryptionKey();
    const encryptedData = encryptCaptcha(captchaText, encryptionKey);

    // Store encryption key and IV in session storage (INSECURE FOR PRODUCTION - ONLY FOR DEMO)
    sessionStorage.setItem('captchaKey', encryptionKey);
    sessionStorage.setItem('captchaIV', encryptedData.iv);

    document.getElementById('captcha-text').innerText = encryptedData.cipherText;
    return captchaText; // Return the original captcha for validation (DEMO PURPOSES ONLY)
}

// Function to validate the captcha
function validateCaptcha() {
    const userInput = document.getElementById('captcha-input').value;
    const storedKey = sessionStorage.getItem('captchaKey');
    const storedIV = sessionStorage.getItem('captchaIV');
    const encryptedText = document.getElementById('captcha-text').innerText;

    if (!storedKey || !storedIV) {
        document.getElementById('error-message').innerText = 'Error: Encryption key or IV missing.';
        return;
    }

    const decryptedText = decryptCaptcha(encryptedText, storedKey, storedIV);

    if (userInput === decryptedText) {
        alert('Captcha Matched!'); // Replace with appropriate action
        document.getElementById('error-message').innerText = '';
    } else {
        document.getElementById('error-message').innerText = 'Captcha does not match. Please try again.';
        generateCaptcha(); // Regenerate captcha on incorrect input
    }
}

// Generate captcha on page load
generateCaptcha();