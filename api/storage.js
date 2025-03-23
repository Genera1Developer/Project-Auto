const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

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
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: authTag.toString('hex'),
  };
}

function decrypt(encryptedData, ivHex, authTagHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function storeData(filename, data) {
  const compressedData = zlib.gzipSync(JSON.stringify(data));
  const encryptedData = encrypt(compressedData.toString('binary'));
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
    const decompressedData = zlib.gunzipSync(Buffer.from(decryptedData, 'binary'));
    return JSON.parse(decompressedData.toString());
  } catch (error) {
    return null;
  }
}

module.exports = { storeData, readData };