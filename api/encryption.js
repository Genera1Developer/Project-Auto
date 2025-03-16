class Encryption {
    constructor(key) {
        if (!key || key.length !== 32) {
            throw new Error('Encryption key must be 32 bytes (256 bits).');
        }
        this.key = key;
        this.algorithm = 'aes-256-cbc';
    }

    async encrypt(text) {
        const crypto = await import('crypto');
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    async decrypt(text) {
         const crypto = await import('crypto');
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    static generateKey() {
        const crypto = require('crypto');
        return crypto.randomBytes(32).toString('hex');
    }
}

module.exports = Encryption;