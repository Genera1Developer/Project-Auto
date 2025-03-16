const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'Secret Passphrase'; // Use env var for security
const ivString = process.env.INITIALIZATION_VECTOR || 'InitializationVe'; // Use env var
const iterations = parseInt(process.env.PBKDF2_ITERATIONS || '1000'); // Use env var and parse to int

function encrypt(text) {
    const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16)); // Ensure IV is 16 bytes
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const key = CryptoJS.PBKDF2(secretKey, salt, {
        keySize: 256/32,
        iterations: iterations
    });
    const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return salt.toString()+encrypted.toString();
}

function decrypt(text) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));
        const salt = CryptoJS.enc.Hex.parse(text.substring(0, 32));
        const encrypted = text.substring(32);

        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: 256/32,
            iterations: iterations
        });

        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
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

module.exports = {
    encrypt,
    decrypt
};