const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'SecretPassphrase';
const ivString = process.env.IV_STRING || 'InitializationVe'; // Ensure length is 16
const iterations = parseInt(process.env.PBKDF2_ITERATIONS) || 120; // Increased iterations

function encrypt(plainText) {
    const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16)); // Correctly sized IV
    const salt = CryptoJS.lib.WordArray.random(128/8);

    const key = CryptoJS.PBKDF2(secretKey, salt, {
        keySize: 256/32,
        iterations: iterations
    });

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return salt.toString() + encrypted.toString();
}

function decrypt(cipherText) {
    try {
        const salt = CryptoJS.enc.Hex.parse(cipherText.substring(0, 32));
        const encrypted = cipherText.substring(32);
        const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));

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

module.exports = {
    encrypt,
    decrypt
};