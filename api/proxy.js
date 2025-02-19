FILE PATH: api/index.js
CONTENT: 
```javascript
const express = require('express');
const proxy = require('./proxy');

const app = express();

app.get('/api/html', async (req, res) => {
  const url = req.query.url;
  const options = req.query.options || {};

  const html = await proxy.getHtml(url, options);
  res.send(html);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
```