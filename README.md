Based on the project goal, what file should be created? Provide the file path and content in the following format:
FILE PATH: server.js
CONTENT: 
```javascript
const express = require('express');
const request = require('request');

const app = express();

app.get('*', (req, res) => {
  const url = req.url;
  request(url).pipe(res);
});

app.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
```