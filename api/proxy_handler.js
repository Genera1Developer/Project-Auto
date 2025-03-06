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
      'content-encoding', // Added content-encoding
    ];

    hopByHopHeaders.forEach(header => {
      delete options.headers[header];
    });

    const proxyReq = (parsedURL.protocol === 'https:' ? https : http).request(parsedURL.href, options, (proxyRes) => {
      const proxyResHeaders = { ...proxyRes.headers }; // Copy headers to avoid modifying the original object.
      hopByHopHeaders.forEach(header => {
        delete proxyResHeaders[header];
      });

      res.writeHead(proxyRes.statusCode, proxyResHeaders);
      proxyRes.pipe(res);
    });

    proxyReq.on('timeout', () => {
      console.error('Proxy request timed out.');
      proxyReq.destroy();
      if (!res.headersSent) {
        return res.status(504).send('Proxy request timed out.');
      } else {
        res.end();
      }
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      if (!res.headersSent) {
        return res.status(500).send('Proxy error.');
      } else {
        res.end();
      }
    });

    req.pipe(proxyReq);

    req.on('error', (err) => {
      console.error('Request pipe error:', err);
      proxyReq.destroy(err);
    });

    proxyReq.on('close', () => {
      // Clean up if the connection to the target server is closed prematurely.
    });

  } catch (error) {
    console.error('URL parsing error:', error);
    return res.status(400).send('Invalid URL.');
  }
};

module.exports = proxyHandler;