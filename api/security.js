const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use a strong and authenticated encryption algorithm
const key = crypto.randomBytes(32); // Generate a secure key (32 bytes for AES-256)
//const iv = crypto.randomBytes(16);  GCM manages IV internally.  No need to create outside.

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), authTag: authTag.toString('hex') };
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

module.exports = {
    encrypt,
    decrypt,
    //key: key.toString('hex') // DO NOT export the key directly.  Use key exchange or KMS.
};