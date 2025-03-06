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
      timeout: 15000, // Add a timeout to prevent hanging requests
    };

    // Remove hop-by-hop headers
    delete options.headers['connection'];
    delete options.headers['proxy-connection'];
    delete options.headers['transfer-encoding'];
    delete options.headers['upgrade'];
    delete options.headers['keep-alive']; // Also remove keep-alive

    const proxyReq = (parsedURL.protocol === 'https:' ? https : http).request(parsedURL.href, options, (proxyRes) => {
      // Remove hop-by-hop headers from the response as well
      delete proxyRes.headers['connection'];
      delete proxyRes.headers['proxy-connection'];
      delete proxyRes.headers['transfer-encoding'];
      delete proxyRes.headers['upgrade'];
      delete proxyRes.headers['keep-alive']; // Also remove keep-alive

      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('timeout', () => {
      console.error('Proxy request timed out.');
      proxyReq.destroy(); // Destroy the request
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
        // If headers already sent, close the connection
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