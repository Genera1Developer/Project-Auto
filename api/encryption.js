const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use GCM for authenticated encryption
const key = crypto.randomBytes(32); // Generate a secure, random key
const salt = crypto.randomBytes(16); // Add salt for key derivation

function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
}

function encrypt(text, password) {
    const iv = crypto.randomBytes(16);
    const cipherKey = deriveKey(password, salt);
    const cipher = crypto.createCipheriv(algorithm, cipherKey, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(text, password) {
    const iv = Buffer.from(text.iv, 'hex');
    const salt = Buffer.from(text.salt, 'hex');
    const authTag = Buffer.from(text.authTag, 'hex');
    const encryptedData = Buffer.from(text.encryptedData, 'hex');
    const cipherKey = deriveKey(password, salt);

    const decipher = crypto.createDecipheriv(algorithm, cipherKey, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };