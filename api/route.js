const express = require('express');
const router = express.Router();
const proxy = require('http-proxy-middleware');

const config = {
  target: 'https://www.google.com',
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: {
    '^/api/route': '',
  },
};

const exampleProxy = proxy.createProxyMiddleware(config);

router.use('/', exampleProxy);

module.exports = router;