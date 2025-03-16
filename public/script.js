document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');
    const encryptionKeyInput = document.getElementById('encryptionKey'); // Added key input
    const encryptionStatus = document.getElementById('encryptionStatus'); // Added status display

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;
        const encryptionKey = encryptionKeyInput.value; // Get key from input
        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            // Fetch content from proxy endpoint
            let response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.text();

            // Encrypt the data using the provided key
            if (encryptionKey) {
                const encryptedData = await encryptData(data, encryptionKey);
                contentDiv.textContent = encryptedData;
                encryptionStatus.textContent = "Content Encrypted";
            } else {
                contentDiv.textContent = data;
                encryptionStatus.textContent = "Content Unencrypted";
            }

        } catch (error) {
            console.error('Error fetching/encrypting content:', error);
            contentDiv.textContent = `Error: ${error.message}`;
            encryptionStatus.textContent = "Encryption Error";
        }
    });

    async function encryptData(data, key) {
        try {
            const response = await fetch('/api/encrypt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: data, key: key })
            });

            if (!response.ok) {
                throw new Error(`Encryption failed: ${response.status}`);
            }

            const result = await response.json();
            return result.encryptedData;
        } catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }
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
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <input type="text" id="urlInput" placeholder="Enter URL">
        <input type="text" id="encryptionKey" placeholder="Encryption Key (Optional)">
        <button id="proxyButton">Go</button>
        <div id="encryptionStatus"></div>
        <div id="content"></div>
    </div>
    <div id="particles-js"></div>
    <script src="particles.js"></script>
    <script src="script.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles.json', function() {
            console.log('particles.json loaded...');
        });
    </script>
</body>
</html>
edit filepath: api/encrypt.js
content: const crypto = require('crypto');

module.exports = (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { data, key } = JSON.parse(body);

            if (!data || !key) {
                return res.status(400).json({ error: 'Data and key are required' });
            }

            const algorithm = 'aes-256-cbc';
            const iv = crypto.randomBytes(16);

            const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            const encryptedData = iv.toString('hex') + ':' + encrypted.toString('hex');

            res.status(200).json({ encryptedData: encryptedData });

        } catch (error) {
            console.error("Encryption error:", error);
            res.status(500).json({ error: 'Encryption failed' });
        }
    });
};
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    overflow: hidden; /* Hide scrollbars */
}

.container {
    width: 80%;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    text-align: center;
    background-color: rgba(30, 30, 30, 0.8);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 1;
}

h1 {
    color: #00bcd4;
    margin-bottom: 20px;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: none;
    border-radius: 5px;
    background-color: #222;
    color: #fff;
}

button {
    padding: 10px 20px;
    background-color: #00bcd4;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #008ba7;
}

#content {
    margin-top: 20px;
    padding: 15px;
    background-color: #111;
    border-radius: 5px;
    text-align: left;
    word-wrap: break-word;
}

#encryptionStatus {
    margin-top: 10px;
    color: #00bcd4;
    font-weight: bold;
}

/* Particles.js styles */
#particles-js {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
}
edit filepath: