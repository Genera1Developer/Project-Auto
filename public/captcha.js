// Function to generate a random encryption key (AES)
function generateEncryptionKey() {
    const key = CryptoJS.lib.WordArray.random(16); // 128-bit key
    return key.toString(CryptoJS.enc.Hex);
}

// Function to encrypt the captcha text using AES
function encryptCaptcha(text, key) {
    const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), CryptoJS.enc.Hex.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // Return both the encrypted text and the IV (in hex format)
    return {
        ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
        iv: iv.toString(CryptoJS.enc.Hex)
    };
}

// Function to decrypt the captcha text using AES
function decryptCaptcha(ciphertext, key, iv) {
    try {
        const decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(ciphertext) }, CryptoJS.enc.Hex.parse(key), {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error("Decryption error:", e);
        return null;
    }
}

// Function to generate the captcha
function generateCaptcha() {
    const captchaText = Math.random().toString(36).substring(2, 7).toUpperCase();
    const encryptionKey = generateEncryptionKey(); // Generate a new encryption key

    // Encrypt the captcha text
    const encryptedData = encryptCaptcha(captchaText, encryptionKey);
    const encryptedText = encryptedData.ciphertext;
    const iv = encryptedData.iv;

    // Store the encryption key and IV in sessionStorage (in real application, use secure server-side storage)
    sessionStorage.setItem('captchaKey', encryptionKey);
    sessionStorage.setItem('captchaIV', iv);
    sessionStorage.setItem('originalCaptcha', captchaText);

    document.getElementById('captcha-text').innerText = encryptedText;
}

// Function to validate the captcha
function validateCaptcha() {
    const encryptedCaptchaText = document.getElementById('captcha-text').innerText;
    const userInput = document.getElementById('captcha-input').value.toUpperCase();
    const encryptionKey = sessionStorage.getItem('captchaKey');
    const iv = sessionStorage.getItem('captchaIV');
    const originalCaptcha = sessionStorage.getItem('originalCaptcha');


    if (!encryptionKey || !iv) {
        document.getElementById('error-message').innerText = 'Encryption key or IV missing. Please refresh the page.';
        return;
    }

    const decryptedText = decryptCaptcha(encryptedCaptchaText, encryptionKey, iv);

    if (decryptedText === originalCaptcha && userInput === originalCaptcha) {
        // Captcha is valid
        alert('Captcha Verified!'); // Replace with appropriate action
        document.getElementById('error-message').innerText = '';
        // Optionally, regenerate the captcha after successful validation
        generateCaptcha();
    } else {
        // Captcha is invalid
        document.getElementById('error-message').innerText = 'Incorrect captcha. Please try again.';
        // Regenerate the captcha on incorrect input
        generateCaptcha();
    }
}

// Generate the captcha when the page loads
window.onload = generateCaptcha;