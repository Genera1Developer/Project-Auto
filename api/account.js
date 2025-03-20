const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const { promisify } = require('util');
const { createCipheriv, createDecipheriv } = crypto;

const dbPath = './api/accounts.db'; // Explicit path
let db;

const encryptionKey = crypto.randomBytes(32); // 256-bit key, DO NOT HARDCODE IN PRODUCTION
const ivLength = 16; // IV length for AES
const AUTH_TAG_LENGTH = 16; // For GCM

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
                username BLOB UNIQUE NOT NULL,
                password BLOB NOT NULL,
                salt BLOB NOT NULL,
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
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}

function decrypt(encryptedText) {
    const encryptedBytes = Buffer.from(encryptedText, 'hex');
    const iv = encryptedBytes.slice(0, ivLength);
    const authTag = encryptedBytes.slice(ivLength, ivLength + AUTH_TAG_LENGTH);
    const encrypted = encryptedBytes.slice(ivLength + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}


exports.createUser = async (username, password, callback) => {
    const salt = generateSalt();
    try {
        const { hashedPassword, iterations } = await hashPassword(password, salt);
        const encryptedUsername = encrypt(username);
        const encryptedPassword = encrypt(hashedPassword);
        const encryptedSalt = encrypt(salt);

        db.run(`INSERT INTO users (username, password, salt, password_version) VALUES (?, ?, ?, ?)`, [encryptedUsername, encryptedPassword, encryptedSalt, iterations], function(err) {
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
    try {
        const encryptedUsername = encrypt(username);
    db.get(`SELECT id, username, password, salt, password_version FROM users WHERE username = ?`, [encryptedUsername], async (err, row) => {
        if (err) {
            console.error(err.message);
            return callback(err);
        }
        if (!row) {
            return callback(null, false); // User not found
        }

        try {
            const decryptedSalt = decrypt(row.salt);
            const { hashedPassword } = await hashPassword(password, decryptedSalt, row.password_version);
            const decryptedPassword = decrypt(row.password);
            if (hashedPassword === decryptedPassword) {
                callback(null, { id: row.id, username: decrypt(row.username) });
            } else {
                callback(null, false); // Incorrect password
            }
        } catch (error) {
            console.error("Password verification error:", error);
            return callback(error);
        }
    });
    } catch(error) {
        console.error("Encryption error:", error);
        return callback(error);
    }
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