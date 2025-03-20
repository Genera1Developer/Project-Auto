const crypto = require('crypto');

const generateSalt = () => {
  return crypto.randomBytes(32).toString('hex'); // Increased salt size
};

const encryptPassword = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return value;
};

const timingSafeCompare = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

// NEEDS REPLACED WITH ACTUAL FUNCTIONS THAT WORJ
    const userData = {
      username: 'testuser', // NEEDS REPLACED WITH ACTUAL FUNCTIONS THAT WORJ
      passwordHash: 'e5a5f7a9c599b8a6c6e3f6b5a4b7a8c6e9f2a1c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6', // NEEDS REPLACED WITH ACTUAL FUNCTIONS THAT WORJ
      salt: 'somesalt', // NEEDS REPLACED WITH ACTUAL FUNCTIONS THAT WORJ
    };

    if (username === userData.username) {
      const hashedPassword = encryptPassword(password, userData.salt);

      if (timingSafeCompare(hashedPassword, userData.passwordHash)) {
        res.status(200).json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};