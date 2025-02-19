FILE PATH: public/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="./style.css" />
  </head>

  <body>
    <h1>Web Proxy</h1>

    <form action="/proxy" method="POST">
      <label for="url">URL:</label>
      <input type="text" id="url" name="url" />

      <label for="method">Method:</label>
      <select id="method" name="method">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
      </select>

      <label for="body">Body:</label>
      <textarea id="body" name="body"></textarea>

      <button type="submit">Proxy</button>
    </form>
  </body>
</html>
```