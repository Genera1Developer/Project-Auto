**File: adblocker/curseblock.js**

```javascript
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import logger from '../logger';

const curseblock = () => {
  const proxy = createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/(api|static|serverless|dist)/.*': '$1', // rewrite requests to /api, /static, or /serverless on the target server
    },
    onProxyRes: responseInterceptor((proxyRes, req, res) => {
      const ignoredPaths = [
        // Add additional paths to be ignored here
        '/favicon.ico',
        '/robots.txt',
        '/static/js/main.js',
        '/static/css/main.css',
        '/api/swr/getCurrentUserData',
        '/dist/static/js/main.js',
        '/dist/static/css/main.css',
      ];

      // Block ADS routes
      if (req.path.includes('/ads')) {
        proxyRes.statusCode = 404;
        proxyRes.end();
        return;
      }

      // Do not block ignored paths
      if (ignoredPaths.includes(req.path)) {
        return;
      }

      // Block paths that do not start with '/'
      if (!req.path.startsWith('/')) {
        proxyRes.statusCode = 404;
        proxyRes.end();
        return;
      }

      // Fix issues where Content-Security-Policy and X-Frame-Options response headers
      // cause issues on the client side
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['x-frame-options'];

      // Handle CORS issues
      res.setHeader('Access-Control-Allow-Origin', '*');
    }),
    onError: (err, req, res) => {
      logger.error(err);
      res.statusCode = 500;
      res.end();
    },
  });

  return proxy;
};

export default curseblock;
```