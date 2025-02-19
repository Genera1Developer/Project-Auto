FILE PATH: server/index.js
CONTENT:
```javascript
const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { url, method, body } = req.body;

  const response = await fetch(url, {
    method,
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseBody = await response.text();

  res.send(responseBody);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```