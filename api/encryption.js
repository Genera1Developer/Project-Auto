const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'DefaultSecretKey123'; // Use environment variable for security
const ivKey = process.env.IV_KEY || 'DefaultIVKey12345';

function encrypt(data) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivKey.substring(0, 16)); // Ensure IV is 16 bytes
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(secretKey), {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
}

function decrypt(ciphertext) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivKey.substring(0, 16));
        const decrypted = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(secretKey), {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

module.exports = { encrypt, decrypt };