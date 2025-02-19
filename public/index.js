Based on the project goal, the following file should be created:

FILE PATH: public/proxy.js
CONTENT:
```javascript
const express = require('express');
const request = require('request');

const app = express();
app.use(express.json());

app.post('/proxy', (req, res) => {
  const { url, method, body } = req.body;

  const requestBody = {
    method,
    url,
    body,
  };

  request(requestBody, (error, response, body) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send({ content: body });
    }
  });
});

app.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
```