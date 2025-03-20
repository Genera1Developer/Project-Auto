const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(text) {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedData = Buffer.from(text.encryptedData, 'hex');
    const authTag = Buffer.from(text.authTag, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };