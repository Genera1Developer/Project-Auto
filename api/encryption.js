const CryptoJS = require('crypto-js');

const key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
const iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

function encrypt(plaintext) {
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}

function decrypt(ciphertext) {
  try {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
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