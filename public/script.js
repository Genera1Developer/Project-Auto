document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;
        if (url) {
            try {
                // Basic URL validation (improve this with a more robust check)
                new URL(url);

                // Encrypt the URL using AES before sending it to the proxy server
                const encryptedUrl = await encryptURL(url);

                // Fetch content from the proxy server
                const response = await fetch('/api/proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: encryptedUrl }) // Send the encrypted URL
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Decrypt the content received from the proxy server
                const decryptedContent = await decryptContent(data.content);

                contentDiv.innerHTML = decryptedContent;

            } catch (error) {
                console.error('Error fetching content:', error);
                contentDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            }
        } else {
            contentDiv.innerHTML = '<p class="error">Please enter a URL.</p>';
        }
    });

    async function encryptURL(url) {
        // Use a more secure method for key generation and storage in production
        const key = await generateKey();
        const iv = window.crypto.getRandomValues(new Uint8Array(16));
        const encoded = new TextEncoder().encode(url);
        const cipher = await window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv: iv
            },
            key,
            encoded
        );

        const buffer = new Uint8Array(cipher);
        const ivString = Array.from(iv).map(b => String.fromCharCode(b)).join("");
        const cipherString = Array.from(buffer).map(b => String.fromCharCode(b)).join("");
        const combinedString = ivString + cipherString;
        return btoa(combinedString); // Base64 encode the combined IV and ciphertext
    }

    async function decryptContent(base64Ciphertext) {
      try {
        const decodedCombinedString = atob(base64Ciphertext);
        const ivString = decodedCombinedString.substring(0, 16);
        const cipherString = decodedCombinedString.substring(16);

        const iv = new Uint8Array(Array.from(ivString).map(c => c.charCodeAt(0)));
        const cipher = new Uint8Array(Array.from(cipherString).map(c => c.charCodeAt(0)));

        const key = await getKey();

        const decrypted = await window.crypto.subtle.decrypt(
          {
            name: "AES-CBC",
            iv: iv,
          },
          key,
          cipher
        );

        const decoded = new TextDecoder().decode(decrypted);
        return decoded;

      } catch (error) {
          console.error("Decryption error:", error);
          return `<p class="error">Decryption Error: ${error.message}</p>`;
      }
    }

    async function generateKey() {
        return await window.crypto.subtle.generateKey(
            {
                name: "AES-CBC",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
    }

    async function getKey() {
        // In a real application, store the key securely (e.g., using IndexedDB or a server-side key management system).
        // For this example, we generate a new key each time, which is NOT secure.
        return await generateKey();
    }
});
edit filepath: api/proxy.js
content: const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/proxy', async (req, res) => {
    try {
        const encryptedUrl = req.body.url;

        // Decrypt the URL using AES before making the request
        const decryptedUrl = await decryptURL(encryptedUrl);

        // Determine if the URL is HTTP or HTTPS
        const protocol = decryptedUrl.startsWith('https') ? https : http;

        const proxyRequest = protocol.get(decryptedUrl, (proxyResponse) => {
            let data = '';

            proxyResponse.on('data', (chunk) => {
                data += chunk;
            });

            proxyResponse.on('end', async () => {
                // Encrypt the content before sending it back to the client
                const encryptedContent = await encryptContent(data);
                res.json({ content: encryptedContent });
            });

            proxyResponse.on('error', (err) => {
                console.error('Proxy response error:', err);
                res.status(500).json({ error: 'Proxy response error' });
            });
        }).on('error', (err) => {
            console.error('Proxy request error:', err);
            res.status(500).json({ error: 'Proxy request error' });
        });

        proxyRequest.end();

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

async function encryptContent(content) {
    const key = await generateKey();
    const iv =  window.crypto.getRandomValues(new Uint8Array(16));

    const encoded = new TextEncoder().encode(content);
    const cipher = await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: iv
        },
        key,
        encoded
    );

    const buffer = new Uint8Array(cipher);
    const ivString = Array.from(iv).map(b => String.fromCharCode(b)).join("");
    const cipherString = Array.from(buffer).map(b => String.fromCharCode(b)).join("");
    const combinedString = ivString + cipherString;
    return btoa(combinedString); // Base64 encode the combined IV and ciphertext
}

async function decryptURL(base64Ciphertext) {
    try {
        const decodedCombinedString = atob(base64Ciphertext);
        const ivString = decodedCombinedString.substring(0, 16);
        const cipherString = decodedCombinedString.substring(16);

        const iv = new Uint8Array(Array.from(ivString).map(c => c.charCodeAt(0)));
        const cipher = new Uint8Array(Array.from(cipherString).map(c => c.charCodeAt(0)));

        const key = await getKey();

        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv: iv,
            },
            key,
            cipher
        );

        const decoded = new TextDecoder().decode(decrypted);
        return decoded;

    } catch (error) {
        console.error("Decryption error:", error);
        throw new Error("Decryption error");
    }
}

async function generateKey() {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function getKey() {
    // In a real application, store the key securely (e.g., using IndexedDB or a server-side key management system).
    return await generateKey();
}

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <input type="text" id="urlInput" placeholder="Enter URL">
        <button id="proxyButton">Go</button>
        <div id="content"></div>
    </div>
    <script src="particles.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles.json', function() {
          console.log('callback - particles.js config loaded');
        });
    </script>
    <script src="script.js"></script>
</body>
</html>