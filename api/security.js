const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32); // Generate a secure key
//const iv = crypto.randomBytes(16); // Generate a secure IV - GCM handles IV differently

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), authTag: authTag.toString('hex') };
}

function decrypt(encryptedData, ivHex, authTagHex) {
    try {
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encryptedData, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null; // Or throw the error, depending on your error handling strategy
    }
}

module.exports = { encrypt, decrypt };