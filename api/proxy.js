FILE PATH: api/proxy.js
CONTENT: 
```javascript
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { url, method, headers, body } = req.body;

    const response = await axios({
      method,
      url,
      headers,
      data: body,
    });

    res.status(response.status).send(response.data);
  } catch {
    res.status(500).send({ error: 'Something went wrong' });
  }
};
```