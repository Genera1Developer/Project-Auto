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
file: server.js
content: 
```javascript
const express = require("express");
const api = require("./api");
const app = express();
app.use(express.static("public"));
app.use("/api", api);
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```
file: index.html
content: 
```html
<!DOCTYPE html>
<html>
<head>
  <title>Web Proxy</title>
</head>
<body>
  <h1>Web Proxy</h1>
  <form>
    <input type="text" name="query">
    <input type="submit">
  </form>
  <div id="results"></div>
</body>
</html>
```
file: script.js
content: 
```javascript
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = e.target.querySelector("input[name=query]").value;
  const url = `/api/search?query=${query}`;
  const response = await fetch(url);
  const results = await response.text();
  document.querySelector("#results").innerHTML = results;
});
```