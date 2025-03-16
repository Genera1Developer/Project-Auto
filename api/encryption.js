const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'SecretPassphrase'; // Use environment variable for key
const ivKey = process.env.IV_KEY || 'InitializationVe'; // Use environment variable for IV
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 100; //Use environment variable and parse into Integer

function encrypt(data) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivKey.substring(0, 16)); // Ensure IV is 16 bytes
        const salt = CryptoJS.lib.WordArray.random(128/8); // 16 bytes salt
        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: 256/32,   // 32 bytes
            iterations: saltRounds
        });

        const encrypted = CryptoJS.AES.encrypt(data, key, {
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
        const iv = CryptoJS.enc.Utf8.parse(ivKey.substring(0, 16)); // Ensure IV is 16 bytes
        const salt = CryptoJS.enc.Hex.parse(data.substring(0, 32));
        const encryptedData = data.substring(32);

        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: 256/32,   // 32 bytes
            iterations: saltRounds
        });

        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        return decryptedText;

    } catch (error) {
        console.error("Decryption Error:", error);
        return null;
    }
}

module.exports = { encrypt, decrypt };