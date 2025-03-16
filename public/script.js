document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;
        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            // Using a more descriptive endpoint for clarity
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            contentDiv.textContent = data;
        } catch (error) {
            console.error('Error fetching content:', error);
            contentDiv.textContent = `Error fetching content: ${error.message}`;
        }
    });
});
edit filepath: api/proxy.js
content: const https = require('https');
const http = require('http');
const url = require('url');

module.exports = (req, res) => {
  const targetUrl = req.url.substring(req.url.indexOf('=') + 1);

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Please provide a URL parameter.');
    return;
  }

  try {
    const parsedUrl = new url.URL(targetUrl);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'EncryptedProxy/1.0', // Add a user-agent
      },
    };

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const proxyReq = protocol.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Proxy request failed: ${err.message}`);
    });

    proxyReq.end();

  } catch (error) {
    console.error('URL parsing error:', error);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(`Invalid URL: ${error.message}`);
  }
};
edit filepath: .gitattributes
content: * text=auto eol=lf
edit filepath: api/encryption.js
content: const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Use a strong encryption algorithm
const key = crypto.randomBytes(32); // Generate a secure key (store securely in production)
const iv = crypto.randomBytes(16); // Generate a secure initialization vector

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null; // Or throw the error, depending on your error handling strategy
    }
}

module.exports = { encrypt, decrypt };