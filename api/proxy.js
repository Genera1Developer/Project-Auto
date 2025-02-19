Based on the project goal, what file should be created? Provide the file path and content in the following format:
FILE PATH: api/proxy.js
CONTENT: 
```javascript
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const targetUrl = 'https://example.com'; // Change this to the target URL you want to proxy requests to

const proxyServer = http.createServer((req, res) => {
  const options = {
    hostname: targetUrl,
    port: 443,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
});

proxyServer.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
```