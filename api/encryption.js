class EncryptionHandler {
  constructor(algorithm = 'AES-CBC', keySize = 256) {
    this.algorithm = algorithm;
    this.keySize = keySize;
  }

  generateKey() {
    const crypto = require('crypto');
    return crypto.randomBytes(this.keySize / 8);
  }

  generateIV() {
    const crypto = require('crypto');
    return crypto.randomBytes(16);
  }

  encrypt(data, key, iv) {
    const crypto = require('crypto');
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedData, key, iv) {
    const crypto = require('crypto');
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async generateKeyPair() {
    const crypto = require('crypto');
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        }
      }, (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      });
    });
  }

  async encryptWithPublicKey(data, publicKey) {
    const crypto = require('crypto');
    try {
      const buffer = Buffer.from(data, 'utf8');
      const encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      }, buffer);
      return encrypted.toString('hex');
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Public key encryption failed");
    }
  }

  async decryptWithPrivateKey(encryptedData, privateKey) {
    const crypto = require('crypto');
    try {
      const buffer = Buffer.from(encryptedData, 'hex');
      const decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      }, buffer);
      return decrypted.toString('utf8');
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Private key decryption failed");
    }
  }

  generateSalt() {
    const crypto = require('crypto');
    return crypto.randomBytes(16).toString('hex');
  }

  hashPassword(password, salt) {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
  }

  async generateSecureToken() {
    const crypto = require('crypto');
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, function(err, buffer) {
        if (err) {
          reject(err);
          return;
        }
        resolve(buffer.toString('hex'));
      });
    });
  }
}

module.exports = EncryptionHandler;