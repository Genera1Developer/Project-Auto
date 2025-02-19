FILE PATH: api/search.js
CONTENT: 
```javascript
const fetch = require('node-fetch');

const search = async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(url);
    const html = await response.text();

    res.status(200).json({ html });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = search;
```