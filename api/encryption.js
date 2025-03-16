const CryptoJS = require('crypto-js');

const secretPhrase = 'SuperSecretPassphrase';
const initializationVector = 'MySecureIVector';

function encryptData(data) {
    const iv = CryptoJS.enc.Utf8.parse(initializationVector.substring(0, 16));
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const key = CryptoJS.PBKDF2(secretPhrase, salt, {
        keySize: 256/32,
        iterations: 150 // Increased iterations for better security
    });

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, { // Stringify data before encryption
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return salt.toString() + encrypted.toString();
}

function decryptData(encryptedData) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(initializationVector.substring(0, 16));
        const salt = CryptoJS.enc.Hex.parse(encryptedData.substring(0, 32));
        const encrypted = encryptedData.substring(32);

        const key = CryptoJS.PBKDF2(secretPhrase, salt, {
            keySize: 256/32,
            iterations: 150 // Increased iterations to match encryption
        });

        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData); // Parse JSON after decryption
    } catch (error) {
        console.error('Decryption Error:', error);
        return null;
    }
}

module.exports = {
    encrypt: encryptData,
    decrypt: decryptData
};