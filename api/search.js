FILE PATH: api/search.js
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

  return data;
};

module.exports = { searchGoogle };
```