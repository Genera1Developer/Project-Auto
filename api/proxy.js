FILE PATH: api/utils.js
CONTENT: 
```javascript
const fetch = require('node-fetch');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const getTempFilePath = async (req) => {
  const filename = crypto.createHash('md5').update(req.url).digest('hex');
  const tempDir = path.join(__dirname, 'temp');
  const filePath = path.join(tempDir, filename);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  return filePath;
};

const saveRequest = async (req, filePath) => {
  const request = {
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body
  };
  const json = JSON.stringify(request);
  await fs.promises.writeFile(filePath, json);
};

const logRequest = async (req) => {
  const filePath = await getTempFilePath(req);
  await saveRequest(req, filePath);
};

const forwardRequest = async (req, res) => {
  const url = req.body.url;
  const options = {
    headers: req.headers,
    method: req.method,
    body: req.body,
  };
  const response = await fetch(url, options);
  res.status(response.status);
  response.headers.forEach((val, key) => res.header(key, val));
  response.body.pipe(res);
};

module.exports = {
  logRequest,
  forwardRequest,
};
```