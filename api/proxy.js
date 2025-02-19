file path: api/proxy.js
content: ```javascript
require('express-async-errors');
const axios = require('axios');
const express = require('express');
const path = require('path');
const RateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});

app.use(limiter);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/proxy', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter: q' });
  }

  try {
    const response = await axios.get(q, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Referer': q,
        'Accept': req.headers['accept'] || '*/*',
        'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.9',
      },
    });

    let contentType = response.headers['content-type'];
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    if (contentType.includes('text/html')) {
      let htmlContent = response.data.toString('utf-8');

      htmlContent = htmlContent.replace(/(href|src|action)="([^"]*)"/g, (match, attr, url) => {
        if (url.startsWith('http') || url.startsWith('//')) {
          return `${attr}="/api/proxy?q=${encodeURIComponent(url)}"`;
        }
        return match;
      });

      htmlContent = htmlContent.replace(/url\((['"]?)([^'"]+)\1\)/g, (match, quote, url) => {
        if (url.startsWith('http') || url.startsWith('//')) {
          return `url(${quote}/api/proxy?q=${encodeURIComponent(url)}${quote})`;
        }
        return match;
      });

      res.send(htmlContent);
    } else {
      res.send(response.data);
    }
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Error fetching resource', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
```
file path: app.js
content: ```javascript
require('dotenv').config();
const path = require('path');
const express = require('express');
const proxy = require('./api/proxy');

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', proxy);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```
file path: package.json
content: ```json
{
  "name": "proxy",
  "version": "1.0.0",
  "description": "A proxy server for web scraping and bypassing paywalls.",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "keywords": [
    "proxy",
    "web scraping",
    "bypass paywall"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "axios": "^0.26.1",
    "dotenv": "^16.0.3",
    "express": "^4.18.1",
    "express-async-errors": "^4.2.2",
    "express-rate-limit": "^5.2.4"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```
file path: public/index.html
content: ```html
<!DOCTYPE html>
<html>
  <head>
    <title>Web Proxy</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <h1>Web Proxy</h1>
    <p>
      Enter a URL below to fetch the content through this proxy.
    </p>
    <form>
      <input type="text" id="url" placeholder="Enter URL" />
      <button type="submit">Fetch</button>
    </form>
    <div id="result">
      <pre></pre>
    </div>
    <script>
      const form = document.querySelector('form');
      const result = document.querySelector('#result pre');

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = document.querySelector('#url').value;

        fetch(`/api/proxy?q=${url}`)
          .then((res) => res.text())
          .then((data) => {
            result.textContent = data;
          })
          .catch((error) => {
            result.textContent = error.message;
          });
      });
    </script>
  </body>
</html>
```