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
file path: package-lock.json
content: ```json
{
  "name": "proxy",
  "version": "1.0.0",
  "lockfileVersion": 1,
  "requires": true,
  "dependencies": {
    "@babel/code-frame": {
      "version": "7.12.11",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.12.11.tgz",
      "integrity": "sha512-Zt1yodBx1UcyiePMSkWnU4hPqhwq7hGi2nFL1LeA3EUl+q2LQx16MISgJ0+z7dnmgvP9QtIleuETGOiUX1f2sQ==",
      "dev": true,
      "requires": {
        "@babel/highlight": "^7.10.4"
      }
    },
    "@babel/generator": {
      "version": "7.12.11",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.12.11.tgz",
      "integrity": "sha512-HKlu93x0yHVO66xfz/t3z60ex/D33aA4X8ih3s/t102hvfpAO7nPiRDa5tAQ2kj9sEMv91dGMolGOKXGrnUTQ==",
      "dev": true,
      "requires": {
        "@babel/types": "^7.12.11",
        "jsesc": "^2.5.1",
        "source-map": "^0.5.0"
      }
    },
    "@babel/helper-annotate-as-pure": {
      "version": "7.12.10",
      "resolved": "https://registry.npmjs.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.12.10.tgz",
      "integrity": "sha512-XplmVbC1n+Ky6jSKK8qIx4T4BoP/g2E5gJh8I4O8r8k+d+GlKP3rcl/t3QmfN9bRco+TLPDMyZgSpPXp9AhVw==",
      "dev": true,
      "requires": {
        "@babel/types": "^7.12.10"
      }
    },
    "@babel/helper-builder-binary-assignment-operator-visitor": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/helper-builder-binary-assignment-operator-visitor/-/helper-builder-binary-assignment-operator-visitor-7.12.13.tgz",
      "integrity": "sha512-CZOv9tGphhYs7PGn/odDI8cL9322/V0gHpk2W3a27zhoENXgJG3TqG80/ctxhqz8b5alsG8hyX8i+W4qi3+2Ug==",
      "dev": true,
      "requires": {
        "@babel/helper-explode-as-array": "^7.12.11",
        "@babel/types": "^7.12.13"
      }
    },
    "@babel/helper-compilation-targets": {
      "version": "7.13.16",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.13.16.tgz",
      "integrity": "sha512-3gmkYIrpqsLlieJTgb3daTbide1J036OxfptTG/jk+0z1081r6/O+uhyogcfJPVFre04xbbmryo3berRMb0NAA==",
      "dev": true,
      "requires": {
        "@babel/compat-data": "^7.13.15",
        "@babel/helper-validator-option": "^7.12.17",
        "browserslist": "^4.14.5",
        "semver": "^6.3.0"
      }
    },
    "@babel/helper-create-class-features-plugin": {
      "version": "7.13.11",
      "resolved": "https://registry.npmjs.org/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.13.11.tgz",
      "integrity": "sha512-ays0I7XYqQRR+Uh2hwV5l