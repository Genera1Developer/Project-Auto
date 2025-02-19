FILE PATH: api/proxy.js
CONTENT: 
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const utils = require('./utils');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  await utils.logRequest(req);
  next();
});

app.post('/proxy', async (req, res) => {
  utils.forwardRequest(req, res);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Web proxy listening on port ${PORT}`);
});
```