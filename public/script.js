document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');
    const encryptionKey = generateEncryptionKey(); // Generate a key
    const keyDisplay = document.getElementById('keyDisplay'); // Key

    // Display the encryption key (for demonstration purposes only!)
    keyDisplay.textContent = 'Encryption Key (Demo): ' + encryptionKey;

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;

        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            // Encrypt the URL
            const encryptedUrl = await encryptURL(url, encryptionKey);

            // Call the proxy endpoint with the encrypted URL
            const response = await fetch('/api/proxy?url=' + encodeURIComponent(encryptedUrl));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            // Decrypt the data
            const decryptedData = await decryptData(data, encryptionKey);

            contentDiv.innerHTML = decryptedData; // Display content as HTML
        } catch (error) {
            console.error('Error fetching content:', error);
            contentDiv.textContent = 'An error occurred while fetching the content.';
        }
    });

    // Encryption function using AES
    async function encryptURL(url, key) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(url);
        const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(key),
            "AES-GCM",
            false,
            ["encrypt"]
        );
        const cipher = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            cryptoKey,
            encoded
        );

        const ivString = String.fromCharCode(...iv);
        const cipherString = String.fromCharCode(...new Uint8Array(cipher));
        const combined = btoa(ivString + cipherString);
        return combined;
    }

    // Decryption function using AES
    async function decryptData(data, key) {
        try {
            const decoded = atob(data);
            const iv = decoded.substring(0, 12);
            const cipherText = decoded.substring(12);

            const ivArray = new Uint8Array(iv.split('').map(char => char.charCodeAt(0)));
            const cipherArray = new Uint8Array(cipherText.split('').map(char => char.charCodeAt(0)));

            const cryptoKey = await window.crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(key),
                "AES-GCM",
                false,
                ["decrypt"]
            );

            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: ivArray
                },
                cryptoKey,
                cipherArray
            );
            const decodedText = new TextDecoder().decode(decrypted);
            return decodedText;
        } catch (error) {
            console.error("Decryption error:", error);
            return "Error: Could not decrypt data.";
        }
    }

    // Generate a simple encryption key (for demonstration purposes only!)
    function generateEncryptionKey() {
        return 'SecretPassphrase'; // Replace with a more secure method in production
    }
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #000;
            color: #fff;
            margin: 0;
            padding: 0;
            overflow: hidden; /* Hide scrollbars */
        }

        #particles-js {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 0;
        }

        .container {
            position: relative;
            z-index: 1;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        h1 {
            text-align: center;
            color: #00bcd4;
        }

        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: none;
            border-radius: 5px;
            background-color: #333;
            color: #fff;
        }

        button {
            display: block;
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: none;
            border-radius: 5px;
            background-color: #00bcd4;
            color: #fff;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #008ba7;
        }

        #content {
            margin-top: 20px;
            padding: 15px;
            background-color: #222;
            border-radius: 5px;
            overflow-wrap: break-word;
        }
        #keyDisplay {
            text-align: center;
            margin-top: 10px;
            color: #777; /* A subtle grey color */
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <input type="text" id="urlInput" placeholder="Enter URL">
        <button id="proxyButton">Access via Proxy</button>
        <div id="keyDisplay"></div>
        <div id="content"></div>
    </div>

    <script src="particles.js"></script>
    <script src="script.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles-config.json', function() {
            console.log('particles.js loaded - callback');
        });
    </script>
</body>
</html>
edit filepath: public/style.css
content: /* Reset some default styles */
body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}

/* Body styles */
body {
    font-family: 'Arial', sans-serif;
    background-color: #000; /* Dark background */
    color: #fff; /* Light text */
    overflow: hidden; /* Prevent scrollbars, the particles will cover the whole area */
}

/* Particles.js container */
#particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1; /* Behind all content */
}

/* Main container */
.container {
    position: relative;
    z-index: 1; /* Above particles */
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: rgba(30, 30, 30, 0.8); /* Darker, translucent background */
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 188, 212, 0.3); /* Cyan shadow */
}

/* Title */
h1 {
    text-align: center;
    color: #00bcd4; /* Cyan color */
    text-shadow: 0 0 10px rgba(0, 188, 212, 0.8); /* Glowing text */
}

/* Input field */
input[type="text"] {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: none;
    border-radius: 5px;
    background-color: #444; /* Darker input background */
    color: #eee; /* Lighter input text */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5) inset; /* Inset shadow */
}

/* Button */
button {
    display: block;
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: none;
    border-radius: 5px;
    background-color: #00bcd4; /* Cyan button color */
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 188, 212, 0.5); /* Cyan shadow */
}

button:hover {
    background-color: #008ba7; /* Darker cyan on hover */
    box-shadow: 0 0 15px rgba(0, 188, 212, 0.7); /* Stronger shadow on hover */
}

/* Content area */
#content {
    margin-top: 20px;
    padding: 15px;
    background-color: #333; /* Darker content background */
    border-radius: 5px;
    overflow-wrap: break-word;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Shadow for the content area */
}
edit filepath: api/proxy.js
content: const https = require('https');
const http = require('http');
const zlib = require('zlib');
const URL = require('url').URL;

module.exports = async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const parsedUrl = new URL(targetUrl);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: {
                'User-Agent': req.headers['user-agent'] || 'EncryptedProxy',
                'Accept-Encoding': 'gzip, deflate, br', // Accept compressed content
            },
        };

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, (proxyRes) => {
            // Set response headers
            for (const header in proxyRes.headers) {
                res.setHeader(header, proxyRes.headers[header]);
            }
            res.setHeader('x-proxy-by', 'EncryptedProxy');

            // Handle compressed responses
            let encoding = proxyRes.headers['content-encoding'];
            let stream = proxyRes;

            if (encoding === 'gzip') {
                stream = zlib.createGunzip();
                proxyRes.pipe(stream);
            } else if (encoding === 'deflate') {
                stream = zlib.createInflate();
                proxyRes.pipe(stream);
            }

            // Pipe the response to the client
            stream.pipe(res);

            // Handle errors during streaming
            stream.on('error', (err) => {
                console.error('Streaming error:', err);
                res.status(500).send('Error streaming content');
            });
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy request error:', err);
            res.status(500).send('Proxy request failed');
        });

        proxyReq.end();

    } catch (error) {
        console.error('URL parsing error:', error);
        res.status(400).send('Invalid URL');
    }
};