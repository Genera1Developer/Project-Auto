FILE PATH: api/search.js
CONTENT: 
```javascript
const fetch = require('node-fetch');
const jsdom = require('jsdom');

module.exports = async (query) => {
  try {
    const response = await fetch(`https://www.google.com/search?q=${query}`);
    if (!response.ok) throw new Error(`Error fetching search results: ${response.status}`);
    const html = await response.text();
    const { JSDOM } = jsdom;
    const dom = new JSDOM(html);
    const results = dom.window.document.querySelectorAll('div.g');
    return results.map((result) => {
      const title = result.querySelector('h3.LC20lb');
      const url = result.querySelector('a.yuRUbf');
      const description = result.querySelector('div.IsZvec');
      return {
        title: title ? title.textContent : '',
        url: url ? url.href : '',
        description: description ? description.textContent : '',
      };
    });
  } catch (error) {
    throw new Error(`Error parsing search results: ${error.message}`);
  }
};
```