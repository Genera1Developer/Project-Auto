FILE PATH: public/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/style.css" />
  </head>

  <body>
    <h1>Web Proxy</h1>
    <form action="/api/search" method="GET">
      <label for="url">URL:</label>
      <input type="text" id="url" name="url" />
      <label for="query">Query:</label>
      <input type="text" id="query" name="query" />
      <button type="submit">Search</button>
    </form>

    <div id="results"></div>

    <script src="/script.js"></script>
  </body>
</html>
```