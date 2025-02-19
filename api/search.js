FILE PATH: api/search.js
CONTENT: 
```javascript
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const cheerio = require('cheerio');

router.get('/search', async (req, res) => {
  const { query } = req.query;
  const url = `https://duckduckgo.com/html/?q=${query}`;
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);
  const results = [];
  $('.result__snippet').each((i, el) => {
    const title = $(el).find('a').first().text();
    const link = $(el).find('a').first().attr('href');
    const snippet = $(el).text().trim();
    results.push({ title, link, snippet });
  });
  res.json(results);
});

module.exports = router;
```