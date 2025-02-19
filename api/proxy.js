FILE PATH: controllers/proxy.js
CONTENT: 
```javascript
const fetch = require('node-fetch');

exports.getProxy = async (req, res) => {
  const { url } = req.body;
  try {
    const response = await fetch(url);
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.status(500).send('Error fetching URL');
  }
};
```