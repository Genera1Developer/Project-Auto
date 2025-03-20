//sign-up.js
const crypto = require('crypto');

function hashPassword(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return value;
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    // Store username, salt, and hashedPassword securely in a database.
    // For demonstration purposes, we'll just log them.
    console.log('Username:', username);
    console.log('Salt:', salt);
    console.log('Hashed Password:', hashedPassword);

    return res.status(201).json({ message: 'User created successfully' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};