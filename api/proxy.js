const https = require('https');
const http = require('http');
const crypto = require('crypto');
const url = require('url');
const zlib = require('zlib');
const stream = require('stream');

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
const NON_ENCRYPTED_HEADERS = ['host', 'x-target-url', 'content-length', 'content-encoding', 'transfer-encoding', 'connection', 'proxy-connection', 'keep-alive', 'upgrade', 'date', 'content-type'];
const ENCRYPT_HEADER_PREFIX = 'enc_';

// Store derived keys in a cache to avoid repeated derivation
const keyCache = new Map();

// Rate Limiting - Added Simple Rate Limiter
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT = 100; // 100 requests per minute

// Define a nonce cache to prevent replay attacks.
const nonceCache = new Set();
const NONCE_CACHE_SIZE = 1000;

// Define a separate nonce cache for stream encryption
const streamNonceCache = new Set();
const STREAM_NONCE_CACHE_SIZE = 1000;

const REPLAY_PROTECTION_WINDOW = 60000; // 1 minute

// Function to derive a symmetric key using PBKDF2
function deriveKey(password, salt) {
    const cacheKey = `${password}-${salt}`;
    if (keyCache.has(cacheKey)) {
        return keyCache.get(cacheKey);
    }

    try {
        const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, DIGEST); // 32 bytes for AES-256
        keyCache.set(cacheKey, derivedKey);
        return derivedKey;
    } catch (error) {
        console.error("Key derivation error:", error);
        return null;
    }
}

function encrypt(text, key, iv) {
    if (!text) return text;
    try {
        const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
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

        const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

// Function to encrypt/decrypt headers
function transformHeaders(headers, encryptFlag, encryptionKey, iv) {
    const transformedHeaders = {};
    for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
            if (key === 'transfer-encoding' && headers[key] === 'chunked') {
                continue; // Skip transfer-encoding: chunked
            }

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
                      if (SENSITIVE_HEADERS.includes(lowerKey)) {
                        transformedKey = ENCRYPT_HEADER_PREFIX + key;
                      }
                      transformedValue = encrypt(value, encryptionKey, iv);
                       if (transformedValue === null) {
                          console.warn(`Skipping header value for ${key} due to encryption failure.`);
                          continue;
                        }
                    } else {
                      if (key.startsWith(ENCRYPT_HEADER_PREFIX)) {
                         transformedKey = key.slice(ENCRYPT_HEADER_PREFIX.length);
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

                } catch (err) {
                    console.error(`Header transformation error for key ${key}:`, err);
                    transformedHeaders[key] = headers[key];
                    continue; // Skip to the next header
                }
            } else {
              transformedHeaders[key] = headers[key];
            }
            transformedHeaders[transformedKey] = transformedValue;
        }
    }
    return transformedHeaders;
}

function createSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function safeHeaderValue(value) {
    if (typeof value !== 'string') {
        return String(value);
    }

    // Prevent header injection attacks
    return value.replace(/[\r\n]+/g, '');
}

function maybeDecompress(proxyRes) {
  let encoding = proxyRes.headers['content-encoding'];
  let raw = proxyRes;

  if (encoding == 'gzip' || encoding == 'deflate') {
      let gunzip = zlib.createUnzip();
      raw = proxyRes.pipe(gunzip);
  } else if (encoding == 'br') {
      let brotliDecompress = zlib.createBrotliDecompress();
      raw = proxyRes.pipe(brotliDecompress);
  }

  return raw;
}

function encryptStream(key, iv) {
  try {
    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    return cipher;
  } catch (error) {
    console.error("Stream encryption error:", error);
    return null;
  }
}

function decryptStream(key, iv) {
    try {
        const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        return decipher;
    } catch (error) {
        console.error("Stream decryption error:", error);
        return null;
    }
}

async function handleRequestBody(req, encryptionKey, reqIv) {
    return new Promise((resolve, reject) => {
        if (req.method === 'GET' || req.method === 'HEAD') {
            resolve(Buffer.alloc(0)); // Resolve with empty buffer for GET/HEAD
            return;
        }

        const requestCipher = encryptStream(encryptionKey, reqIv);

        if (!requestCipher) {
            reject(new Error('Failed to create request cipher.'));
            return;
        }

        const encryptedChunks = [];
        req.on('data', chunk => {
                encryptedChunks.push(requestCipher.update(chunk));
            })
            .on('end', () => {
                try {
                    encryptedChunks.push(requestCipher.final());
                    const encryptedBody = Buffer.concat(encryptedChunks);
                    resolve(encryptedBody);
                } catch (err) {
                    console.error("Request body finalization error:", err);
                    reject(err);
                }
            })
            .on('error', err => {
                console.error("Request body encryption error:", err);
                reject(err);
            });

        req.on('aborted', () => {
          reject(new Error('Request aborted.'));
        });

        // Consume the request body to prevent issues with subsequent handlers
        req.pipe(new stream.PassThrough());
    });
}

