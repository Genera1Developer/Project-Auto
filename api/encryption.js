import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const keyLength = 32;
const ivLength = 16;

function generateKey() {
  return crypto.randomBytes(keyLength);
}

function encrypt(text, key) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

function decrypt(encryptionData, key) {
  try {
    const iv = Buffer.from(encryptionData.iv, 'hex');
    const encryptedText = Buffer.from(encryptionData.encryptedData, 'hex');
    const authTag = Buffer.from(encryptionData.authTag, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

export { encrypt, decrypt, generateKey };