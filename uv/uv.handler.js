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
      console.error('Invalid URL:', urlString, err);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid URL format.');
      return;
    }

    const target = url.hostname;
    const port = url.port || (url.protocol === 'https:' ? 443 : 80);

    const options = {
      hostname: target,
      port: port,
      path: url.pathname + url.search,
      method: req.method,
      headers: { ...req.headers },
      timeout: 10000,
      followRedirects: false
    };

    delete options.headers['host'];
    delete options.headers['origin'];
    delete options.headers['connection'];
    delete options.headers['upgrade'];

    const proxyReq = (url.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
      const resHeaders = { ...proxyRes.headers };
      delete resHeaders['transfer-encoding'];

      res.writeHead(proxyRes.statusCode, resHeaders);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('timeout', () => {
      proxyReq.destroy(new Error('Proxy request timeout'));
      if (!res.headersSent) {
        res.writeHead(504, { 'Content-Type': 'text/plain' });
        res.end('Proxy request timeout.');
      }
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Proxy error.');
      }
    });

    req.pipe(proxyReq, { end: true });

    req.on('error', (err) => {
      console.error('Request pipe error:', err);
      proxyReq.destroy(err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Request error.');
      }
    });

    proxyReq.on('close', () => {
      if (!req.complete) {
        req.destroy();
      }
    });

    res.on('close', () => {
      proxyReq.destroy();
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error.');
    }
  }
}

module.exports = { handleRequest };