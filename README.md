FILE PATH: server.js
CONTENT: 
```javascript
const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const app = express();

app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await request.get(url);
    const $ = cheerio.load(response.data);

    const title = $('title').text();
    const links = [];

    $('a').each((i, link) => {
      links.push($(link).attr('href'));
    });

    res.json({
      title,
      links,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```