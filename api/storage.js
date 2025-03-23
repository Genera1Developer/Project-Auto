const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const algorithm = 'aes-256-gcm';
const keyPath = path.join(__dirname, 'storage.key');

function getKey() {
  try {
    const keyHex = fs.readFileSync(keyPath, 'utf8');
    return Buffer.from(keyHex, 'hex');
  } catch (error) {
    // Key doesn't exist, generate a new one
    const key = crypto.randomBytes(32);
    fs.writeFileSync(keyPath, key.toString('hex'), { mode: 0o600 }); // Restrict permissions
    return key;
  }
}

const key = getKey();

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

function decrypt(encryptedData, ivHex, authTagHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
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
    const decryptedData = decrypt(
      encryptedData.encryptedData,
      encryptedData.iv,
      encryptedData.authTag
    );
    return JSON.parse(decryptedData);
  } catch (error) {
    return null;
  }
}

module.exports = { storeData, readData };