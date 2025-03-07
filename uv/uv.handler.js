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
      res.end('Invalid URL format: ' + err.message);
      return;
    }

    const target = url.hostname;
    const port = url.port || (url.protocol === 'https:' ? 443 : 80);
    const path = url.pathname + url.search;

    const options = {
      hostname: target,
      port: port,
      path: path,
      method: req.method,
      headers: { ...req.headers },
      timeout: 10000,
      followRedirects: false,
    };

    // Delete potentially problematic headers
    const hopByHopHeaders = [
      'host',
      'origin',
      'connection',
      'upgrade',
      'accept-encoding',
      'proxy-connection',
      'if-none-match',
      'if-modified-since',
      'pragma',
      'cache-control',
      'transfer-encoding' // Important to remove for proper handling
    ];

    hopByHopHeaders.forEach(header => delete options.headers[header]);

    // Set 'x-forwarded-for' header
    options.headers['x-forwarded-for'] = req.socket.remoteAddress || req.connection.remoteAddress;

    const proxyReq = (url.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
      const resHeaders = { ...proxyRes.headers };

      // Remove content-encoding to prevent issues with decompression. The client
      // can handle decompression on its own.
      delete resHeaders['content-encoding'];

      res.writeHead(proxyRes.statusCode, resHeaders);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.setTimeout(options.timeout, () => {
      proxyReq.destroy(new Error('Proxy request timeout.'));
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Proxy error: ' + err.message);
      } else {
        if (res.socket) {
          res.socket.destroy();
        }
      }
    });

    req.pipe(proxyReq, { end: true });

    req.on('error', (err) => {
      console.error('Request pipe error:', err);
      proxyReq.destroy(err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Request error: ' + err.message);
      } else {
        if (res.socket) {
          res.socket.destroy();
        }
      }
    });

    proxyReq.on('close', () => {
      if (!req.complete && !req.destroyed) {
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
      res.end('Internal server error: ' + error.message);
    } else {
      if (res.socket) {
        res.socket.destroy();
      }
    }
  }
}

module.exports = { handleRequest };