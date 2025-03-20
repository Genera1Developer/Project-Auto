const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const { promisify } = require('util');

const dbPath = './api/accounts.db'; // Explicit path
let db;

const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex'); // Load from env
const ivLength = 16; // IV length for AES
const AUTH_TAG_LENGTH = 16; // For GCM
const SALT_LENGTH = 64;
const PBKDF2_ITERATIONS = 200000; // Increased iterations

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
                password_version INTEGER DEFAULT ${PBKDF2_ITERATIONS},
                encryption_iv BLOB NOT NULL,
                auth_tag BLOB NOT NULL
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

async function hashPassword(password, salt, iterations = PBKDF2_ITERATIONS) {
    const keylen = 64;
    const digest = 'sha512';
    const derivedKey = await pbkdf2(password, salt, iterations, keylen, digest);
    return derivedKey.toString('hex');
}

function generateSalt() {
    return crypto.randomBytes(SALT_LENGTH).toString('hex'); // Increased salt size
}

function encrypt(text, iv) {
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        encryptedData: encrypted.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(encryptedText, ivHex, authTagHex) {
    try {
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const encrypted = Buffer.from(encryptedText, 'hex');

        const decipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}


exports.createUser = async (username, password, callback) => {
    const salt = generateSalt();
    const iv = crypto.randomBytes(ivLength);

    try {
        const hashedPassword = await hashPassword(password, salt);

        const encryptedPassword = encrypt(hashedPassword, iv);
        const encryptedSalt = encrypt(salt, iv);

        const encryptedUsername = encrypt(username, iv);

        db.run(`INSERT INTO users (username, password, salt, password_version, encryption_iv, auth_tag) VALUES (?, ?, ?, ?, ?, ?)`, [encryptedUsername.encryptedData, encryptedPassword.encryptedData, encryptedSalt.encryptedData, PBKDF2_ITERATIONS, encryptedUsername.iv, encryptedUsername.authTag], function(err) {
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

        const salt = generateSalt();
        const iv = crypto.randomBytes(ivLength);
        const encryptedUsername = encrypt(username, iv);

        db.get(`SELECT id, username, password, salt, password_version, encryption_iv, auth_tag FROM users WHERE username = ?`, [encryptedUsername.encryptedData], async (err, row) => {
            if (err) {
                console.error(err.message);
                return callback(err);
            }
            if (!row) {
                return callback(null, false); // User not found
            }

            try {
                const decryptedUsername = decrypt(row.username, row.encryption_iv, row.auth_tag);
                if (!decryptedUsername) return callback(new Error("Username decryption failed"));

                const decryptedSalt = decrypt(row.salt, row.encryption_iv, row.auth_tag);
                if (!decryptedSalt) return callback(new Error("Salt decryption failed"));
                const hashedPassword = await hashPassword(password, decryptedSalt, row.password_version);

                const decryptedPassword = decrypt(row.password, row.encryption_iv, row.auth_tag);
                if (!decryptedPassword) return callback(new Error("Password decryption failed"));

                if (hashedPassword === decryptedPassword) {
                    callback(null, { id: row.id, username: decryptedUsername });
                } else {
                    callback(null, false); // Incorrect password
                }
            } catch (error) {
                console.error("Password verification error:", error);
                return callback(error);
            }
        });
    } catch (error) {
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