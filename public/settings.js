const crypto = require('crypto');

// Function to generate a secure AES key
function generateAESKey() {
    return crypto.generateKeySync('aes', { length: 256 }).export().toString('hex');
}

// Function to generate a secure RSA key pair
function generateRSAKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // Standard for secure RSA
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
}

// Function to securely store a key (e.g., using environment variables or a secure vault)
function storeKey(keyName, keyValue) {
    // In a real-world application, use a secure storage mechanism like a vault
    // or encrypted file storage.
    process.env[keyName] = keyValue;
    console.log(`Key ${keyName} stored (insecurely for example purposes!)`);
}

// Function to retrieve a securely stored key
function retrieveKey(keyName) {
    // Retrieve from secure storage (e.g., environment variable, vault)
    const keyValue = process.env[keyName];
    if (!keyValue) {
        console.error(`Key ${keyName} not found!`);
        return null;
    }
    return keyValue;
}

module.exports = {
    generateAESKey,
    generateRSAKeyPair,
    storeKey,
    retrieveKey
};