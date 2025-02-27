const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { isValidUrl } = require('./utils');
const basicAuth = require('./auth');
const cache = require('memory-cache');

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

        if (!isValidUrl(targetUrl)) {
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
        const cacheKey = req.originalUrl;
        const cacheTtl = 300;

        if (req.method === 'GET' && res.statusCode === 200) {
            const bodyChunks = [];
            proxyRes.on('data', (chunk) => {
                bodyChunks.push(chunk);
            });

            proxyRes.on('end', () => {
                const responseBody = Buffer.concat(bodyChunks).toString('utf8');
                cache.put(cacheKey, responseBody, cacheTtl * 1000);
            });
        }
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);
    },
};

const myProxy = createProxyMiddleware(proxyOptions);

router.use(cors());
router.use(limiter);

router.get('/', (req, res) => {
    res.send('Proxy server running. Provide target URL via X-Target-URL header or ?target= parameter.');
});

router.use('/secure', basicAuth, (req, res, next) => {
    const cacheKey = req.originalUrl;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
        res.send(cachedResponse);
    } else {
        myProxy(req, res, next);
    }
});

router.use('/', (req, res, next) => {
    const cacheKey = req.originalUrl;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
        res.send(cachedResponse);
    } else {
        myProxy(req, res, next);
    }
});

module.exports = router;
edit filepath: api/utils.js
content: function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = { isValidUrl };
edit filepath: api/auth.js
content: const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Authorization required');
    }

    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    if (user === 'admin' && pass === 'password') {
        return next();
    } else {
        return res.status(401).send('Invalid credentials');
    }
};

module.exports = basicAuth;
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
    "express-rate-limit": "^5.5.1",
    "http-proxy-middleware": "^2.0.6",
    "memory-cache": "^0.2.0"
  },
  "devDependencies": {},
  "engines": {
    "node": ">=14"
  }
}
edit filepath: server.js
content: const express = require('express');
const apiRouter = require('./api/route');

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Proxy Server</title>
</head>
<body>
    <h1>Welcome to the Proxy Server</h1>
    <p>The proxy server is running. Use it by sending requests to /api with the target URL.</p>
</body>
</html>
edit filepath: Dockerfile
content: FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
edit filepath: .dockerignore
content: node_modules
edit filepath: README.md
content: # Node.js Proxy Server
edit filepath: CONTRIBUTING.md
content: # Contributing to Node.js Proxy Server

We welcome contributions to the Node.js Proxy Server project! Here's how you can contribute:

## Reporting Issues

If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/your-username/your-repo). When reporting issues, please provide as much detail as possible, including:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Relevant error messages or logs

## Contributing Code

We accept code contributions via pull requests. To contribute code:

1.  Fork the repository on GitHub.
2.  Create a new branch for your changes.
3.  Make your changes, following the project's coding conventions.
4.  Write tests for your changes.
5.  Ensure all tests pass.
6.  Commit your changes with clear, concise commit messages.
7.  Push your branch to your forked repository.
8.  Create a pull request to the main repository.

Your pull request will be reviewed by a maintainer. Please be patient and responsive to any feedback.

## Coding Conventions

Please follow these coding conventions:

-   Use consistent indentation (e.g., 4 spaces).
-   Write clear and concise code.
-   Use meaningful variable and function names.
-   Document your code with comments where necessary.
-   Follow the existing code style.

## Testing

We use [testing framework] for testing. Please write tests for any new code you contribute. Ensure that all tests pass before submitting a pull request.

## Documentation

If you add or change any features, please update the documentation accordingly.

## License

By contributing to this project, you agree that your contributions will be licensed under the [License Name] license.

Thank you for your contributions!