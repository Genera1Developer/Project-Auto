const http = require('http');
const https = require('https');
const url = require('url');

const proxyHandler = (req, res) => {
  const targetURL = req.headers['x-target-url'];

  if (!targetURL) {
    return res.status(400).send('Target URL is missing.');
  }

  try {
    const parsedURL = new URL(targetURL);
    const options = {
      method: req.method,
      headers: { ...req.headers, host: parsedURL.hostname },
      followRedirects: false,
      timeout: 15000,
      agent: false,
      rejectUnauthorized: false,
    };

    const hopByHopHeaders = [
      'connection',
      'proxy-connection',
      'transfer-encoding',
      'upgrade',
      'keep-alive',
      'te',
      'trailer',
      'proxy-authenticate',
      'proxy-authorization',
    ];

    hopByHopHeaders.forEach(header => {
      delete options.headers[header];
    });

    const proxyReq = (parsedURL.protocol === 'https:' ? https : http).request(parsedURL.href, options, (proxyRes) => {
      const proxyResHeaders = { ...proxyRes.headers };
      hopByHopHeaders.forEach(header => {
        delete proxyResHeaders[header];
      });

      res.writeHead(proxyRes.statusCode, proxyResHeaders);
      proxyRes.pipe(res);

      proxyRes.on('error', (err) => {
          console.error('Proxy response error:', err);
          if (!res.writableEnded) {
              if (!res.headersSent) {
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
              }
              res.end(`Proxy response error: ${err.message}`);
          }
      });

    });

    proxyReq.setTimeout(options.timeout, () => {
      console.error('Proxy request timed out.');
      proxyReq.destroy(new Error('Proxy request timed out.'));
      if (!res.writableEnded) {
        if (!res.headersSent) {
          res.writeHead(504, { 'Content-Type': 'text/plain' });
        }
        res.end('Proxy request timed out.');
      }
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      if (!res.writableEnded) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
        }
        res.end(`Proxy error: ${err.message}`);
      }
    });

    req.pipe(proxyReq);

    req.on('error', (err) => {
      console.error('Request pipe error:', err);
      proxyReq.destroy(err);
      if (!res.writableEnded) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
        }
        res.end(`Request aborted: ${err.message}`);
      }
    });

    proxyReq.on('close', () => {
      // Clean up if the connection to the target server is closed prematurely.
    });

  } catch (error) {
    console.error('URL parsing error:', error);
    if (!res.headersSent) {
      res.status(400).send(`Invalid URL: ${error.message}`);
    }
  }
};

module.exports = proxyHandler;