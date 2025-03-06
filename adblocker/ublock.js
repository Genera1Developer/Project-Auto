const filterLists = [
    '/adblocker/filters/easylist.txt'
];

let blockingRules = [];
let observer = null;

async function loadFilterLists() {
    try {
        const responses = await Promise.all(filterLists.map(list => fetch(list)));
        const texts = await Promise.all(responses.map(response => {
            if (!response.ok) {
                console.error('Failed to load filter list:', response.url, response.status);
                return '';
            }
            return response.text();
        }));

        for (const text of texts) {
            if (text) {
                const rules = parseFilterList(text);
                blockingRules = blockingRules.concat(rules);
            }
        }
        console.log('Filter lists loaded:', blockingRules.length, 'rules');
        return blockingRules;
    } catch (error) {
        console.error('Error loading filter lists:', error);
        return [];
    }
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
                    let src = node.src || node.href;
                    if (src && blockingRules.some(rule => src.includes(rule))) {
                        node.remove();
                        console.log(`Blocked ad from: ${src}`);
                    } else if (node instanceof HTMLImageElement) {
                        if (node.alt && blockingRules.some(rule => node.alt.includes(rule))) {
                            node.remove();
                            console.log(`Blocked ad image with alt text: ${node.alt}`);
                        }
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
edit filepath: public/script.js
content: document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');
    const adBlockerScript = document.createElement('script');
    adBlockerScript.src = '/adblocker/ublock.js';
    document.head.appendChild(adBlockerScript);

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
const { isValidURL } = require('../utils/urlUtils');

module.exports = (req, res) => {
    let targetUrl = req.query.url;

    if (!targetUrl) {
        res.status(400).send('URL parameter is required');
        return;
    }

    if (!isValidURL(targetUrl)) {
        res.status(400).send('Invalid URL');
        return;
    }

    const proxyRequest = (url, res) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, {headers: {'User-Agent': 'Mozilla/5.0'}}, (proxyResponse) => {
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
const { URL } = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;

    if (pathname === '/api/proxy') {
        proxy(req, res);
        return;
    }

    if (pathname.startsWith('/adblocker')) {
        let filePath = path.join(__dirname, pathname);
        fs.exists(filePath, function(exists) {
            if (exists) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        res.writeHead(500);
                        res.end(`Server Error: ${error.code}`);
                    } else {
                        const ext = path.extname(filePath);
                        let contentType = 'application/javascript';
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(content);
                    }
                });
            } else {
                res.writeHead(404);
                res.end(`File not found: ${filePath}`);
            }
        });
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
                        case '.txt':
                            contentType = 'text/plain';
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
  "devDependencies": {
    "eslint": "^8.57.0"
  }
}
edit filepath: .eslintrc.js
content: module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-console": "off",
        "no-unused-vars": "warn",
        "indent": [
            "warn",
            4
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "warn",
            "always"
        ]
    }
};
edit filepath: adblocker/ublock.js
content: const filterLists = [
    '/adblocker/filters/easylist.txt'
];

let blockingRules = [];
let observer = null;

async function loadFilterLists() {
    try {
        const responses = await Promise.all(filterLists.map(list => fetch(list)));
        const texts = await Promise.all(responses.map(response => {
            if (!response.ok) {
                console.error('Failed to load filter list:', response.url, response.status);
                return '';
            }
            return response.text();
        }));

        for (const text of texts) {
            if (text) {
                const rules = parseFilterList(text);
                blockingRules = blockingRules.concat(rules);
            }
        }
        console.log('Filter lists loaded:', blockingRules.length, 'rules');
        return blockingRules;
    } catch (error) {
        console.error('Error loading filter lists:', error);
        return [];
    }
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
                    let src = node.src || node.href;
                    if (src && blockingRules.some(rule => src.includes(rule))) {
                        node.remove();
                        console.log(`Blocked ad from: ${src}`);
                    } else if (node instanceof HTMLImageElement) {
                        if (node.alt && blockingRules.some(rule => node.alt.includes(rule))) {
                            node.remove();
                            console.log(`Blocked ad image with alt text: ${node.alt}`);
                        } else if (node.id && blockingRules.some(rule => node.id.includes(rule))) {
                             node.remove();
                             console.log(`Blocked ad image with id: ${node.id}`);
                        }
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
edit filepath: adblocker/ublock.js
content: const filterLists = [
    '/adblocker/filters/easylist.txt'
];

let blockingRules = [];
let observer = null;

async function loadFilterLists() {
    try {
        const responses = await Promise.all(filterLists.map(list => fetch(list)));
        const texts = await Promise.all(responses.map(response => {
            if (!response.ok) {
                console.error('Failed to load filter list:', response.url, response.status);
                return '';
            }
            return response.text();
        }));

        for (const text of texts) {
            if (text) {
                const rules = parseFilterList(text);
                blockingRules = blockingRules.concat(rules);
            }
        }
        console.log('Filter lists loaded:', blockingRules.length, 'rules');
        return blockingRules;
    } catch (error) {
        console.error('Error loading filter lists:', error);
        return [];
    }
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
                    let src = node.src || node.href;
                    if (src && blockingRules.some(rule => src.includes(rule))) {
                        node.remove();
                        console.log(`Blocked ad from: ${src}`);
                    } else if (node instanceof HTMLImageElement) {
                        if (node.alt && blockingRules.some(rule => node.alt.includes(rule))) {
                            node.remove();
                            console.log(`Blocked ad image with alt text: ${node.alt}`);
                        } else if (node.id && blockingRules.some(rule => node.id.includes(rule))) {
                             node.remove();
                             console.log(`Blocked ad image with id: ${node.id}`);
                        } else if (node.classList && Array.from(node.classList).some(cls => blockingRules.some(rule => cls.includes(rule)))) {
                            node.remove();
                            console.log(`Blocked ad image with class: ${node.classList}`);
                        }
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