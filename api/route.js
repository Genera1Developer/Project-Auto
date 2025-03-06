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
    standardHeaders: true,
    legacyHeaders: false,
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
        proxyReq.setHeader('X-Forwarded-For', req.ip);
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

function sanitizeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        parsedUrl.search = '';
        parsedUrl.hash = '';
        return parsedUrl.toString();
    } catch (e) {
        return null;
    }
}

module.exports = { isValidUrl, sanitizeUrl };
edit filepath: api/auth.js
content: const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Authorization required');
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
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
    "start": "node server.js",
    "test": "jest"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-rate-limit": "^5.5.1",
    "http-proxy-middleware": "^2.0.6",
    "memory-cache": "^0.2.0"
  },
  "devDependencies": {
    "jest": "^27.4.0",
    "supertest": "^6.1.6"
  },
  "engines": {
    "node": ">=14"
  }
}
edit filepath: server.js
content: const express = require('express');
const apiRouter = require('./api/route');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use('/api', apiRouter);
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Server</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to the Proxy Server</h1>
    </header>
    <main>
        <section>
            <p>The proxy server is running. Use it by sending requests to /api with the target URL.</p>
            <p>Example: <code>/api?target=https://www.example.com</code></p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 Proxy Server</p>
    </footer>
</body>
</html>
edit filepath: Dockerfile
content: FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
edit filepath: .dockerignore
content: node_modules
/public/style.css
edit filepath: public/style.css
content: body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
    line-height: 1.6;
}

header {
    background-color: #333;
    color: #fff;
    padding: 1rem 0;
    text-align: center;
}

main {
    padding: 20px;
}

section {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

footer {
    text-align: center;
    padding: 1rem 0;
    background-color: #333;
    color: #fff;
}

code {
    background-color: #eee;
    padding: 2px 5px;
    border-radius: 5px;
}
edit filepath: test/api.test.js
content: const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
    it('should return 200 OK for the root endpoint', async () => {
        const res = await request(app).get('/api');
        expect(res.statusCode).toEqual(200);
    });

    it('should proxy the target URL', async () => {
        const res = await request(app).get('/api?target=https://www.google.com');
        expect(res.statusCode).toEqual(200);
    });

    it('should return 401 for secure endpoint without authentication', async () => {
        const res = await request(app).get('/api/secure');
        expect(res.statusCode).toEqual(401);
    });
});