file: api/search.js
content: 
```js
const axios = require('axios');

const search = async (req, res) => {
  try {
    const { query } = req.body;
    const response = await axios.get(`https://www.google.com/search?q=${query}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  search,
};
```