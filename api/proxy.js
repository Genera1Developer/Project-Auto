FILE PATH: server.js
CONTENT: 
```javascript
const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(url);
    const html = await response.text();

    res.send(html);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
```