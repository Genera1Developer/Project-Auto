const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Generate a secure key
const iv = crypto.randomBytes(16); // Generate a secure IV

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(encryptedData, ivHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function storeData(filename, data) {
  const encryptedData = encrypt(JSON.stringify(data));
  fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(encryptedData));
}

function readData(filename) {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, filename));
    const encryptedData = JSON.parse(rawData);
    const decryptedData = decrypt(encryptedData.encryptedData, encryptedData.iv);
    return JSON.parse(decryptedData);
  } catch (error) {
    return null;
  }
}

module.exports = { storeData, readData };