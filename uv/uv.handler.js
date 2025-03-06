const { URL } = require('url');
const http = require('http');
const https = require('https');

async function handleRequest(req, res) {
  try {
    const urlString = req.url.slice(1);
    if (!urlString) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('No URL provided.');
      return;
    }

    let url;
    try {
      url = new URL(urlString);
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid URL format.');
      return;
    }

    const target = url.origin;

    const options = {
      method: req.method,
      path: url.pathname + url.search,
      headers: req.headers,
    };

    const proxyReq = (url.protocol === 'https:' ? https : http).request(target, options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error.');
    });

    req.pipe(proxyReq);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal server error.');
  }
}

module.exports = { handleRequest };