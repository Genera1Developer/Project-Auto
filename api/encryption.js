const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'DefaultSecretKey'; // Use env variable for security
const ivString = process.env.IV_STRING || 'DefaultIVString';   // Use env variable for security

// Ensure the IV is exactly 16 bytes (128 bits)
const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));

function encrypt(data) {
  try {
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return cipher.toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

function decrypt(data) {
  try {
    const decipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decipher.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

module.exports = { encrypt, decrypt };