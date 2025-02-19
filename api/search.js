file: api/search.js
content: 
```javascript
const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.get("/search", async (req, res) => {
  const query = req.query.query;
  const url = `https://www.google.com/search?q=${query}`;
  const response = await fetch(url);
  res.send(await response.text());
});
module.exports = app;
```
file: api/index.js
content: 
```javascript
const express = require("express");
const search = require("./search");
const app = express();
app.use("/api", search);
module.exports = app;
```