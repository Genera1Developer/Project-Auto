FILE PATH: api/search.js
CONTENT: 
```javascript
const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.post('/api/proxy', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(url);
    const html = await response.text();

    res.send(html);
  } catch (error) {
    res.status(500).send('Error fetching URL');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```