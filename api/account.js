const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const { promisify } = require('util');
const { createCipheriv, createDecipheriv } = crypto;

const dbPath = './api/accounts.db'; // Explicit path
let db;

const encryptionKey = crypto.randomBytes(32); // 256-bit key
const ivLength = 16; // IV length for AES

function connectToDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("Database connection error:", err.message);
            throw err; // Crucial: Terminate on DB connection failure.
        }
        console.log('Connected to the accounts database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                salt TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                password_version INTEGER DEFAULT 1
            )
        `, (err) => {
            if (err) {
                console.error("Table creation error:", err.message);
                throw err; // Terminate if table creation fails.
            }
        });
    });
}

connectToDatabase(); // Initialize database connection on module load


const pbkdf2 = promisify(crypto.pbkdf2);

async function hashPassword(password, salt, iterations = 100000) {
    const keylen = 64;
    const digest = 'sha512';
    const derivedKey = await pbkdf2(password, salt, iterations, keylen, digest);
    return {
        hashedPassword: derivedKey.toString('hex'),
        salt: salt,
        iterations: iterations
    };
}

function generateSalt() {
    return crypto.randomBytes(32).toString('hex'); // Increased salt size
}

function encrypt(text) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}


exports.createUser = async (username, password, callback) => {
    const salt = generateSalt();
    try {
        const { hashedPassword, iterations } = await hashPassword(password, salt);
        const encryptedUsername = encrypt(username);

        db.run(`INSERT INTO users (username, password, salt, password_version) VALUES (?, ?, ?, ?)`, [encryptedUsername, hashedPassword, salt, iterations], function(err) {
            if (err) {
                console.error(err.message);
                return callback(err);
            }
            callback(null, { id: this.lastID, username: username });
        });
    } catch (err) {
        console.error("Password hashing error:", err);
        return callback(err);
    }
};


exports.verifyUser = (username, password, callback) => {
    db.get(`SELECT id, username, password, salt, password_version FROM users WHERE username = ?`, [encrypt(username)], async (err, row) => {
        if (err) {
            console.error(err.message);
            return callback(err);
        }
        if (!row) {
            return callback(null, false); // User not found
        }

        try {
            const { hashedPassword } = await hashPassword(password, row.salt, row.password_version);
            if (hashedPassword === row.password) {
                callback(null, { id: row.id, username: decrypt(row.username) });
            } else {
                callback(null, false); // Incorrect password
            }
        } catch (error) {
            console.error("Password verification error:", error);
            return callback(error);
        }
    });
};

exports.closeDatabase = () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
};
process.on('exit', () => {
    if (db) {
        exports.closeDatabase(); // Ensure DB closes on exit.
    }
});
process.on('SIGINT', () => {
    if (db) {
        exports.closeDatabase(); // Close db on Ctrl+C
    }
    process.exit();
});

process.on('SIGTERM', () => {
    if (db) {
        exports.closeDatabase(); // Close db on termination
    }
    process.exit();
});