FILE PATH: api/proxy.js
CONTENT: 
```javascript
const fetch = require('node-fetch');
const express = require('express');

const app = express();

app.get('/', async (req, res) => {
  const url = req.query.url;
  if (!url) res.sendStatus(400);

  const response = await fetch(url);
  if (!response.ok) res.sendStatus(response.status);

  const contentType = response.headers.get('content-type');
  res.header('content-type', contentType);

  const body = await response.text();
  res.send(body);
});

app.listen(3000, () => {
  console.log('Proxy server is listening on port 3000');
});
```