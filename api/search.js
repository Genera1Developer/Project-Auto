FILE PATH: api/search.js
CONTENT: 
```javascript
const fetch = require('node-fetch');

const BASE_URL = 'https://duckduckgo.com/';
const SEARCH_URL = BASE_URL + '?q=';

const search = async (query) => {
  const response = await fetch(SEARCH_URL + query);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const results = [...doc.querySelectorAll('.result__a')].map((result) => ({
    title: result.querySelector('.result__title').textContent,
    url: result.href,
    description: result.querySelector('.result__snippet').textContent,
  }));

  return results;
};

module.exports = search;
```