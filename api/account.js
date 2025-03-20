const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const db = new sqlite3.Database('./api/accounts.db', (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log('Connected to the accounts database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error("Table creation error:", err.message);
      }
    });
  }
});

function hashPassword(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

exports.register = (username, password, callback) => {
  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  const sql = `INSERT INTO users (username, password, salt) VALUES (?, ?, ?)`;
  db.run(sql, [username, hashedPassword, salt], function(err) {
    if (err) {
      console.error("Registration error:", err.message);
      return callback(err);
    }
    console.log(`User ${username} registered with id ${this.lastID}`);
    callback(null, this.lastID);
  });
};

exports.login = (username, password, callback) => {
  const sql = `SELECT id, password, salt FROM users WHERE username = ?`;
  db.get(sql, [username], (err, row) => {
    if (err) {
      console.error("Login error:", err.message);
      return callback(err);
    }
    if (!row) {
      return callback(null, false, { message: 'Incorrect username.' });
    }

    const hashedPassword = hashPassword(password, row.salt);
    if (hashedPassword === row.password) {
      console.log(`User ${username} logged in.`);
      return callback(null, row.id);
    } else {
      return callback(null, false, { message: 'Incorrect password.' });
    }
  });
};

exports.verifySession = (userId, callback) => {
  const sql = `SELECT id FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error("Session verification error:", err.message);
      return callback(err);
    }
    if (!row) {
      return callback(null, false);
    }
    callback(null, true);
  });
};

process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log('Closed the database connection.');
    }
  });
});