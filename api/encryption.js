const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'DefaultSecretKey'; // Use environment variable for security
const ivString = process.env.INITIALIZATION_VECTOR || 'DefaultInitVector'; // Use environment variable
const iterations = 128; // Increased iterations for stronger key derivation

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

    return salt.toString() + encrypted.toString();
}

function decrypt(text) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16)); // Ensure IV is 16 bytes
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
    } catch (error) {
        console.error("Decryption Error:", error);
        return null;
    }
}

module.exports = { encrypt, decrypt };