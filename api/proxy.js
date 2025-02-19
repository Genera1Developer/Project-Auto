FILE PATH: api/proxy.js
CONTENT: 
```javascript
const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Missing URL parameter");
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
```