const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyOptions = {
  router: (req) => {
    const targetUrl = req.headers['x-target-url'];
    if (targetUrl) {
      console.log(`Proxying to: ${targetUrl}`);
      return targetUrl;
    }
    console.log('No target URL provided in headers.');
    return 'https://www.google.com'; 
  },
  changeOrigin: true,
  logLevel: 'info',
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy Error');
  },
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['X-Proxy-By'] = 'Node-Proxy';
  },
};

const myProxy = createProxyMiddleware(proxyOptions);

router.use('/', myProxy);

module.exports = router;