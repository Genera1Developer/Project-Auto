file: api/search.js
content: 
```js
const axios = require('axios');

const search = async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.get(`https://www.google.com/search?q=${query}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  search,
};
```