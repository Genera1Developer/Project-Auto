FILE PATH: api/proxy.js
CONTENT: 
```javascript
const express = require('express');
const app = express();
const { logRequest, forwardRequest } = require('./utils');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  await logRequest(req);
  await forwardRequest(req, res);
});

app.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
```