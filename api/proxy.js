const https = require('https');
const http = require('http');
const crypto = require('crypto');
const url = require('url');
const zlib = require('zlib');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Generate a random key if not provided
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16; //For GCM

//Consider using environment variables for cipher algorithm
const CIPHER_ALGORITHM = process.env.CIPHER_ALGORITHM || 'aes-256-gcm';
const KEY_DERIVATION_SALT = process.env.KEY_DERIVATION_SALT || crypto.randomBytes(16).toString('hex');
const ITERATIONS = parseInt(process.env.PBKDF2_ITERATIONS) || 10000; // Adjust based on security needs and performance
const DIGEST = process.env.PBKDF2_DIGEST || 'sha512';

const SENSITIVE_HEADERS = ['authorization', 'cookie', 'proxy-authorization'];
const MAX_ENCRYPTED_HEADER_LENGTH = 2048; // Limit header size to prevent DoS
const NON_ENCRYPTED_HEADERS = ['host', 'x-target-url', 'content-length', 'content-encoding', 'transfer-encoding', 'connection', 'proxy-connection', 'keep-alive', 'upgrade', 'date'];
const ENCRYPT_HEADER_PREFIX = 'enc_';

function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, DIGEST); // 32 bytes for AES-256
}

function encrypt(text, key) {
    if (!text) return text;
    try {
        let iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        const ciphertext = Buffer.concat([iv, authTag, encrypted]);

         // Limit the size of encrypted data to prevent DoS
        if (ciphertext.length > MAX_ENCRYPTED_HEADER_LENGTH) {
            throw new Error('Encrypted text exceeds maximum allowed length.');
        }

        return ciphertext.toString('hex');
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
}

function decrypt(text, key) {
    if (!text) return text;
    try {
        const buffer = Buffer.from(text, 'hex');

        if (buffer.length > MAX_ENCRYPTED_HEADER_LENGTH) {
            throw new Error('Encrypted text exceeds maximum allowed length.');
        }

        const iv = buffer.slice(0, IV_LENGTH);
        const authTag = buffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        const encrypted = buffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

// Function to encrypt/decrypt headers
function transformHeaders(headers, encryptFlag, encryptionKey) {
    const transformedHeaders = {};
    for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
            let lowerKey = key.toLowerCase();
            let value = String(headers[key]); // Ensure value is a string

            if (NON_ENCRYPTED_HEADERS.includes(lowerKey)) {
                transformedHeaders[key] = headers[key];
                continue;
            }

            const useEncryption = SENSITIVE_HEADERS.includes(lowerKey) || encryptFlag;

            let transformedKey = key;
            let transformedValue = value;

            if(useEncryption) {
                try {
                    if(encryptFlag){
                      transformedKey = encrypt(key, encryptionKey);
                      if (transformedKey) {
                        transformedKey = ENCRYPT_HEADER_PREFIX + transformedKey;
                      }
                      transformedValue = encrypt(value, encryptionKey);
                    } else {
                      if (key.startsWith(ENCRYPT_HEADER_PREFIX)) {
                        const encryptedKey = key.slice(ENCRYPT_HEADER_PREFIX.length);
                         if (encryptedKey !== null && encryptedKey !== undefined && typeof encryptedKey === 'string') {
                            transformedKey = decrypt(encryptedKey, encryptionKey);
                            if (transformedKey === null) {
                              console.warn(`Skipping header ${key} due to key decryption failure.`);
                              continue;
                            }
                          } else {
                            console.warn(`Skipping header ${key} due to invalid key type.`);
                            continue;
                          }

                          if (value !== null && value !== undefined && typeof value === 'string') {
                            transformedValue = decrypt(value, encryptionKey);
                            if (transformedValue === null) {
                              console.warn(`Skipping header value for ${key} due to decryption failure.`);
                              continue;
                            }
                          } else {
                            console.warn(`Skipping header value for ${key} due to invalid value type.`);
                            continue;
                          }

                      } else {
                        transformedHeaders[key] = headers[key];
                        continue;
                      }
                    }

                    //If transformation results in null, skip the header.
                    if(transformedKey === null || transformedValue === null) {
                        console.warn(`Skipping header ${key} due to transformation failure.`);
                        continue;
                    }

                } catch (err) {
                    console.error(`Header transformation error for key ${key}:`, err);
                    //If encryption or decryption fails, keep the original value
                    transformedHeaders[key] = headers[key];
                    continue; // Skip to the next header
                }
            }

            transformedHeaders[transformedKey] = transformedValue;
        }
    }
    return transformedHeaders;
}

function proxyRequest(req, res) {
    const targetUrl = req.headers['x-target-url'];
    if (!targetUrl) {
        return res.status(400).send('Target URL is missing.');
    }

    try {
        const parsedUrl = new url.URL(targetUrl);
        const salt = crypto.randomBytes(16);
        const encryptionKey = deriveKey(ENCRYPTION_KEY, salt.toString('hex'));

        let reqHeaders = transformHeaders(req.headers, false, encryptionKey); // Decrypt incoming headers, using salt
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: req.method,
            headers: reqHeaders,
            rejectUnauthorized: false // Add this line.  Be careful using this in production without proper cert validation.
        };

        delete options.headers['x-target-url']; // Prevent loop
        delete options.headers['host']; // Ensure correct host
        delete options.headers['accept-encoding']; // Disable compression for proxy to handle it

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, (proxyRes) => {
            // Handle compressed responses
            let encoding = proxyRes.headers['content-encoding'];
            let raw = proxyRes;

            if (encoding == 'gzip' || encoding == 'deflate') {
                let gunzip = zlib.createUnzip();
                proxyRes.pipe(gunzip);
                raw = gunzip;
            } else if (encoding == 'br') {
                let brotliDecompress = zlib.createBrotliDecompress();
                proxyRes.pipe(brotliDecompress);
                raw = brotliDecompress;
            }

            let resHeaders = transformHeaders(proxyRes.headers, true, encryptionKey); // Encrypt outgoing headers, using salt
            delete resHeaders['content-encoding'];

            // Send the salt to the client for decryption
            res.setHeader('x-encryption-salt', salt.toString('hex'));
            res.setHeader('x-cipher-algorithm', CIPHER_ALGORITHM);
            res.writeHead(proxyRes.statusCode, resHeaders);
            raw.pipe(res);
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy request error:', err);
            res.status(500).send('Proxy error');
        });

        req.pipe(proxyReq);
        req.on('error', (err) => {
            console.error("Request error:", err);
            proxyReq.destroy(err);
        });
    } catch (error) {
        console.error("URL parsing or proxy error:", error);
        res.status(500).send('Internal server error.');
    }
}

module.exports = {
    proxyRequest,
    encrypt,
    decrypt,
};