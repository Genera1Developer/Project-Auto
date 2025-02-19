file path: api/proxy.js
content: 
```javascript
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

const targetHosts = {
  "google.com": "https://www.google.com",
  "youtube.com": "https://www.youtube.com",
  "facebook.com": "https://www.facebook.com",
  "twitter.com": "https://www.twitter.com",
  "reddit.com": "https://www.reddit.com",
};

for (let host in targetHosts) {
  // Change target to allow for any subdomain in targetHosts[host] to be proxied
  app.use(`/${host}/*`, createProxyMiddleware({
    target: targetHosts[host],
    changeOrigin: true,
    pathRewrite: {
      // Remove the host and trailing slash from the path
      [`^/${host}/`]: "/",
    },
  }));
}

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
```