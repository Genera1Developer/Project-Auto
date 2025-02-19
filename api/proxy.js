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

const googleProxy = createProxyMiddleware(options);
const youtubeProxy = createProxyMiddleware({...options, target: "https://youtube.com"});
const facebookProxy = createProxyMiddleware({...options, target: "https://facebook.com"});
const twitterProxy = createProxyMiddleware({...options, target: "https://twitter.com"});
const redditProxy = createProxyMiddleware({...options, target: "https://reddit.com"});

app.use("/google", googleProxy);
app.use("/youtube", youtubeProxy);
app.use("/facebook", facebookProxy);
app.use("/twitter", twitterProxy);
app.use("/reddit", redditProxy);

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
```