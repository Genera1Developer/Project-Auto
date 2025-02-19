file: api/search.js
content: 
```javascript
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

async function fetchFromGoogle(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://google.com/search?q=${encodedQuery}`;
  const result = await fetch(url);
  const text = await result.text();
  return text;
}

router.get('/search', async (req, res) => {
  const query = req.query.q;

  try {
    const result = await fetchFromGoogle(query);

    res.send(result);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
```