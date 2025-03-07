const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32); // Generate a secure key
// const iv = crypto.randomBytes(16); // Generate a secure IV - GCM manages IV internally

function encrypt(text) {
    const iv = crypto.randomBytes(16); // GCM requires a unique IV for each encryption
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();

    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), authTag: authTag.toString('hex') };
}

function decrypt(encryptedData, ivHex, authTagHex) {
    let iv = Buffer.from(ivHex, 'hex');
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let authTag = Buffer.from(authTagHex, 'hex');

    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = { encrypt, decrypt };