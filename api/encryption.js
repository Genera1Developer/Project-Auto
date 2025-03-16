const CryptoJS = require('crypto-js');

const secretPhrase = 'SuperSecretPassphrase';
const initializationVector = 'InitializationVe'; //Must be exactly 16 bytes

function encrypt(plainText) {
    const iv = CryptoJS.enc.Utf8.parse(initializationVector);
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(secretPhrase, salt, {
        keySize: 256 / 32,
        iterations: 500,
    });

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return salt.toString() + encrypted.toString();
}

function decrypt(cipherText) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(initializationVector);
        const salt = CryptoJS.enc.Hex.parse(cipherText.substring(0, 32));
        const encrypted = cipherText.substring(32);

        const key = CryptoJS.PBKDF2(secretPhrase, salt, {
            keySize: 256 / 32,
            iterations: 500,
        });

        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption Error:', error);
        return null;
    }
}

module.exports = { encrypt, decrypt };