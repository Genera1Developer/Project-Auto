FILE PATH: api/search.js
CONTENT: 
```js
const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async function search(req, res) {
  const { query } = req.query;

  const form = new FormData();
  form.append('query', query);

  const response = await fetch('https://google.com/search', {
    method: 'POST',
    body: form,
  });

  const text = await response.text();

  res.send(text);
};
```