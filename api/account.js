const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const dbPath = './api/accounts.db'; // Explicit path
let db;

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
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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


function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
}

function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}


exports.createUser = (username, password, callback) => {
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    db.run(`INSERT INTO users (username, password, salt) VALUES (?, ?, ?)`, [username, hashedPassword, salt], function(err) {
        if (err) {
            console.error(err.message);
            return callback(err);
        }
        callback(null, { id: this.lastID, username: username });
    });
};


exports.verifyUser = (username, password, callback) => {
    db.get(`SELECT id, username, password, salt FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) {
            console.error(err.message);
            return callback(err);
        }
        if (!row) {
            return callback(null, false); // User not found
        }

        const hashedPassword = hashPassword(password, row.salt);
        if (hashedPassword === row.password) {
            callback(null, { id: row.id, username: row.username });
        } else {
            callback(null, false); // Incorrect password
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
content: