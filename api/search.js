Based on the project goal, here is the file:

FILE PATH: api/search.js
CONTENT: 
```javascript
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const q = req.query.q;

  const results = await fetch(
    `https://www.google.com/search?q=${q}&output=json`
  ).then((res) => res.json());

  res.json({ results });
};
```