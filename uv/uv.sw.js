self.importScripts('./uv.bundle.js', './uv.config.js');

const sw = new UVServiceWorker();

const encryptionEnabledDomains = ['example.com'];
const encryptionKeyName = 'encryptionKey';

const generateEncryptionKey = async () => {
    try {
        const key = await crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        const exportedKey = await crypto.subtle.exportKey("jwk", key);
        localStorage.setItem(encryptionKeyName, JSON.stringify(exportedKey));
        return exportedKey;
    } catch (error) {
        console.error('Key generation failed:', error);
        throw error;
    }
};

const getEncryptionKey = async () => {
    const storedKey = localStorage.getItem(encryptionKeyName);
    if (storedKey) {
        try {
            return JSON.parse(storedKey);
        } catch (error) {
            console.error("Error parsing stored key, regenerating:", error);
            localStorage.removeItem(encryptionKeyName);
            return await generateEncryptionKey();
        }
    } else {
        return await generateEncryptionKey();
    }
};

const encrypt = async (data, key) => {
    try {
        const importedKey = await crypto.subtle.importKey(
            "jwk",
            key,
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(data);
        const ciphertext = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
                tagLength: 128,
            },
            importedKey,
            encoded
        );
        return {
            ciphertext: Array.from(new Uint8Array(ciphertext)),
            iv: Array.from(iv),
        };
    } catch (error) {
        console.error('Encryption failed:', error);
        throw error;
    }
};

const decrypt = async (data, key, iv) => {
    try {
        const importedKey = await crypto.subtle.importKey(
            "jwk",
            key,
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        const ciphertext = new Uint8Array(data);
        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: new Uint8Array(iv),
                tagLength: 128,
            },
            importedKey,
            ciphertext
        );
        const decoded = new TextDecoder().decode(decrypted);
        return decoded;
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
};

const shouldEncrypt = (url) => {
    const hostname = new URL(url).hostname;
    return encryptionEnabledDomains.includes(hostname);
};

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (shouldEncrypt(event.request.url) && url.pathname !== '/encryption-status') {
        console.log(`Encrypting request to ${url.hostname}`);

        const handleEncryptedRequest = async () => {
            try {
                const encryptionKey = await getEncryptionKey();
                const request = await fetch(event.request.clone());

                if (!request.ok) {
                    throw new Error(`HTTP error! status: ${request.status}`);
                }

                let data = await request.text();
                const encryptedData = await encrypt(data, encryptionKey);

                const encryptedResponse = new Response(JSON.stringify(encryptedData), {
                    headers: { 'Content-Type': 'application/json', 'X-Encrypted': 'true' }
                });
                return encryptedResponse;
            } catch (error) {
                console.error('Request or encryption error:', error);
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', 'X-Encrypted': 'true' }
                });
            }
        };

        const handleDecryptedResponse = async () => {
            try {
                const encryptionKey = await getEncryptionKey();
                const response = await fetch(event.request.clone());
                if (!response.ok) {
                   return response;
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    return response;
                }

                let data = await response.json();
                if (!data.ciphertext || !data.iv) {
                    return new Response("Invalid encrypted format", { status: 400 });
                }
                const decryptedData = await decrypt(data.ciphertext, encryptionKey, data.iv);
                return new Response(decryptedData, {
                    headers: { 'Content-Type': 'text/html' }
                });
            } catch (error) {
                console.error('Decryption error:', error);
                return new Response('Decryption failed', { status: 500 });
            }
        };
        
        event.respondWith(handleDecryptedResponse());

    } else if (url.pathname === '/encryption-status') {
        event.respondWith(new Response(JSON.stringify({ encryptionEnabled: shouldEncrypt(url) }), {
            headers: { 'Content-Type': 'application/json' }
        }));
    }
    
    else {
        event.respondWith(sw.fetch(event));
    }
});
edit filepath: public/script.js
content: document.addEventListener('DOMContentLoaded', function() {
    const encryptionStatusElement = document.getElementById('encryption-status');

    async function checkEncryptionStatus() {
        try {
            const response = await fetch('/encryption-status');
            const data = await response.json();

            if (data.encryptionEnabled) {
                encryptionStatusElement.textContent = 'Encryption is enabled for this domain.';
                encryptionStatusElement.style.color = 'green';
            } else {
                encryptionStatusElement.textContent = 'Encryption is not enabled for this domain.';
                encryptionStatusElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Failed to fetch encryption status:', error);
            encryptionStatusElement.textContent = 'Failed to determine encryption status.';
            encryptionStatusElement.style.color = 'gray';
        }
    }

    checkEncryptionStatus();
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <div id="particles-js"></div>
    <h1>Secure Web Access</h1>
    <p>Enter the website URL to access securely:</p>
    <input type="text" id="url-input" placeholder="https://www.example.com">
    <button id="access-button">Access Securely</button>
    <p id="encryption-status"></p>

    <script src="particles.js"></script>
    <script src="script.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles.json', function() {
            console.log('particles.json loaded - Encryption Theme Engaged');
        });
    </script>
</body>
</html>
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    text-align: center;
    overflow: hidden; /* Hide scrollbars */
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
}

h1 {
    margin-top: 50px;
    color: #00ff00; /* Encryption green */
    text-shadow: 0 0 10px #00ff00;
}

p {
    font-size: 18px;
    margin-bottom: 20px;
}

input[type="text"] {
    padding: 10px;
    width: 60%;
    margin-bottom: 20px;
    border: 2px solid #00ff00;
    background-color: #222;
    color: #fff;
    border-radius: 5px;
}

button {
    padding: 12px 24px;
    background-color: #00ff00;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #00cc00;
}

#encryption-status {
    margin-top: 20px;
    font-weight: bold;
}