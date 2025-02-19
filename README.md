FILE PATH: server.js
CONTENT: const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const options = {
    hostname: parsedUrl.host,
    path: parsedUrl.path,
    method: req.method,
    headers: req.headers
  };

  const proxyRequest = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyRequest);
});

server.listen(8080);