FILE PATH: server.js
CONTENT: 
```javascript
const express = require('express');
const request = require('request');

const app = express();

app.use(express.json());

app.post('/proxy', (req, res) => {
  const { url } = req.body;

  request(url, (error, response, body) => {
    if (error) {
      res.status(500).send('Error fetching URL');
    } else {
      res.send(body);
    }
  });
});

app.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
```