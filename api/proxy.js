file path: api/proxy.js
content: 
```javascript
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://example.com",
    changeOrigin: true,
  })
);

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
```