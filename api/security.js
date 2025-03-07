const crypto = require('crypto');

const generateSecureKey = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateSecureSessionId = () => {
  return crypto.randomBytes(24).toString('hex');
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex'); // Generate a unique salt for each password
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
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex'); // Specify input encoding
  encrypted += cipher.final('hex'); // Specify output encoding
  return { iv: iv.toString('hex'), encryptedData: encrypted }; //Return directly the hex encoded string
};

const decryptData = (encryptedData, encryptionKey, iv) => {
  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedText = encryptedData //No conversion needed as encryptData returns a string directly; Buffer.from(encryptedData, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), ivBuffer);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8'); //Specify encoding
  decrypted += decipher.final('utf8'); //Specify encoding
  return JSON.parse(decrypted);
};

module.exports = {
  generateSecureKey,
  generateSecureSessionId,
  hashPassword,
  verifyPassword,
  encryptData,
  decryptData
};