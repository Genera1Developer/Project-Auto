FILE PATH: public/index.html
CONTENT:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="style.css" />
  </head>

  <body>
    <h1>Web Proxy</h1>

    <form>
      <label for="url">URL:</label>
      <input type="text" id="url" />

      <label for="method">Method:</label>
      <select id="method">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <label for="request-body">Request Body:</label>
      <textarea id="request-body"></textarea>

      <button type="submit">Send Request</button>
    </form>

    <div id="response-body"></div>
  </body>
</html>
```