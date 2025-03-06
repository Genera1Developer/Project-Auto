const { URL } = require('url');
const http = require('http');
const https = require('https');

async function handleRequest(req, res) {
  try {
    const url = new URL(req.url.slice(1));
    const target = url.origin;

    if (!target) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid URL provided.');
      return;
    }

    const options = {
      method: req.method,
      path: url.pathname + url.search,
      headers: req.headers,
      followRedirects: false,
    };

    const proxyReq = (url.protocol === 'https:' ? https : http).request(target, options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error.');
    });

    req.pipe(proxyReq, { end: true });
  } catch (error) {
    console.error('URL parsing error:', error);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid URL format.');
  }
}

module.exports = { handleRequest };