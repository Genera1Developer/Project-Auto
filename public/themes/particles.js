FILE PATH: server.js
CONTENT: ```js
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

const options = {
  target: 'http://example.com',
  changeOrigin: true,
};

app.use('/proxy', proxy(options));

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
```