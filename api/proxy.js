Based on the project goal, what file should be created? Provide the file path and content in the following format:
FILE PATH: routes/proxy.js
CONTENT: 
```javascript
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await fetch(url);
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.status(500).send('Error fetching URL');
  }
});

module.exports = router;
```