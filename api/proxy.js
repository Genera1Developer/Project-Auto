file path: api/proxy.js
content: 
```javascript
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

const googleProxy = createProxyMiddleware({
  target: "https://google.com",
  changeOrigin: true,
  pathRewrite: {
    "^/google": "",
  },
});

const youtubeProxy = createProxyMiddleware({
  target: "https://youtube.com",
  changeOrigin: true,
  pathRewrite: {
    "^/youtube": "",
  },
});

const facebookProxy = createProxyMiddleware({
  target: "https://facebook.com",
  changeOrigin: true,
  pathRewrite: {
    "^/facebook": "",
  },
});

app.use("/google", googleProxy);
app.use("/youtube", youtubeProxy);
app.use("/facebook", facebookProxy);

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
```