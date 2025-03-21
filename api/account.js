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
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                password_version INTEGER DEFAULT ${PBKDF2_ITERATIONS},
                username_iv BLOB NOT NULL,
                username_auth_tag BLOB NOT NULL,
                password_iv BLOB NOT NULL,
                password_auth_tag BLOB NOT NULL,
                salt_iv BLOB NOT NULL,
                salt_auth_tag BLOB NOT NULL
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
        const encrypted = cipher.update(text, 'utf8');
        const finalEncrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return {
            encryptedData: finalEncrypted,
            authTag: authTag
        };
    } catch (error) {
        console.error("Encryption error:", error);
        throw error;
    }
}

function decrypt(encryptedData, iv, authTag) {
    try {
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        decipher.setAuthTag(authTag);
        const decrypted = decipher.update(encryptedData);
        const finalDecrypted = Buffer.concat([decrypted, decipher.final()]);
        return finalDecrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

const encryptSensitiveData = (data) => {
    try {
        const iv = crypto.randomBytes(ivLength);
        const { encryptedData, authTag } = encrypt(data, iv);
        return {
            encryptedData: encryptedData.toString('base64'),
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64')
        };
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};

const decryptSensitiveData = (ivB64, authTagB64, encryptedDataB64) => {
    if (!encryptedDataB64 || !ivB64 || !authTagB64) {
        return null;
    }

    try {
        const encryptedData = Buffer.from(encryptedDataB64, 'base64');
        const iv = Buffer.from(ivB64, 'base64');
        const authTag = Buffer.from(authTagB64, 'base64');
        const decrypted = decrypt(encryptedData, iv, authTag);
        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

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

exports.createUser = async (username, password, callback) => {
    if (!username || !password) {
        return callback(new Error("Username and password are required"));
    }

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
        return callback(new Error(passwordValidationMessage));
    }

    const salt = generateSalt();

    try {
        const hashedPassword = await hashPassword(password, salt);

        const usernameEncryption = encryptSensitiveData(username);
        const passwordEncryption = encryptSensitiveData(hashedPassword);
        const saltEncryption = encryptSensitiveData(salt);

        if (!usernameEncryption || !passwordEncryption || !saltEncryption) {
            return callback(new Error("Encryption failed"));
        }

        if (!usernameEncryption.encryptedData || !usernameEncryption.iv || !usernameEncryption.authTag ||
            !passwordEncryption.encryptedData || !passwordEncryption.iv || !passwordEncryption.authTag ||
            !saltEncryption.encryptedData || !saltEncryption.iv || !saltEncryption.authTag) {
            console.error("Encryption data is missing.  Debug:", { usernameEncryption, passwordEncryption, saltEncryption });
            return callback(new Error("Incomplete encryption data"));
        }


        const values = [
            usernameEncryption.encryptedData,
            passwordEncryption.encryptedData,
            saltEncryption.encryptedData,
            PBKDF2_ITERATIONS,
            usernameEncryption.iv,
            usernameEncryption.authTag,
            passwordEncryption.iv,
            passwordEncryption.authTag,
            saltEncryption.iv,
            saltEncryption.authTag
        ];

        db.run(`INSERT INTO users (username, password, salt, password_version, username_iv, username_auth_tag, password_iv, password_auth_tag, salt_iv, salt_auth_tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, values, function(err) {
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

exports.verifyUser = (username, password, callback) => {
    if (!username || !password) {
        return callback(new Error("Username and password are required"));
    }

    try {
        const usernameEncryption = encryptSensitiveData(username);

        if (!usernameEncryption) {
            return callback(new Error("Username encryption failed."));
        }

        db.get(`SELECT id, username, password, salt, password_version, username_iv, username_auth_tag, password_iv, password_auth_tag, salt_iv, salt_auth_tag FROM users WHERE username = ?`, [usernameEncryption.encryptedData], async (err, row) => {
            if (err) {
                return handleDatabaseError(err, callback, "User verification query error:");
            }
            if (!row) {
                return callback(null, false);
            }

            try {
                const decryptedUsername = decryptSensitiveData(row.username_iv, row.username_auth_tag, row.username);
                const decryptedSalt = decryptSensitiveData(row.salt_iv, row.salt_auth_tag, row.salt);
                const decryptedPassword = decryptSensitiveData(row.password_iv, row.password_auth_tag, row.password);

                if (!decryptedUsername || !decryptedSalt || !decryptedPassword) {
                    return callback(new Error("Decryption failed"));
                }

                if (username !== decryptedUsername) {
                    return callback(null, false); // Username doesn't match. Prevent password check.
                }

                const hashedPassword = await hashPassword(password, decryptedSalt, row.password_version);

                if (hashedPassword === decryptedPassword) {
                    return callback(null, { id: row.id, username: username });
                } else {
                    return callback(null, false);
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
    if (db) {
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
        db = null;
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