FILE PATH: server.js
CONTENT: 
```javascript
const express = require('express');
const http = require('http');
const proxy = require('http-proxy');
const utils = require('./utils');

const app = express();
const proxyServer = proxy.createProxyServer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('*', async (req, res) => {
  const targetUrl = req.get('x-proxy-url');
  if (!targetUrl) {
    res.status(400).json({ error: 'Missing x-proxy-url header' });
    return;
  }

  proxyServer.web(req, res, { target: targetUrl }, async (err) => {
    if (err) {
      res.status(500).json({ error: 'Error proxying request' });
      return;
    }

    await utils.logRequest(req);
  });
});

const server = http.createServer(app);
server.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
```