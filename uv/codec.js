import { subtle, getRandomValues } from 'crypto';

async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    const key = await subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: enc.encode(salt),
            iterations: 10000,
            hash: "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}


export async function encode(str, key = null, salt = null) {
    try {
        const utf8Encode = new TextEncoder();
        const encoded = utf8Encode.encode(str);

        if (key && salt) {
            const iv = getRandomValues(new Uint8Array(12));
            const cryptoKey = await deriveKey(key, salt);
            const encrypted = await subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                cryptoKey,
                encoded
            );

            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encrypted), iv.length);

            return btoa(String.fromCharCode(...Array.from(combined)));

        }


        return btoa(String.fromCharCode(...Array.from(encoded)));
    } catch (e) {
        console.error("Encoding error:", e);
        return null;
    }
}

export async function decode(str, key = null, salt = null) {
    try {
        const binaryString = atob(str);
        let bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        if (key && salt) {
            const iv = bytes.slice(0, 12);
            const encrypted = bytes.slice(12);

            const cryptoKey = await deriveKey(key, salt);

            const decrypted = await subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                cryptoKey,
                encrypted
            );

            const utf8Decode = new TextDecoder();
            return utf8Decode.decode(decrypted);
        }


        const utf8Decode = new TextDecoder();
        return utf8Decode.decode(bytes);

    } catch (e) {
        console.error("Decoding error:", e);
        return null;
    }
}
edit filepath: api/security.js
content: export function addSecurityHeaders(res) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';");
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}
edit filepath: api/session.js
content: import { randomBytes } from 'crypto';

const sessions = {};

export function createSession() {
    const sessionId = randomBytes(16).toString('hex');
    sessions[sessionId] = {
        createdAt: Date.now()
    };
    return sessionId;
}

export function getSession(sessionId) {
    return sessions[sessionId];
}

export function destroySession(sessionId) {
    delete sessions[sessionId];
}

export function attachSession(req, res) {
    let sessionId = req.cookies.sessionId;

    if (!sessionId || !getSession(sessionId)) {
        sessionId = createSession();
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: true, // Ensure this is true for HTTPS
            sameSite: 'strict'
        });
    }

    req.session = getSession(sessionId);
}
edit filepath: public/script.js
content: function sanitizeInput(input) {
    let tempDiv = document.createElement("div");
    tempDiv.textContent = input;
    return tempDiv.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.getElementById('url');
    const proxyUrl = localStorage.getItem('proxyUrl') || '/';

    urlForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let url = sanitizeInput(urlInput.value);
        if (url) {
            window.location.href = proxyUrl + encodeURIComponent(url);
        }
    });
});
edit filepath: logs/logs.js
content: function sanitizeLog(log) {
    let tempDiv = document.createElement("div");
    tempDiv.textContent = log;
    return tempDiv.innerHTML;
}

function displayLogs() {
    fetch('/api/logs')
        .then(response => response.json())
        .then(logs => {
            const logsContainer = document.getElementById('logs');
            logsContainer.innerHTML = '';
            logs.forEach(log => {
                const logElement = document.createElement('div');
                logElement.innerHTML = sanitizeLog(log);
                logsContainer.appendChild(logElement);
            });
        })
        .catch(error => console.error('Error fetching logs:', error));
}

document.addEventListener('DOMContentLoaded', displayLogs);