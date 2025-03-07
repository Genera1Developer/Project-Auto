const crypto = require('crypto');

const generateSecureKey = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateSecureSessionId = () => {
  return crypto.randomBytes(24).toString('hex');
};

const hashPassword = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return {
    salt: salt,
    hash: hash.digest('hex')
  };
};

const verifyPassword = (password, hashedPassword, salt) => {
  const verificationHash = crypto.createHmac('sha512', salt);
  verificationHash.update(password);
  const calculatedHash = verificationHash.digest('hex');
  return calculatedHash === hashedPassword;
};

const encryptData = (data, encryptionKey) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

const decryptData = (encryptedData, encryptionKey, iv) => {
  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), ivBuffer);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
};

module.exports = {
  generateSecureKey,
  generateSecureSessionId,
  hashPassword,
  verifyPassword,
  encryptData,
  decryptData
};