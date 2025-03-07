const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);
const salt = crypto.randomBytes(16); // Add salt

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, authTag, encrypted]).toString('hex');
}

function decrypt(encryptedHex) {
    const encryptedBuffer = Buffer.from(encryptedHex, 'hex');
    const salt = encryptedBuffer.slice(0, 16);
    const iv = encryptedBuffer.slice(16, 32);
    const authTag = encryptedBuffer.slice(32, 48);
    const encrypted = encryptedBuffer.slice(48);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = decipher.update(encrypted, 'binary', 'utf8') + decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };