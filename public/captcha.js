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
    sessionStorage.setItem('encryptedCaptcha', encryptedText); // Store the encrypted captcha
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
        document.getElementById('error-message').innerText = 'Captcha Verified!';
        document.getElementById('error-message').style.color = 'green'; // Style the success message
        // Optionally, regenerate the captcha after successful validation
        generateCaptcha();
        // Clear input field after success
        document.getElementById('captcha-input').value = '';
    } else {
        // Captcha is invalid
        document.getElementById('error-message').innerText = 'Incorrect captcha. Please try again.';
        document.getElementById('error-message').style.color = 'red'; // Style the error message
        // Regenerate the captcha on incorrect input
        generateCaptcha();
        // Clear input field after failure
        document.getElementById('captcha-input').value = '';
    }
}

function togglePasswordVisibility() {
    const captchaInput = document.getElementById("captcha-input");
    const toggleButton = document.getElementById("toggle-captcha");

    if (captchaInput.type === "password") {
        captchaInput.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        captchaInput.type = "password";
        toggleButton.textContent = "Show";
    }
}

// Generate the captcha when the page loads
window.onload = generateCaptcha;
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-captcha';
    toggleButton.textContent = 'Show';
    toggleButton.addEventListener('click', togglePasswordVisibility);

    const captchaInput = document.getElementById('captcha-input');
    captchaInput.type = "password";
    captchaInput.parentNode.insertBefore(toggleButton, captchaInput.nextSibling);

    // Add event listener for Enter key press
    captchaInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            validateCaptcha();
        }
    });
});