function earlyReject(res, statusCode, message) {
  console.warn(`Early rejection: ${statusCode} - ${message}`);
    if (!res.headersSent) {
        res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
        res.end(message);
    } else {
        console.error(`Cannot send ${statusCode} - ${message} because headers are already sent.`);
        res.end();
    }
}

function rateLimit(req, res) {
    const ip = req.ip || req.socket.remoteAddress; // Get client IP

    const now = Date.now();
    const requests = requestCounts.get(ip) || [];

    // Clean up old requests
    while (requests.length > 0 && requests[0] <= now - RATE_LIMIT_WINDOW) {
        requests.shift();
    }

    if (requests.length >= RATE_LIMIT) {
        earlyReject(res, 429, 'Too many requests');
        return true; // Indicate rate limit exceeded
    }

    requests.push(now);
    requestCounts.set(ip, requests);
    return false; // Indicate rate limit not exceeded
}

function validateNonce(nonce, timestamp) {
    if (!nonce || !timestamp) {
        return false;
    }

    const now = Date.now();
    const timeDiff = now - timestamp;

    if (timeDiff > REPLAY_PROTECTION_WINDOW || timeDiff < -REPLAY_PROTECTION_WINDOW) {
        console.warn("Replay attack: timestamp out of range");
        return false; // Timestamp out of range.
    }

    const combinedNonce = `${nonce}-${timestamp}`;

    if (nonceCache.has(combinedNonce)) {
        console.warn("Replay attack: nonce already used");
        return false; // Nonce already used, possible replay attack
    }

    nonceCache.add(combinedNonce);
    if (nonceCache.size > NONCE_CACHE_SIZE) {
        // Remove the oldest nonce to prevent unbounded growth
        const oldestNonce = nonceCache.values().next().value;
        nonceCache.delete(oldestNonce);
    }

    return true;
}

function validateStreamNonce(nonce, timestamp) {
  if (!nonce || !timestamp) {
      return false;
  }

  const now = Date.now();
  const timeDiff = now - timestamp;

  if (timeDiff > REPLAY_PROTECTION_WINDOW || timeDiff < -REPLAY_PROTECTION_WINDOW) {
      console.warn("Stream Replay attack: timestamp out of range");
      return false; // Timestamp out of range.
  }

  const combinedNonce = `${nonce}-${timestamp}`;

  if (streamNonceCache.has(combinedNonce)) {
      console.warn("Stream Replay attack: nonce already used");
      return false; // Nonce already used, possible replay attack
  }

  streamNonceCache.add(combinedNonce);
  if (streamNonceCache.size > STREAM_NONCE_CACHE_SIZE) {
      // Remove the oldest nonce to prevent unbounded growth
      const oldestNonce = streamNonceCache.values().next().value;
      streamNonceCache.delete(oldestNonce);
  }

  return true;
}

