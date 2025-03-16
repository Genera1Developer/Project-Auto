const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'DefaultSecretKey';
const ivString = process.env.INITIALIZATION_VECTOR || 'DefaultInitVector';
const iterations = 256; // Further increased iterations

function encrypt(text) {
    const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));
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

    const ciphertext = salt.toString() + encrypted.toString();
    return ciphertext;
}

function decrypt(ciphertext) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));
        const salt = CryptoJS.enc.Hex.parse(ciphertext.substring(0, 32));
        const encrypted = ciphertext.substring(32);

        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: 256/32,
            iterations: iterations
        });

        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        return plaintext;
    } catch (error) {
        console.error("Decryption Error:", error);
        return null;
    }
}

function generateSecureKey() {
    return CryptoJS.lib.WordArray.random(256/8).toString();
}

function generateSecureIV() {
    return CryptoJS.lib.WordArray.random(128/8).toString();
}

module.exports = { encrypt, decrypt, generateSecureKey, generateSecureIV };