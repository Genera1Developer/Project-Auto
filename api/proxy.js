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

app.use("/google", googleProxy);
app.use("/youtube", youtubeProxy);

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
```