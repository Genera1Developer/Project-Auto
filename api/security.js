const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);
//const iv = crypto.randomBytes(16); //Using a fixed IV is insecure!

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + authTag.toString('hex');
}

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.shift(), 'hex');
    const authTag = Buffer.from(textParts.shift(), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encryptedText, 'binary'), decipher.final()]);
    return decrypted.toString('utf8');
}

module.exports = {
    encrypt,
    decrypt
};