file: api/search.js
CONTENT: 
```js
const fetch = require('node-fetch');

const searchGoogle = async (query) => {
  const url = 'https://www.googleapis.com/customsearch/v1';
  const params = {
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
    q: query,
  };

  const response = await fetch(`${url}?${new URLSearchParams(params)}`);
  const data = await response.json();
  return data.items;
};

module.exports = { searchGoogle };
```
file: api/proxy.js
```js
const express = require('express');
const bodyParser = require('body-parser');
const { searchGoogle } = require('./search');

const app = express();
app.use(bodyParser.json());
app.post('/search', async (req, res) => {
  const { query } = req.body;
  const results = await searchGoogle(query);
  res.json(results);
});
app.listen(3000);
```