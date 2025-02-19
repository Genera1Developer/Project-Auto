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

file: index.js
content: 
```js
const express = require('express');
const apiRouter = require('./api');

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
```