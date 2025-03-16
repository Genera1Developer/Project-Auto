const CryptoJS = require('crypto-js');

// Generate a more secure, random key and IV on server start or using a secure method. DO NOT HARDCODE IN PRODUCTION
const generateRandomKey = () => CryptoJS.lib.WordArray.random(16).toString();
const generateRandomIV = () => CryptoJS.lib.WordArray.random(16).toString();

const key = CryptoJS.enc.Hex.parse(generateRandomKey());
const iv = CryptoJS.enc.Hex.parse(generateRandomIV());

function encrypt(plaintext) {
  try {
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
}

function decrypt(ciphertext) {
  try {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

module.exports = {
  encrypt,
  decrypt
};