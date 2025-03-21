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

function connectToDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("Database connection error:", err.message);
            throw err;
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
                console.error("Table creation error:", err.message);
                throw err;
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
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        encryptedData: encrypted,
        authTag: authTag
    };
}

function decrypt(encryptedData, iv, authTag) {
    try {
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

const encryptData = (data) => {
    const iv = crypto.randomBytes(ivLength);
    const { encryptedData, authTag } = encrypt(data, iv);
    return {
        encryptedData: encryptedData.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
};

const decryptData = (encryptedDataHex, ivHex, authTagHex) => {
    try {
        if (!encryptedDataHex || !ivHex || !authTagHex) {
          return null;
        }
        const encryptedData = Buffer.from(encryptedDataHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decryptedText = decrypt(encryptedData, iv, authTag);
        return decryptedText;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

exports.createUser = async (username, password, callback) => {
    if (!username || !password) {
        return callback(new Error("Username and password are required"));
    }
    const salt = generateSalt();

    try {
        const hashedPassword = await hashPassword(password, salt);

        const usernameEncryption = encryptData(username);
        const passwordEncryption = encryptData(hashedPassword);
        const saltEncryption = encryptData(salt);

        db.run(`INSERT INTO users (username, password, salt, password_version, username_iv, username_auth_tag, password_iv, password_auth_tag, salt_iv, salt_auth_tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [usernameEncryption.encryptedData, passwordEncryption.encryptedData, saltEncryption.encryptedData, PBKDF2_ITERATIONS, usernameEncryption.iv, usernameEncryption.authTag, passwordEncryption.iv, passwordEncryption.authTag, saltEncryption.iv, saltEncryption.authTag], function(err) {
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
    if (!username || !password) {
        return callback(new Error("Username and password are required"));
    }

    try {
        const usernameEncryption = encryptData(username);

        db.get(`SELECT id, username, password, salt, password_version, username_iv, username_auth_tag, password_iv, password_auth_tag, salt_iv, salt_auth_tag FROM users WHERE username = ?`, [usernameEncryption.encryptedData], async (err, row) => {
            if (err) {
                console.error(err.message);
                return callback(err);
            }
            if (!row) {
                return callback(null, false);
            }

            try {
                const decryptedUsername = decryptData(row.username, row.username_iv, row.username_auth_tag);
                if (!decryptedUsername) {
                    return callback(new Error("Username decryption failed"));
                }

                if (decryptedUsername !== username) {
                  return callback(null, false);
                }

                const decryptedSalt = decryptData(row.salt, row.salt_iv, row.salt_auth_tag);
                if (!decryptedSalt) {
                    return callback(new Error("Salt decryption failed"));
                }

                const decryptedPassword = decryptData(row.password, row.password_iv, row.password_auth_tag);
                if (!decryptedPassword) {
                    return callback(new Error("Password decryption failed"));
                }

                const hashedPassword = await hashPassword(password, decryptedSalt, row.password_version);

                if (hashedPassword === decryptedPassword) {
                    callback(null, { id: row.id, username: decryptedUsername });
                } else {
                    callback(null, false);
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

function connectToDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("Database connection error:", err.message);
            throw err;
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
                console.error("Table creation error:", err.message);
                throw err;
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
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        encryptedData: encrypted,
        authTag: authTag
    };
}

function decrypt(encryptedData, iv, authTag) {
    try {
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

const encryptData = (data) => {
    const iv = crypto.randomBytes(ivLength);
    const { encryptedData, authTag } = encrypt(data, iv);
    return {
        encryptedData: encryptedData.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
};

const decryptData = (encryptedDataHex, ivHex, authTagHex) => {
    try {
        if (!encryptedDataHex || !ivHex || !authTagHex) {
          return null;
        }
        const encryptedData = Buffer.from(encryptedDataHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decryptedText = decrypt(encryptedData, iv, authTag);
        return decryptedText;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

exports.createUser = async (username, password, callback) => {
    if (!username || !password) {
        return callback(new Error("Username and password are required"));
    }
    const salt = generateSalt();

    try {
        const hashedPassword = await hashPassword(password, salt);

        const usernameEncryption = encryptData(username);
        const passwordEncryption = encryptData(hashedPassword);
        const saltEncryption = encryptData(salt);

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
    if (!username || !password) {
        return callback(new Error("Username and password are required"));
    }

    try {
        const usernameEncryption = encryptData(username);

        db.get(`SELECT id, username, password, salt, password_version, username_iv, username_auth_tag, password_iv, password_auth_tag, salt_iv, salt_auth_tag FROM users WHERE username = ?`, [usernameEncryption.encryptedData], async (err, row) => {
            if (err) {
                console.error(err.message);
                return callback(err);
            }
            if (!row) {
                return callback(null, false);
            }

            try {
                const decryptedUsername = decryptData(row.username, row.username_iv, row.username_auth_tag);
                if (!decryptedUsername) {
                    return callback(new Error("Username decryption failed"));
                }

                if (decryptedUsername !== username) {
                  return callback(null, false);
                }

                const decryptedSalt = decryptData(row.salt, row.salt_iv, row.salt_auth_tag);
                if (!decryptedSalt) {
                    return callback(new Error("Salt decryption failed"));
                }

                const decryptedPassword = decryptData(row.password, row.password_iv, row.password_auth_tag);
                if (!decryptedPassword) {
                    return callback(new Error("Password decryption failed"));
                }

                const hashedPassword = await hashPassword(password, decryptedSalt, row.password_version);

                if (hashedPassword === decryptedPassword) {
                    callback(null, { id: row.id, username: decryptedUsername });
                } else {
                    callback(null, false);
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

function connectToDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            handleDatabaseError(err, null, "Database connection error:");
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
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        encryptedData: encrypted,
        authTag: authTag
    };
}

function decrypt(encryptedData, iv, authTag) {
    try {
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

const encryptData = (data) => {
    const iv = crypto.randomBytes(ivLength);
    const { encryptedData, authTag } = encrypt(data, iv);
    return {
        encryptedData: encryptedData.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
};

const decryptData = (encryptedDataHex, ivHex, authTagHex) => {
    try {
        if (!encryptedDataHex || !ivHex || !authTagHex) {
          return null;
        }
        const encryptedData = Buffer.from(encryptedDataHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decryptedText = decrypt(encryptedData, iv, authTag);
        return decryptedText;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

exports.createUser = async (username, password, callback) => {
    if (!username || !password) {
        return callback(new Error("Username and password are required"));
    }
    const salt = generateSalt();

    try {
        const hashedPassword = await hashPassword(password, salt);

        const usernameEncryption = encryptData(username);
        const passwordEncryption = encryptData(hashedPassword);
        const saltEncryption = encryptData(salt);

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
            callback(null, { id: this.lastID, username: username });
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
        const usernameEncryption = encryptData(username);

        db.get(`SELECT id, username, password, salt, password_version, username_iv, username_auth_tag, password_iv, password_auth_tag, salt_iv, salt_auth_tag FROM users WHERE username = ?`, [usernameEncryption.encryptedData], async (err, row) => {
            if (err) {
                return handleDatabaseError(err, callback, "User verification query error:");
            }
            if (!row) {
                return callback(null, false);
            }

            try {
                const decryptedUsername = decryptData(row.username, row.username_iv, row.username_auth_tag);
                if (!decryptedUsername) {
                    return callback(new Error("Username decryption failed"));
                }

                if (decryptedUsername !== username) {
                  return callback(null, false);
                }

                const decryptedSalt = decryptData(row.salt, row.salt_iv, row.salt_auth_tag);
                if (!decryptedSalt) {
                    return callback(new Error("Salt decryption failed"));
                }

                const decryptedPassword = decryptData(row.password, row.password_iv, row.password_auth_tag);
                if (!decryptedPassword) {
                    return callback(new Error("Password decryption failed"));
                }

                const hashedPassword = await hashPassword(password, decryptedSalt, row.password_version);

                if (hashedPassword === decryptedPassword) {
                    callback(null, { id: row.id, username: decryptedUsername });
                } else {
                    callback(null, false);
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