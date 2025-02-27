const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests, please try again later.',
});

const proxyOptions = {
  router: (req) => {
    let targetUrl = req.headers['x-target-url'] || req.query.target;
    if (!targetUrl) {
      console.log('No target URL provided. Defaulting to Google.');
      targetUrl = 'https://www.google.com';
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    console.log(`Proxying to: ${targetUrl}`);
    return targetUrl;
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
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);
  },
};

const myProxy = createProxyMiddleware(proxyOptions);

router.use(limiter);
router.get('/', (req, res) => {
    res.send('Proxy server running. Provide target URL via X-Target-URL header or ?target= parameter.');
});
router.use('/', myProxy);

module.exports = router;