(async () => {
  const filterListUrl = "/adblocker/filters/easylist.txt";
  const elementTypes = new Set(["img", "script", "iframe", "object", "embed", "video", "audio", "source", "link", "style"]);
  const dataUrl = "data:,";
  let filters = [];
  let filterRegex = null;
  let filterUpdateInterval = 3600000;
  let blockedUrls = new Set();
  let customFilters = new Set();

  async function loadFilters(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load filter list from ${url}: ${response.status}`);
      }
      const text = await response.text();
      return text.split("\n")
        .filter(line => line.trim() && !line.trim().startsWith("!"))
        .map(line => line
          .replace(/([.?+^$[\]\\(){}|-])/g, "\\$1")
          .replace(/\*/g, ".*?")
          .replace(/^@@\|\|/, ".*://")
          .replace(/^\|\|/, "^https?://")
          .replace(/^@@/, "^https?://(?!")
          .replace(/^\|/, "^")
          .replace(/\|$/, "$"));
    } catch (error) {
      console.error("Error loading or processing filter list:", error);
      return [];
    }
  }

  async function updateFilters() {
    try {
      filters = await loadFilters(filterListUrl);
      filters = filters.concat(Array.from(customFilters));
      filterRegex = new RegExp(filters.join("|"), "i");
      console.log("[Adblocker] Filter list updated.");
    } catch (error) {
      console.error("Failed to update filters:", error);
    }
  }

  function addCustomFilter(filter) {
    customFilters.add(filter);
    updateFilters();
  }

  function removeCustomFilter(filter) {
    customFilters.delete(filter);
    updateFilters();
  }

  function isBlocked(url) {
    if (blockedUrls.has(url)) {
      return true;
    }
    const blocked = filterRegex && filterRegex.test(url);
    if (blocked) {
      blockedUrls.add(url);
    }
    return blocked;
  }

  function removeElement(element) {
    element.remove();
  }

  function replaceUrl(element) {
    if (element.src) {
      element.src = dataUrl;
    }
    if (element.srcset) {
      element.srcset = dataUrl;
    }
    if (element.href) {
      element.href = dataUrl;
    }
  }

  function handleElement(element) {
    try {
      const url = new URL(element.src || element.srcset || element.href || "", location.href).href;
      if (isBlocked(url)) {
        removeElement(element);
        replaceUrl(element);
      }
    } catch (e) {
      console.warn("[Adblocker] Error processing element URL:", e);
    }
  }

  function handleBeforeLoad(event) {
    try {
      const url = new URL(event.detail.url || "", location.href).href;
      if (isBlocked(url)) {
        event.preventDefault();
      }
    } catch (e) {
      console.warn("[Adblocker] Error processing beforeLoad URL:", e);
    }
  }

  function applyFiltersToDocument() {
    const elements = document.querySelectorAll(elementTypes.size ? Array.from(elementTypes).join(",") : "*");
    elements.forEach(element => {
      if (element.tagName === 'SCRIPT') {
        const src = element.src || '';
        if (isBlocked(src)) {
          removeElement(element);
          return;
        }
      } else {
        handleElement(element);
      }
    });
  }

  function handleNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'SCRIPT') {
        if (isBlocked(node.src)) {
          node.remove();
          return;
        }
      }
      handleElement(node);
    }
  }

  function observeDOM() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          handleNode(node);
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function proxyFetch() {
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = new Proxy(originalFetch, {
        apply: async function(target, thisArg, args) {
          const url = args[0];
          if (typeof url === 'string' && isBlocked(url)) {
            console.warn(`[Adblocker] Blocking fetch request to ${url}`);
            return Promise.reject(new Error(`Blocked by adblocker: ${url}`));
          }
          try {
            return await target.apply(thisArg, args);
          } catch (error) {
            console.error(`[Adblocker] Fetch error for ${url}:`, error);
            throw error;
          }
        }
      });
    }
  }

  function proxyXmlHttpRequest() {
    if (window.XMLHttpRequest) {
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        if (isBlocked(url)) {
          console.warn(`[Adblocker] Blocking XMLHttpRequest to ${url}`);
          return;
        }
        return originalOpen.apply(this, arguments);
      };
    }
  }

  function proxyWindowOpen() {
    window.open = new Proxy(window.open, {
      apply: function(target, thisArg, args) {
        const url = args[0];
        if (isBlocked(url)) {
          console.warn(`[Adblocker] Blocking window.open to ${url}`);
          return null;
        }
        return target.apply(thisArg, args);
      }
    });
  }

  async function initializeAdblocker() {
    await updateFilters();
    applyFiltersToDocument();
    observeDOM();
    proxyFetch();
    proxyXmlHttpRequest();
    proxyWindowOpen();
    setInterval(updateFilters, filterUpdateInterval);

    window.addEventListener('message', (event) => {
      if (event.data.type === 'addCustomFilter') {
        addCustomFilter(event.data.filter);
      } else if (event.data.type === 'removeCustomFilter') {
        removeCustomFilter(event.data.filter);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializeAdblocker);
  } else {
    initializeAdblocker();
  }
})();
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Web Proxy</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Web Proxy</h1>
    <input type="text" id="urlInput" placeholder="Enter URL">
    <button id="proxyButton">Go</button>

    <div id="contentFrame">
        <iframe id="proxyFrame" src=""></iframe>
    </div>

    <script src="script.js"></script>
</body>
</html>
edit filepath: public/style.css
content: body {
    font-family: Arial, sans-serif;
    margin: 20px;
}

#urlInput {
    width: 80%;
    padding: 10px;
    margin-bottom: 10px;
}

#proxyButton {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

#contentFrame {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
}

#proxyFrame {
    width: 100%;
    height: 100%;
    border: none;
}
edit filepath: public/script.js
content: document.getElementById('proxyButton').addEventListener('click', function() {
    var url = document.getElementById('urlInput').value;
    document.getElementById('proxyFrame').src = '/api/proxy?url=' + encodeURIComponent(url);
});
edit filepath: api/proxy.js
content: const { URL } = require('url');
const https = require('https');
const http = require('http');

module.exports = async (req, res) => {
    const { url: targetUrl } = req.query;

    if (!targetUrl) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const parsedTargetUrl = new URL(targetUrl);
        const protocol = parsedTargetUrl.protocol === 'https:' ? https : http;

        protocol.get(targetUrl, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        }).on('error', (e) => {
            console.error(e);
            res.status(500).send('Proxy error');
        });
    } catch (error) {
        console.error(error);
        res.status(400).send('Invalid URL');
    }
};
edit filepath: package.json
content: {
  "name": "web-proxy",
  "version": "1.0.0",
  "description": "A simple web proxy",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "http-proxy": "^1.18.1",
    "url": "^0.16.0"
  }
}
edit filepath: index.js
content: const http = require('http');
const fs = require('fs');
const path = require('path');
const proxy = require('./api/proxy');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const { url } = req;

    if (url.startsWith('/api/proxy')) {
        return proxy(req, res);
    }

    let filePath = path.join(__dirname, 'public', url === '/' ? 'index.html' : url);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            let contentType = 'text/html';
            if (url.endsWith('.js')) contentType = 'text/javascript';
            else if (url.endsWith('.css')) contentType = 'text/css';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
edit filepath: public/404.html
content: <!DOCTYPE html>
<html>
<head>
    <title>404 Not Found</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>404 Not Found</h1>
    <p>The requested resource could not be found.</p>
</body>
</html>
edit filepath: .gitignore
content: node_modules/
edit filepath: adblocker/filters/easylist.txt
content: ! Title: EasyList
! Version: 202407041220
! Last modified: 2024-07-04T12:20:37Z
! Expires: 5 days (update frequently)
! Homepage: https://easylist.to
! License: https://easylist.to/pages/licence.html

||example.com^
||example.net^
edit filepath: api/cors.js
content: module.exports = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
};
edit filepath: api/httpsAgent.js
content: const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

module.exports = httpsAgent;