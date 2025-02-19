Based on the project goal, create a file named api/utils.js:

FILE PATH: api/utils.js
CONTENT: 
```javascript
const fetch = require('node-fetch');
const sharp = require('sharp');

const logRequest = async (req) => {
  console.log(`${req.method} ${req.url} from ${req.headers['user-agent']}`);
  console.log(req.body);
};

const forwardRequest = async (req, res) => {
  const targetUrl = req.body.url;
  
  if (!targetUrl) {
    res.status(400).send('Missing URL');
    return;
  }

  try {
    const response = await fetch(targetUrl);
    if (response.status >= 400) {
      res.status(response.status).send(await response.text());
      return;
    }
    const contentType = response.headers.get('content-type');

    if (contentType.includes('image')) {
      const imageBuffer = await response.buffer();
      const resizedImage = await sharp(imageBuffer)
        .resize(500)
        .toBuffer();
      res.set('Content-Type', contentType);
      res.send(resizedImage);
      return;
    }

    res.set('Content-Type', contentType);
    res.send(await response.text());
    
  } catch (err) {
    res.status(500).send('Error forwarding request');
  }
};
```