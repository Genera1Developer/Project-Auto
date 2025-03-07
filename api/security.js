const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const keyLength = 32; // 256 bits
const ivLength = 16; // 128 bits
const saltLength = 16; // For key derivation

function generateSalt() {
    return crypto.randomBytes(saltLength).toString('hex');
}

function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, keyLength, 'sha512');
}

function encrypt(data, password) {
    const salt = generateSalt();
    const key = deriveKey(password, salt);
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex'),
        salt: salt
    };
}

function decrypt(encryptedData, password) {
    const salt = encryptedData.salt;
    const key = deriveKey(password, salt);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const encryptedText = Buffer.from(encryptedData.encryptedData, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };