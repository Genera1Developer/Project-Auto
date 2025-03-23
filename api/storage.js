const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const util = require('util');

const algorithm = 'aes-256-gcm';
const keyPath = path.join(__dirname, 'storage.key');
const gzip = util.promisify(zlib.gzip);
const gunzip = util.promisify(zlib.gunzip);

let key;

async function getKey() {
  if (key) return key;
  try {
    const keyHex = await fs.promises.readFile(keyPath, 'utf8');
    key = Buffer.from(keyHex, 'hex');
    return key;
  } catch (error) {
    const newKey = crypto.randomBytes(32);
    await fs.promises.writeFile(keyPath, newKey.toString('hex'), { mode: 0o600 });
    key = newKey;
    return key;
  }
}

async function encrypt(text) {
  const keyBuffer = await getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: authTag.toString('hex'),
  };
}

async function decrypt(encryptedData, ivHex, authTagHex) {
  const keyBuffer = await getKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function storeData(filename, data) {
  const compressedData = await gzip(JSON.stringify(data));
  const encryptedData = await encrypt(compressedData.toString('binary'));
  await fs.promises.writeFile(path.join(__dirname, filename), JSON.stringify(encryptedData));
}

async function readData(filename) {
  try {
    const rawData = await fs.promises.readFile(path.join(__dirname, filename));
    const encryptedData = JSON.parse(rawData.toString());
    const decryptedData = await decrypt(
      encryptedData.encryptedData,
      encryptedData.iv,
      encryptedData.authTag
    );
    const decompressedData = await gunzip(Buffer.from(decryptedData, 'binary'));
    return JSON.parse(decompressedData.toString());
  } catch (error) {
    return null;
  }
}

module.exports = { storeData, readData };