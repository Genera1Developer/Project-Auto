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
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        return {
            encryptedData: encrypted,
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
    if (!data) {
        console.warn("encryptSensitiveData called with null/undefined data");
        return null;
    }
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
        console.warn("decryptSensitiveData called with null/undefined data");
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

const encryptWithPassword = async (data, password) => {
    try {
        const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
        const hashedPassword = await hashPassword(password, salt);
        const iv = crypto.randomBytes(ivLength);
        const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(hashedPassword, 'hex').slice(0,32), iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();

        return {
            encryptedData: encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            salt: salt
        };

    } catch (error) {
        console.error("Encryption with password error:", error);
        return null;
    }
};

const decryptWithPassword = async (encryptedData, iv, authTag, password, salt) => {
    try {
        const hashedPassword = await hashPassword(password, salt);
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(hashedPassword, 'hex').slice(0,32), Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption with password error:", error);
        return null;
    }
};

const verifyCredentials = async (username, password) => {
    try {
        const usernameEncryption = encryptSensitiveData(username);
        if (!usernameEncryption) {
            throw new Error("Username encryption failed");
        }

        const encryptedUsername = usernameEncryption.encryptedData;

        return new Promise((resolve, reject) => {
            db.get(`SELECT id, username, password, salt, password_version, username_iv, username_auth_tag, password_iv, password_auth_tag, salt_iv, salt_auth_tag FROM users WHERE username = ?`, [encryptedUsername], async (err, row) => {
                if (err) {
                    handleDatabaseError(err, null, "User verification query error:");
                    return reject(err);
                }

                if (!row) {
                    return resolve(false);
                }

                try {
                    const decryptedUsername = decryptSensitiveData(row.username_iv, row.username_auth_tag, row.username);
                    const decryptedSalt = decryptSensitiveData(row.salt_iv, row.salt_auth_tag, row.salt);
                    const decryptedPassword = decryptSensitiveData(row.password_iv, row.password_auth_tag, row.password);

                    if (!decryptedUsername || !decryptedSalt || !decryptedPassword) {
                        return reject(new Error("Decryption failed"));
                    }

                    if (username !== decryptedUsername) {
                        return resolve(false); // Username doesn't match. Prevent password check.
                    }

                    const hashedPassword = await hashPassword(password, decryptedSalt, row.password_version);

                    if (hashedPassword === decryptedPassword) {
                        return resolve({ id: row.id, username: username });
                    } else {
                        return resolve(false);
                    }
                } catch (error) {
                    console.error("Password verification error:", error);
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

        const usernameEncryption = encryptSensitiveData(username);
        if (!usernameEncryption) {
            return callback(new Error("Username encryption failed"));
        }
        const passwordEncryption = encryptSensitiveData(hashedPassword);
        const saltEncryption = encryptSensitiveData(salt);

        if (!passwordEncryption || !saltEncryption) {
            return callback(new Error("Encryption failed"));
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
edit filepath: api/account.js
content: const sqlite3 = require('sqlite3').verbose();
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
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        return {
            encryptedData: encrypted,
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
    if (!data) {
        console.warn("encryptSensitiveData called with null/undefined data");
        return null;
    }
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
        console.warn("decryptSensitiveData called with null/undefined data");
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

const encryptWithPassword = async (data, password) => {
    try {
        const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
        const hashedPassword = await hashPassword(password, salt);
        const iv = crypto.randomBytes(ivLength);
        const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(hashedPassword, 'hex').slice(0,32), iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();

        return {
            encryptedData: encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            salt: salt
        };

    } catch (error) {
        console.error("Encryption with password error:", error);
        return null;
    }
};

const decryptWithPassword = async (encryptedData, iv, authTag, password, salt) => {
    try {
        const hashedPassword = await hashPassword(password, salt);
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(hashedPassword, 'hex').slice(0,32), Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption with password error:", error);
        return null;
    }
};

const verifyCredentials = async (username, password) => {
    try {
        const salt = generateSalt();
        const hashedPassword = await hashPassword(password, salt);
        const iv = crypto.randomBytes(ivLength);

        return new Promise((resolve, reject) => {
            db.get(`SELECT id, username, password, salt, password_version FROM users WHERE username = ?`, [username], async (err, row) => {
                if (err) {
                    handleDatabaseError(err, null, "User verification query error:");
                    return reject(err);
                }

                if (!row) {
                    return resolve(false);
                }

                try {
                    const decryptedPassword = decryptWithPassword(row.password, iv.toString('hex'),hashedPassword, password, row.salt)

                    if (!decryptedPassword) {
                        return reject(new Error("Decryption failed"));
                    }

                    const hashedPassword = await hashPassword(password, row.salt, row.password_version);

                    if (hashedPassword === decryptedPassword) {
                        return resolve({ id: row.id, username: username });
                    } else {
                        return resolve(false);
                    }
                } catch (error) {
                    console.error("Password verification error:", error);
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

        const passwordEncryption = await encryptWithPassword(hashedPassword,password);

        const values = [
            username,
            passwordEncryption.encryptedData,
            salt,
            PBKDF2_ITERATIONS,
        ];

        db.run(`INSERT INTO users (username, password, salt, password_version) VALUES (?, ?, ?, ?)`, values, function(err) {
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