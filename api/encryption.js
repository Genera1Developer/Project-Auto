const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Use a strong encryption algorithm
const key = crypto.randomBytes(32); // Generate a secure key (32 bytes for AES-256)
const iv = crypto.randomBytes(16); // Generate a secure initialization vector (16 bytes for AES)

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex'); // Include IV in the output
}

function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error("Decryption Error:", error);
        return null; // Or throw the error, depending on your error handling strategy
    }
}

module.exports = { encrypt, decrypt };