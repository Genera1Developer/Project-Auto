const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_KEY || 'DefaultSecretKey';
const ivString = process.env.ENCRYPTION_IV || 'DefaultIVString';

function encrypt(data) {
  try {
    const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(secretKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption Error:', error);
    throw new Error('Encryption failed');
  }
}

function decrypt(cipherText) {
  try {
    const iv = CryptoJS.enc.Utf8.parse(ivString.substring(0, 16));
    const decrypted = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error('Decryption Error:', error);
    throw new Error('Decryption failed');
  }
}

module.exports = { encrypt, decrypt };