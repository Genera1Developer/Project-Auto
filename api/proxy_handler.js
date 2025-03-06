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
    };

    const proxyReq = (parsedURL.protocol === 'https:' ? https : http).request(parsedURL.href, options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.status(500).send('Proxy error.');
    });

    req.pipe(proxyReq, { end: true });
  } catch (error) {
    console.error('URL parsing error:', error);
    res.status(400).send('Invalid URL.');
  }
};

module.exports = proxyHandler;