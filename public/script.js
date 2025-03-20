function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
}

function encryptCaptcha(captcha) {
    const key = 'YOUR_SECRET_KEY';
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const saltedCaptcha = salt + captcha;
    const encrypted = CryptoJS.AES.encrypt(saltedCaptcha, CryptoJS.PBKDF2(key, CryptoJS.enc.Hex.parse(salt), {
        keySize: 256/32,
        iterations: 100
    }), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return iv + salt + encrypted.toString();
}

let captchaText = generateCaptcha();
let encryptedText = encryptCaptcha(captchaText);

function decryptCaptcha(encryptedCaptcha) {
    const key = 'YOUR_SECRET_KEY';
    const iv = encryptedCaptcha.substring(0, 32);
    const salt = encryptedCaptcha.substring(32, 64);
    const encrypted = encryptedCaptcha.substring(64);

    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.PBKDF2(key, CryptoJS.enc.Hex.parse(salt), {
            keySize: 256/32,
            iterations: 100
        }), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const saltedCaptcha = decrypted.toString(CryptoJS.enc.Utf8);
        if (saltedCaptcha) {
            return saltedCaptcha.substring(32);
        } else {
            return '';
        }
    } catch (e) {
        console.error("Decryption Error:", e);
        return '';
    }
}

function displayCaptcha() {
    captchaText = generateCaptcha();
    encryptedText = encryptCaptcha(captchaText);
    document.getElementById('captcha-text').innerText = encryptedText;
}

function validateCaptcha() {
    const userInput = document.getElementById('captcha-input').value;
    const decryptedText = decryptCaptcha(encryptedText);

    if (decryptedText === userInput) {
        alert('Captcha validation successful!');
        window.location.href = '/';
    } else {
        document.getElementById('error-message').innerText = 'Incorrect captcha. Please try again.';
        displayCaptcha();
        document.getElementById('captcha-input').value = '';
    }
}

displayCaptcha();