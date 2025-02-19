FILE PATH: server.js
CONTENT: 
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

app.post('/proxy', async (req, res) => {
  const { url } = req.body;
  const { getHtml } = require('./utils');
  const html = await getHtml(url);
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```