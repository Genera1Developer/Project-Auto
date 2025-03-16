const CryptoJS = require('crypto-js');

const secretPhrase = 'HighlySecurePassphrase';
const initializationVector = 'UniqueInitVector';

// Function to generate a secure key using PBKDF2
function generateKey(salt) {
    return CryptoJS.PBKDF2(secretPhrase, salt, {
        keySize: 256 / 32,
        iterations: 500 // Increased iterations for better security
    });
}

// Function to encrypt data using AES
function encrypt(data) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = generateKey(salt);
    const iv = CryptoJS.enc.Utf8.parse(initializationVector.substring(0, 16));

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Return salt + encrypted data
    return salt.toString() + encrypted.toString();
}

// Function to decrypt data using AES
function decrypt(encryptedData) {
    try {
        const salt = CryptoJS.enc.Hex.parse(encryptedData.substring(0, 32));
        const encrypted = encryptedData.substring(32);
        const key = generateKey(salt);
        const iv = CryptoJS.enc.Utf8.parse(initializationVector.substring(0, 16));

        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption Error:', error);
        return null;
    }
}

module.exports = {
    encrypt,
    decrypt
};