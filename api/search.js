FILE PATH: api/search.js
CONTENT: 
```js
const axios = require('axios');
const jsdom = require('jsdom');

async function search(req, res) {
  try {
    const { url, query } = req.query;
    const { data } = await axios.get(url);
    const { JSDOM } = jsdom;
    const dom = new JSDOM(data);
    const results = dom.window.document.querySelectorAll(`a[href^="${query}"]`);
    res.json({ results });
  } catch (err) {
    res.json({ error: 'Error retrieving results' });
  }
}

module.exports = search;
```