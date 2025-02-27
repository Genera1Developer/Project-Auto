const filterLists = [
    '/adblocker/filters/easylist.txt'
];

let blockingRules = [];
let observer = null;

async function loadFilterLists() {
    for (const list of filterLists) {
        try {
            const response = await fetch(list);
            if (!response.ok) {
                console.error('Failed to load filter list:', list, response.status);
                continue;
            }
            const text = await response.text();
            const rules = parseFilterList(text);
            blockingRules = blockingRules.concat(rules);
        } catch (error) {
            console.error('Error loading filter list:', list, error);
        }
    }
    console.log('Filter lists loaded:', blockingRules.length, 'rules');
    return blockingRules;
}

function parseFilterList(text) {
    const rules = [];
    const lines = text.split('\n');
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('||') && trimmedLine.endsWith('^')) {
            const domain = trimmedLine.slice(2, -1);
            rules.push(domain);
        } else if (trimmedLine.startsWith('!')) {
            continue;
        } else if (trimmedLine !== '') {
             rules.push(trimmedLine);
        }
    }
    return rules;
}

function blockAds() {
    if (observer) {
        observer.disconnect();
    }
  
    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    const src = node.src || node.href;
                    if (src && blockingRules.some(rule => src.includes(rule))) {
                        node.remove();
                        console.log(`Blocked ad from: ${src}`);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    console.log('Ad Blocking enabled');
}

function unblockAds() {
    if (observer) {
        observer.disconnect();
        observer = null;
        console.log('Ad Blocking disabled');
    }
}

async function initializeAdBlocking() {
    await loadFilterLists();
    blockAds();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdBlocking);
} else {
    initializeAdBlocking();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { blockAds, unblockAds, loadFilterLists };
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Web Proxy</h1>
        <div class="input-area">
            <input type="text" id="urlInput" placeholder="Enter URL">
            <button id="proxyButton">Go</button>
        </div>
        <div id="content"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>
edit filepath: public/style.css
content: body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
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
    width: 80%;
    max-width: 800px;
}

h1 {
    text-align: center;
    color: #333;
}

.input-area {
    display: flex;
    margin-bottom: 20px;
}

input[type="text"] {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

button {
    padding: 10px 20px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
}

button:hover {
    background-color: #4cae4c;
}

#content {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
edit filepath: public/script.js
content: document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', function() {
        const url = urlInput.value;
        if (url) {
            fetch('/api/proxy?url=' + encodeURIComponent(url))
                .then(response => response.text())
                .then(data => {
                    contentDiv.innerHTML = data;
                })
                .catch(error => {
                    contentDiv.innerHTML = '<p>Error: ' + error + '</p>';
                });
        } else {
            contentDiv.innerHTML = '<p>Please enter a URL.</p>';
        }
    });
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

    try {
        new URL(targetUrl);
    } catch (error) {
        res.status(400).send('Invalid URL');
        return;
    }

    const proxyRequest = (url, res) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (proxyResponse) => {
            res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
            proxyResponse.pipe(res, {
                end: true,
            });
        }).on('error', (error) => {
            console.error('Proxy error:', error);
            res.status(500).send('Proxy error: ' + error.message);
        });
    };

    proxyRequest(targetUrl, res);
};
edit filepath: server.js
content: const http = require('http');
const fs = require('fs');
const path = require('path');
const proxy = require('./api/proxy');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;

    if (pathname === '/api/proxy') {
        proxy(req, res);
        return;
    }

    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);

    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end(`Server Error: ${error.code}`);
                } else {
                    const ext = path.extname(filePath);
                    let contentType = 'text/html';

                    switch (ext) {
                        case '.js':
                            contentType = 'text/javascript';
                            break;
                        case '.css':
                            contentType = 'text/css';
                            break;
                        case '.json':
                            contentType = 'application/json';
                            break;
                        case '.png':
                            contentType = 'image/png';
                            break;
                        case '.jpg':
                            contentType = 'image/jpg';
                            break;
                    }

                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                }
            });
        } else {
            res.writeHead(404);
            res.end(`File not found: ${filePath}`);
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
edit filepath: package.json
content: {
  "name": "web-proxy",
  "version": "1.0.0",
  "description": "Simple web proxy",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {},
  "devDependencies": {}
}
edit filepath: adblocker/filters/easylist.txt
content: ! Title: EasyList
! Description: Primary ad blocking filter list
! Expires: 5 days
! Homepage: https://easylist.to
!
||example.com^
||example.net^
||example.org^
||adservice.google.com^
||doubleclick.net^
edit filepath: .gitignore
content: node_modules/
/public/style.css.map
.DS_Store
edit filepath: README.md
content: # Web Proxy Project

A simple web proxy built with Node.js.
edit filepath: utils/urlUtils.js
content: function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

module.exports = { isValidURL };