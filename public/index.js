FILE PATH: server/routes/proxy.js
CONTENT: 
```javascript
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/proxy', async (req, res) => {
  try {
    const { url, method, body } = req.body;

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();

    res.json({ response: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```