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
                encryption_iv BLOB NOT NULL,
                auth_tag BLOB NOT NULL
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
        iv: iv,
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
        const hashedPasswordEncryption = encryptData(hashedPassword);
        const saltEncryption = encryptData(salt);

        db.run(`INSERT INTO users (username, password, salt, password_version, encryption_iv, auth_tag) VALUES (?, ?, ?, ?, ?, ?)`, [usernameEncryption.encryptedData, hashedPasswordEncryption.encryptedData, saltEncryption.encryptedData, PBKDF2_ITERATIONS, usernameEncryption.iv, usernameEncryption.authTag], function(err) {
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

        db.get(`SELECT id, username, password, salt, password_version, encryption_iv, auth_tag FROM users WHERE username = ?`, [usernameEncryption.encryptedData], async (err, row) => {
            if (err) {
                console.error(err.message);
                return callback(err);
            }
            if (!row) {
                return callback(null, false);
            }

            try {
                const decryptedUsername = decryptData(row.username, row.encryption_iv, row.auth_tag);
                if (!decryptedUsername) {
                    return callback(new Error("Username decryption failed"));
                }

                if (decryptedUsername !== username) {
                  return callback(null, false);
                }

                const decryptedSalt = decryptData(row.salt, row.encryption_iv, row.auth_tag);
                if (!decryptedSalt) {
                    return callback(new Error("Salt decryption failed"));
                }

                const decryptedPassword = decryptData(row.password, row.encryption_iv, row.auth_tag);
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
                encryption_iv BLOB NOT NULL,
                auth_tag BLOB NOT NULL
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
        iv: iv,
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

        db.run(`INSERT INTO users (username, password, salt, password_version, encryption_iv, auth_tag) VALUES (?, ?, ?, ?, ?, ?)`, [usernameEncryption.encryptedData, passwordEncryption.encryptedData, saltEncryption.encryptedData, PBKDF2_ITERATIONS, usernameEncryption.iv, usernameEncryption.authTag], function(err) {
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

        db.get(`SELECT id, username, password, salt, password_version, encryption_iv, auth_tag FROM users WHERE username = ?`, [usernameEncryption.encryptedData], async (err, row) => {
            if (err) {
                console.error(err.message);
                return callback(err);
            }
            if (!row) {
                return callback(null, false);
            }

            try {
                const decryptedUsername = decryptData(row.username, row.encryption_iv, row.auth_tag);
                if (!decryptedUsername) {
                    return callback(new Error("Username decryption failed"));
                }

                if (decryptedUsername !== username) {
                  return callback(null, false);
                }

                const decryptedSalt = decryptData(row.salt, row.encryption_iv, row.auth_tag);
                if (!decryptedSalt) {
                    return callback(new Error("Salt decryption failed"));
                }

                const decryptedPassword = decryptData(row.password, row.encryption_iv, row.auth_tag);
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
                encryption_iv BLOB NOT NULL,
                auth_tag BLOB NOT NULL
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
        iv: iv,
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

        const { encryptedData: usernameEncryptedData, iv: usernameIv, authTag: usernameAuthTag } = encryptData(username);
        const { encryptedData: passwordEncryptedData, iv: passwordIv, authTag: passwordAuthTag } = encryptData(hashedPassword);
        const { encryptedData: saltEncryptedData, iv: saltIv, authTag: saltAuthTag } = encryptData(salt);

        db.run(`INSERT INTO users (username, password, salt, password_version, encryption_iv, auth_tag) VALUES (?, ?, ?, ?, ?, ?)`, [usernameEncryptedData, passwordEncryptedData, saltEncryptedData, PBKDF2_ITERATIONS, usernameIv, usernameAuthTag], function(err) {
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
        const { encryptedData: usernameEncryptedData, iv: usernameIv, authTag: usernameAuthTag } = encryptData(username);

        db.get(`SELECT id, username, password, salt, password_version, encryption_iv, auth_tag FROM users WHERE username = ?`, [usernameEncryptedData], async (err, row) => {
            if (err) {
                console.error(err.message);
                return callback(err);
            }
            if (!row) {
                return callback(null, false);
            }

            try {
                const decryptedUsername = decryptData(row.username, row.encryption_iv, row.auth_tag);
                if (!decryptedUsername) {
                    return callback(new Error("Username decryption failed"));
                }

                if (decryptedUsername !== username) {
                  return callback(null, false);
                }

                const decryptedSalt = decryptData(row.salt, row.encryption_iv, row.auth_tag);
                if (!decryptedSalt) {
                    return callback(new Error("Salt decryption failed"));
                }

                const decryptedPassword = decryptData(row.password, row.encryption_iv, row.auth_tag);
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