const CryptoJS = require('crypto-js');

const secretPhrase = 'MyEncryptionKey123!';
const ivString = 'MyIVector456!!';

function encrypt(text) {
    const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(secretPhrase, salt, {
        keySize: 256 / 32,
        iterations: 100
    });

    const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return salt.toString() + encrypted.toString();
}

function decrypt(encryptedText) {
    try {
        const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));
        const salt = CryptoJS.enc.Hex.parse(encryptedText.substring(0, 32));
        const encrypted = encryptedText.substring(32);

        const key = CryptoJS.PBKDF2(secretPhrase, salt, {
            keySize: 256 / 32,
            iterations: 100
        });

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

module.exports = { encrypt, decrypt };