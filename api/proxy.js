file path: api/proxy.js
content: 
```javascript
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

const options = {
  target: "https://google.com",
  changeOrigin: true,
  pathRewrite: {
    "^/google": "",
  },
};

app.use("/google", createProxyMiddleware(options));
app.use("/youtube", createProxyMiddleware({...options, target: "https://youtube.com"}));
app.use("/facebook", createProxyMiddleware({...options, target: "https://facebook.com"}));
app.use("/twitter", createProxyMiddleware({...options, target: "https://twitter.com"}));
app.use("/reddit", createProxyMiddleware({...options, target: "https://reddit.com"}));

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
```