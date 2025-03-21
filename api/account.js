const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const { promisify } = require('util');

const dbPath = './api/accounts.db';
let db;

const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex');
const ivLength = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const PBKDF2_ITERATIONS = 200000;
const KEYLEN = 64;
const DIGEST = 'sha512';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

// Centralized error handling function
function handleDatabaseError(err, callback, message) {
    console.error(message, err.message);
    if (callback) {
        return callback(err);
    }
    throw err; // Re-throw if no callback is provided
}

let dbConnectAttempts = 0;
const MAX_DB_CONNECT_ATTEMPTS = 5;
const DB_CONNECT_RETRY_DELAY = 2000;

function connectToDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("Database connection error:", err.message);
            if (dbConnectAttempts < MAX_DB_CONNECT_ATTEMPTS) {
                dbConnectAttempts++;
                console.log(`Retrying database connection (attempt ${dbConnectAttempts}/${MAX_DB_CONNECT_ATTEMPTS}) in ${DB_CONNECT_RETRY_DELAY}ms`);
                setTimeout(connectToDatabase, DB_CONNECT_RETRY_DELAY);
            } else {
                handleDatabaseError(err, null, "Max database connection retries exceeded:");
            }
            return;
        }
        console.log('Connected to the accounts database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username BLOB NOT NULL,
                password BLOB NOT NULL,
                salt BLOB NOT NULL,
                iv BLOB NOT NULL,
                authTag BLOB NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                password_version INTEGER DEFAULT ${PBKDF2_ITERATIONS}
            )
        `, (err) => {
            if (err) {
                handleDatabaseError(err, null, "Table creation error:");
            }
        });
    });
}

connectToDatabase();

const pbkdf2 = promisify(crypto.pbkdf2);

async function hashPassword(password, salt, iterations = PBKDF2_ITERATIONS) {
    const derivedKey = await pbkdf2(password, salt, iterations, KEYLEN, DIGEST);
    return derivedKey.toString('hex');
}

function generateSalt() {
    return crypto.randomBytes(SALT_LENGTH).toString('hex');
}

function encrypt(text, iv) {
    try {
        const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted,
            authTag: authTag.toString('hex')
        };
    } catch (error) {
        console.error("Encryption error:", error);
        throw error;
    }
}

function decrypt(encryptedData, iv, authTag) {
    try {
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, Buffer.from(iv, 'hex'), { authTagLength: AUTH_TAG_LENGTH });
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

const validatePassword = (password) => {
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
    }
    if (!/[^a-zA-Z0-9\s]/.test(password)) {
        return "Password must contain at least one special character";
    }
    return null;
};


const verifyCredentials = async (username, password) => {
    try {
        const salt = generateSalt();
        const hashedPassword = await hashPassword(password, salt);
        const iv = crypto.randomBytes(ivLength);
        const encryptedUsername = encrypt(username, iv);
        const encryptedPassword = encrypt(hashedPassword, iv);

        return new Promise((resolve, reject) => {
            db.get(`SELECT id, username, password, salt, password_version, iv, authTag FROM users WHERE username = ?`, [encryptedUsername.encryptedData], async (err, row) => {
                if (err) {
                    handleDatabaseError(err, reject, "User verification query error:");
                    return;
                }

                if (!row) {
                    return resolve(false);
                }

                try {
                    const ivBuffer = Buffer.from(row.iv, 'hex');
                    const authTagBuffer = Buffer.from(row.authTag, 'hex');

                    const decryptedUsername = decrypt(row.username, row.iv, row.authTag);
                    if (decryptedUsername === null) {
                        return resolve(false);
                    }
                    const decryptedPassword = decrypt(row.password, row.iv, row.authTag);

                    const hashedPasswordAttempt = await hashPassword(password, row.salt, row.password_version);
                    const passwordsMatch = decryptedPassword === hashedPasswordAttempt;

                    if (!passwordsMatch) {
                        return resolve(false);
                    }

                    return resolve({ id: row.id, username: decryptedUsername });

                } catch (error) {
                    console.error("Decryption error:", error);
                    return reject(error);
                }
            });
        });
    } catch (error) {
        console.error("Encryption error:", error);
        throw error;
    }
};

exports.createUser = async (username, password, callback) => {
    if (!username || !password) {
        return callback(new Error("Username and password are required"));
    }

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
        return callback(new Error(passwordValidationMessage));
    }

    try {
        const salt = generateSalt();
        const hashedPassword = await hashPassword(password, salt);
        const iv = crypto.randomBytes(ivLength);
        const encryptedUsername = encrypt(username, iv);
        const encryptedPassword = encrypt(hashedPassword, iv);

        db.run(`INSERT INTO users (username, password, salt, iv, authTag, password_version) VALUES (?, ?, ?, ?, ?, ?)`, [encryptedUsername.encryptedData, encryptedPassword.encryptedData, salt, encryptedUsername.iv, encryptedUsername.authTag, PBKDF2_ITERATIONS], function(err) {
            if (err) {
                return handleDatabaseError(err, callback, "User creation error:");
            }
            return callback(null, { id: this.lastID, username: username });
        });
    } catch (err) {
        console.error("Password hashing error:", err);
        return callback(err);
    }
};

exports.verifyUser = async (username, password, callback) => {
    try {
        const user = await verifyCredentials(username, password);
        if(user) {
            return callback(null, user);
        } else {
            return callback(null, false);
        }
    } catch (error) {
        console.error("Verification failed:", error);
        return callback(error);
    }
};

let isDatabaseClosing = false;

exports.closeDatabase = () => {
    if (db && !isDatabaseClosing) {
        isDatabaseClosing = true;
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
            db = null;
            isDatabaseClosing = false;
        });
    }
};

process.on('exit', () => {
    exports.closeDatabase();
});

process.on('SIGINT', () => {
    exports.closeDatabase();
    process.exit();
});

process.on('SIGTERM', () => {
    exports.closeDatabase();
    process.exit();
});