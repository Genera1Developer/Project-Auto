const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'Secret Passphrase';
const initializationVector = process.env.INITIALIZATION_VECTOR || 'Initialization Vector';
const iterations = 1000; // Increased iterations for stronger key derivation

function encrypt(data) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(initializationVector.substring(0, 16));
        const salt = CryptoJS.lib.WordArray.random(128 / 8); // 16 bytes = 128 bits
        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: 256 / 32, // 256 bits
            iterations: iterations,
            hasher: CryptoJS.algo.SHA256 // Use SHA256 for stronger hashing
        });

        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, { // Stringify data before encryption
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return {
            ciphertext: encrypted.toString(),
            salt: salt.toString()
        };
    } catch (error) {
        console.error("Encryption error:", error);
        throw new Error("Encryption failed"); // Re-throw for handling in calling function
    }
}

function decrypt(encryptedData) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(initializationVector.substring(0, 16));
        const salt = CryptoJS.enc.Hex.parse(encryptedData.salt);
        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: 256 / 32,
            iterations: iterations,
            hasher: CryptoJS.algo.SHA256
        });

        const decrypted = CryptoJS.AES.decrypt(encryptedData.ciphertext, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decryptedData); // Parse the JSON string
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

module.exports = {
    encrypt,
    decrypt
};