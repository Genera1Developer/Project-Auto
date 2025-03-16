const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'SecretPassphrase';
const ivKey = process.env.IV_KEY || 'InitializationVe';
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 100;

function encrypt(data) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivKey.substring(0, 16));
        const salt = CryptoJS.lib.WordArray.random(128/8);
        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: 256/32,
            iterations: saltRounds
        });

        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, { // Encrypt JSON string
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return salt.toString() + encrypted.toString();
    } catch (error) {
        console.error("Encryption Error:", error);
        return null;
    }
}

function decrypt(data) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivKey.substring(0, 16));
        const salt = CryptoJS.enc.Hex.parse(data.substring(0, 32));
        const encryptedData = data.substring(32);

        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: 256/32,
            iterations: saltRounds
        });

        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedText); // Parse JSON string

    } catch (error) {
        console.error("Decryption Error:", error);
        return null;
    }
}

module.exports = { encrypt, decrypt };