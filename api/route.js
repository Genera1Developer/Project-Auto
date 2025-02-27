const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const URL = require('url');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: 'Too many requests, please try again later.',
});

const proxyOptions = {
    router: (req) => {
        let targetUrl = req.headers['x-target-url'] || req.query.target;

        if (!targetUrl) {
            console.log('No target URL provided. Defaulting to Google.');
            targetUrl = 'https://www.google.com';
        }

        try {
            new URL(targetUrl);
        } catch (error) {
            console.error('Invalid target URL:', targetUrl);
            return null;
        }

        console.log(`Proxying to: ${targetUrl}`);
        return targetUrl;
    },
    changeOrigin: true,
    logLevel: 'info',
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy Error');
    },
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['X-Proxy-By'] = 'Node-Proxy';
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);
    },
    /*
    *   Implement this.
    *   https://github.com/chimurai/http-proxy-middleware/blob/v2.0.0/recipes/modify-response.md
    *   https://www.npmjs.com/package/http-proxy-middleware
    *   https://www.npmjs.com/package/http-proxy-middleware#options
    *
    selfHandleResponse: true,
    onProxyRes: (proxyRes, req, res) => {
        let responseBody = [];
        proxyRes.on('data', (chunk) => {
            responseBody.push(chunk);
        });

        proxyRes.on('end', () => {
            responseBody = Buffer.concat(responseBody).toString('utf8');
            // Modify response body here
            const modifiedResponseBody = responseBody.replace(/example/g, 'replaced');

            res.status(proxyRes.statusCode);
            Object.keys(proxyRes.headers).forEach((key) => {
                res.setHeader(key, proxyRes.headers[key]);
            });
            res.setHeader('Content-Length', Buffer.byteLength(modifiedResponseBody, 'utf8'));
            res.end(modifiedResponseBody);
        });
    },
    */
};

const myProxy = createProxyMiddleware(proxyOptions);

router.use(cors());
router.use(limiter);
router.get('/', (req, res) => {
    res.send('Proxy server running. Provide target URL via X-Target-URL header or ?target= parameter.');
});
router.use('/', myProxy);

module.exports = router;
edit filepath: package.json
content: {
  "name": "node-proxy",
  "version": "1.0.0",
  "description": "A simple Node.js proxy server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-rate-limit": "^5.5.0",
    "http-proxy-middleware": "^2.0.6"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  },
  "keywords": [
    "proxy",
    "node",
    "express"
  ],
  "author": "Bard",
  "license": "MIT"
}
edit filepath: server.js
content: const express = require('express');
const apiRoute = require('./api/route');
const app = express();
const port = process.env.PORT || 3000;

app.use('/api', apiRoute);

app.get('/', (req, res) => {
    res.send('Proxy server is running. Access the proxy via the /api route.');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
edit filepath: .gitignore
content: node_modules/
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Proxy Server</title>
</head>
<body>
    <h1>Welcome to the Proxy Server</h1>
    <p>The proxy server is running. You can access it via the <code>/api</code> route.</p>
</body>
</html>
edit filepath: public/style.css
content: body {
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
}
edit filepath: public/script.js
content: // Optional: Add some client-side scripting here if needed
console.log('Proxy server page loaded.');
edit filepath: README.md
content: # Node.js Proxy Server

A simple Node.js proxy server built with Express.

## Features

- Proxies requests to a specified target URL.
- Includes rate limiting to prevent abuse.
- Uses CORS for cross-origin requests.

## Usage

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run the server: `npm start`

The proxy server will be running on port 3000.

Access the proxy via the `/api` route, providing the target URL via the `X-Target-URL` header or the `?target=` parameter.

## Configuration

-   Rate limiting: configured in `api/route.js`.
-   Default target URL: configured in `api/route.js`.

## Dependencies

-   express
-   http-proxy-middleware
-   express-rate-limit
-   cors
edit filepath: error_handler.js
content: function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

module.exports = errorHandler;
edit filepath: api/utils.js
content: function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { isValidUrl };
edit filepath: api/auth.js
content: const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const user = auth[0];
        const pass = auth[1];

        if (user === 'proxyuser' && pass === 'proxypassword') {
            return next();
        }
    }

    res.status(401).set('WWW-Authenticate', 'Basic realm="Proxy Authentication Required"').send('Authentication required.');
};

module.exports = basicAuth;