**File Structure:**

- api/proxy.js
- package.json
- README.md
- api/static/index.html

**api/proxy.js:**

```js
const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;

  try {
    const response = await axios.get(targetUrl);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching URL.");
  }
});

app.use(express.static("api/static"));

app.listen(port, () => {
  console.log(`Web proxy listening on port ${port}`);
});
```