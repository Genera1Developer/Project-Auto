const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'SecretPassphrase';
const ivString = process.env.IV_STRING || 'InitializationVe'; // Ensure length is 16
const iterations = parseInt(process.env.PBKDF2_ITERATIONS) || 120; // Increased iterations
const keySize = 256/32;
const saltSize = 128/8;

function encrypt(plainText) {
    const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16)); // Correctly sized IV
    const salt = CryptoJS.lib.WordArray.random(saltSize);

    const key = CryptoJS.PBKDF2(secretKey, salt, {
        keySize: keySize,
        iterations: iterations
    });

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    const saltHex = salt.toString(CryptoJS.enc.Hex);
    const encryptedHex = encrypted.toString();

    return saltHex + encryptedHex;
}

function decrypt(cipherText) {
    try {
        const saltHex = cipherText.substring(0, saltSize * 2);
        const encryptedHex = cipherText.substring(saltSize * 2);

        const salt = CryptoJS.enc.Hex.parse(saltHex);
        const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
        const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));

        const key = CryptoJS.PBKDF2(secretKey, salt, {
            keySize: keySize,
            iterations: iterations
        });

        const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
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

module.exports = {
    encrypt,
    decrypt,
    generateSecureKey
};