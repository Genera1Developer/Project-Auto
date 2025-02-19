**File: adblocker/curseblock.js**

```javascript
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

const curseblock = () => {
  const proxy = createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/api/.*': '/api', // rewrite api requests to /api on the target server
    },
    onProxyRes: responseInterceptor(
      (proxyRes, req, res) => {
        if (req.path.includes('/ads')) {
          proxyRes.statusCode = 404;
          proxyRes.end();
        }
      }
    ),
  });

  return proxy;
};

export default curseblock;
```