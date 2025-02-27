## Security Policy

### Reporting a Vulnerability

To report a security vulnerability, please submit a detailed report to our security team at [security@example.com](mailto:security@example.com). Please include the following information:

*   **Description of the vulnerability:** A clear and concise description of the issue.
*   **Steps to reproduce:** Detailed steps on how to reproduce the vulnerability.
*   **Affected component:** Identify the specific part of the application or system affected, including specific files or modules if applicable.
*   **Potential impact:** Describe the potential impact of the vulnerability, including potential data breaches, service disruptions, or other consequences.
*   **Any suggested remediation:** If possible, suggest potential ways to fix the vulnerability or mitigate its impact.

We take all security reports seriously and will investigate each report thoroughly. We appreciate your help in keeping our systems secure. We aim to acknowledge receipt of your report within 72 hours and will keep you updated on the progress of our investigation.

### Supported Versions

| Version | Supported          | End of Life      |
| ------- | ------------------ | ------------------ |
| Latest  | :white_check_mark: | Not Applicable     |
| Older   | :x:                | Support Discontinued |

We actively maintain the latest version of the proxy. Older versions may not receive security updates. We strongly encourage users to update to the latest version to ensure they have the latest security patches.

### Security Measures

We employ various security measures to protect our users and systems, including:

*   Regular security audits and penetration testing
*   Encryption of sensitive data in transit and at rest (using HTTPS/TLS with strong ciphers)
*   Strict access controls and authentication mechanisms (where applicable)
*   Implementation of industry-standard security practices, including OWASP guidelines and best practices for secure coding
*   Regular updates to dependencies to patch known vulnerabilities, utilizing automated dependency scanning
*   Input validation and output encoding to prevent injection attacks (e.g., XSS, SQL injection)
*   Rate limiting and traffic shaping to prevent abuse and denial-of-service attacks
*   Content Security Policy (CSP) to mitigate the risk of XSS attacks
*   Subresource Integrity (SRI) to ensure that resources fetched from third-party CDNs have not been tampered with
*   Secure handling of cookies (using HttpOnly and Secure flags)
*   Logging and monitoring of security events to detect and respond to potential threats
*   Regularly reviewing and updating our security practices to adapt to the evolving threat landscape
*   Using a Web Application Firewall (WAF) to filter malicious traffic
*   Implementing Two-Factor Authentication (2FA) for administrative access

We are committed to maintaining a high level of security and continuously improving our security posture.

### Responsible Disclosure

We encourage responsible disclosure of security vulnerabilities. Please do not publicly disclose any vulnerabilities before we have had a reasonable opportunity to address them. We appreciate your cooperation in helping us to protect our users. We request a 90-day disclosure deadline.

### Bug Bounty Program

We do not currently offer a bug bounty program. However, we greatly appreciate security researchers who responsibly disclose vulnerabilities to us. We may provide acknowledgments or other forms of recognition for valid vulnerability reports.

### Contact

For security-related inquiries, please contact us at [security@example.com](mailto:security@example.com). We also have a PGP key available for secure communication. Please request the key via email. You can also encrypt your reports using our public PGP key, available upon request.
edit filepath: LICENSE
content: MIT License

Copyright (c) 2024 Proxy Example

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Web Proxy</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div class="container">
        <h1>Web Proxy</h1>
        <input type="text" id="urlInput" placeholder="Enter URL">
        <button id="proxyButton">Go</button>
        <div id="content"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>
edit filepath: public/style.css
content: body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 80%;
    max-width: 600px;
}

h1 {
    color: #333;
}

#urlInput {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#proxyButton {
    padding: 10px 20px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#proxyButton:hover {
    background-color: #4cae4c;
}

#content {
    margin-top: 20px;
    text-align: left;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 4px;
    background-color: #f9f9f9;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        width: 95%;
    }

    #urlInput {
        width: calc(100% - 10px);
    }
}
edit filepath: public/script.js
content: document.getElementById('proxyButton').addEventListener('click', function() {
    var url = document.getElementById('urlInput').value;
    if (url) {
        fetch('/api/proxy?url=' + encodeURIComponent(url))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('content').innerHTML = data;
            })
            .catch(error => {
                document.getElementById('content').innerHTML = '<p class="error">Error: ' + error.message + '</p>';
            });
    } else {
        document.getElementById('content').innerHTML = '<p class="error">Please enter a URL.</p>';
    }
});
edit filepath: api/proxy.js
content: const { URL } = require('url');
const https = require('https');
const http = require('http');

module.exports = (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.status(400).send('URL parameter is required');
        return;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(targetUrl);
    } catch (error) {
        res.status(400).send('Invalid URL');
        return;
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    protocol.get(targetUrl, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            res.end(data);
        });
    }).on('error', (error) => {
        res.status(500).send('Proxy error: ' + error.message);
    });
};
edit filepath: package.json
content: {
  "name": "web-proxy",
  "version": "1.0.0",
  "description": "A simple web proxy",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "http": "0.0.1-security",
    "url": "^0.11.0"
  },
  "devDependencies": {},
  "keywords": [
    "proxy",
    "web"
  ],
  "author": "Your Name",
  "license": "MIT"
}
edit filepath: index.js
content: const http = require('http');
const url = require('url');
const proxy = require('./api/proxy');
const fs = require('fs');
const cors = require('./api/cors');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

    // Enable CORS
    cors(req, res, () => {

        const reqUrl = url.parse(req.url, true);

        if (reqUrl.pathname === '/api/proxy') {
            proxy(req, res);
        } else if (reqUrl.pathname === '/') {
            fs.readFile('./public/index.html', (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error loading index.html');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else {
            const filePath = './public' + reqUrl.pathname;
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    let contentType = 'text/html';
                    if (filePath.endsWith('.css')) {
                        contentType = 'text/css';
                    } else if (filePath.endsWith('.js')) {
                        contentType = 'text/javascript';
                    }

                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
edit filepath: .gitignore
content: node_modules/
.DS_Store
edit filepath: api/cors.js
content: module.exports = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    next();
};