Based on the project goal, following file should be created:

FILE PATH: server/server.js
CONTENT: 
```javascript
const express = require('express');
const got = require('got');

const app = express();
const port = 3000;

app.get('/search', async (req, res) => {
  const { query } = req.body;

  const response = await got('https://www.googleapis.com/customsearch/v1', {
    searchParams: {
      key: 'YOUR_API_KEY',
      cx: 'YOUR_CX',
      q: query,
    },
  });

  const data = JSON.parse(response.body);

  res.json(data);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```