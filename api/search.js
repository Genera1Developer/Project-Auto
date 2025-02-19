file: controllers/proxy.js
content: 
```javascript
const got = require('got');

const proxy = async (req, res) => {
  const { url } = req.body;

  try {
    const response = await got(url);
    res.status(response.statusCode).send(response.body);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
```