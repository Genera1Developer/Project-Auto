const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32); // 256 bits - MUST be securely stored and managed!

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Initialization vector - unique per encryption
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), authTag: authTag.toString('hex') };
}

function decrypt(text) {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedText = Buffer.from(text.encryptedData, 'hex');
    const authTag = Buffer.from(text.authTag, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    encrypt,
    decrypt
};