// Function to handle the proxy request
async function proxyRequest(req, res) {

    // Rate Limit Check
    if (rateLimit(req, res)) {
        return;
    }

    const targetUrl = req.headers['x-target-url'];
    if (!targetUrl) {
        return earlyReject(res, 400, 'Target URL is missing.');
    }

    // Check for replay attack
    const nonce = req.headers['x-nonce'];
    const timestamp = req.headers['x-timestamp'];
    if (!validateNonce(nonce, timestamp)) {
        return earlyReject(res, 403, 'Invalid or missing nonce.');
    }

    try {
        const parsedUrl = new url.URL(targetUrl);
        const salt = createSalt();
        const encryptionKey = deriveKey(ENCRYPTION_KEY, salt);

        if (!encryptionKey) {
            return earlyReject(res, 500, 'Failed to derive encryption key.');
        }

        const iv = crypto.randomBytes(IV_LENGTH); // Generate IV for request encryption
        let reqHeaders = transformHeaders(req.headers, false, encryptionKey, iv); // Decrypt incoming headers, using salt
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: req.method,
            headers: transformHeaders(reqHeaders, true, encryptionKey, iv), // Encrypt outgoing headers
            rejectUnauthorized: false // Add this line.  Be careful using this in production without proper cert validation.
        };

        delete options.headers['x-target-url']; // Prevent loop
        delete options.headers['host']; // Ensure correct host
        delete options.headers['accept-encoding']; // Disable compression for proxy to handle it
        delete options.headers['x-nonce']; // Remove nonce
        delete options.headers['x-timestamp']; // Remove timestamp

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, (proxyRes) => {
            let raw = maybeDecompress(proxyRes);

            // Generate IV for response encryption - different IV each time.
            const resIv = crypto.randomBytes(IV_LENGTH);
            let resHeaders = transformHeaders(proxyRes.headers, true, encryptionKey, resIv); // Encrypt outgoing headers, using salt
            delete resHeaders['content-encoding'];
            delete resHeaders['content-length'];

             // Sanitize header values before sending them to the client
            for (const key in resHeaders) {
                if (resHeaders.hasOwnProperty(key)) {
                    resHeaders[key] = safeHeaderValue(resHeaders[key]);
                }
            }

            // Send the salt and algorithm to the client for decryption
            res.setHeader('x-encryption-salt', salt);
            res.setHeader('x-cipher-algorithm', CIPHER_ALGORITHM);
            res.setHeader('x-encryption-iv', resIv.toString('hex')); // Send IV
            res.setHeader('x-auth-tag-length', AUTH_TAG_LENGTH); // Send Auth Tag Length
            res.setHeader('x-content-encoding', 'encrypted'); //Inform client content is encrypted

            // Optional: Send PBKDF2 parameters to the client for key derivation if needed
            // res.setHeader('x-pbkdf2-iterations', ITERATIONS);
            // res.setHeader('x-pbkdf2-digest', DIGEST);

            res.writeHead(proxyRes.statusCode, resHeaders);

            // Encrypt the response body
            let encryptedStream = null; // Initialize to null
            try {

              const streamNonce = crypto.randomBytes(8).toString('hex');
              const streamTimestamp = Date.now();
              if (!validateStreamNonce(streamNonce, streamTimestamp)) {
                  return earlyReject(res, 403, 'Invalid or missing stream nonce.');
              }

              const responseCipher = encryptStream(encryptionKey, resIv);
              if(!responseCipher){
                return earlyReject(res, 500, 'Failed to create response cipher.');
              }

              encryptedStream = raw.pipe(responseCipher);

              encryptedStream.on('error', (streamErr) => {
                console.error("Response stream encryption error:", streamErr);
                if (!res.writableEnded) { // Check if response has already ended
                     return earlyReject(res, 500, 'Failed to encrypt response stream.');
                }
              });

              res.setHeader('x-stream-nonce', streamNonce);
              res.setHeader('x-stream-timestamp', streamTimestamp);
              res.setHeader('x-stream-auth-tag', responseCipher.getAuthTag().toString('hex'));
              encryptedStream.pipe(res);

            } catch (streamErr) {
                console.error("Response stream encryption error:", streamErr);
                if (!res.writableEnded) { // Check if response has already ended
                     return earlyReject(res, 500, 'Failed to encrypt response stream.');
                }
            } finally {
                // Ensure the stream is properly closed in case of errors
                if (encryptedStream && encryptedStream.readable) {
                    encryptedStream.on('close', () => {
                        // Clean up resources if needed.
                    });
                }
            }
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy request error:', err);
            if (!res.headersSent) {
              return earlyReject(res, 500, 'Proxy error.');
            } else {
              console.error("Headers already sent, cannot early reject.");
            }
        });

        req.on('aborted', () => {
          proxyReq.abort();
        });

         // Generate IV for request encryption - different IV each time.
        const reqIv = crypto.randomBytes(IV_LENGTH);
        options.headers['x-request-encryption-iv'] = reqIv.toString('hex');

        try {
            const encryptedRequestBody = await handleRequestBody(req, encryptionKey, reqIv);
            if (req.method !== 'GET' && req.method !== 'HEAD') {
                proxyReq.setHeader('Content-Length', encryptedRequestBody.length);
                proxyReq.write(encryptedRequestBody);
            }
            proxyReq.end();
        } catch (error) {
            console.error("Request body handling error:", error);
            return earlyReject(res, 500, 'Failed to process request body.');
        }

    } catch (error) {
        console.error("URL parsing or proxy error:", error);
        return earlyReject(res, 500, 'Internal server error.');
    }
}

module.exports = {
    proxyRequest,
    encrypt,
    decrypt,
};