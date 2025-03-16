class Encryption {
  constructor(algorithm = 'aes-256-cbc', secretKey = 'defaultKey') {
    this.algorithm = algorithm;
    this.secretKey = secretKey;
    this.iv = crypto.randomBytes(16); // Initialization Vector
  }

  encrypt(text) {
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this.iv.toString('hex'),
      encryptedData: encrypted.toString('hex')
    };
  }

  decrypt(text) {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  static generateSecretKey(length = 32) {
      return crypto.randomBytes(length).toString('hex');
  }

  static hash(data) {
      return crypto.createHash('sha256').update(data).digest('hex');
  }
}

module.exports = Encryption;