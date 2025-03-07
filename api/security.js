const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use a strong encryption algorithm with authentication
const key = crypto.randomBytes(32); // Generate a secure, random key
// No IV needed for GCM as it's handled internally, but a nonce is. Consider user-provided or KDF derived nonce for added security.
//const iv = crypto.randomBytes(16); //  Removed: IV is not directly needed for GCM, nonce/salt is preferred.

function encrypt(text) {
    const nonce = crypto.randomBytes(16); // Use a random nonce for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, nonce);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        nonce: nonce.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(encrypted) {
    const nonce = Buffer.from(encrypted.nonce, 'hex');
    const encryptedData = Buffer.from(encrypted.encryptedData, 'hex');
    const authTag = Buffer.from(encrypted.authTag, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, nonce);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };