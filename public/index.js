FILE PATH: public/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
  </head>
  <body>
    <h1>Web Proxy</h1>
    <form action="/proxy" method="POST">
      <label for="url">URL:</label>
      <input type="text" id="url" name="url" />
      <br />
      <label for="method">Method:</label>
      <select id="method" name="method">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      <br />
      <label for="headers">Headers:</label>
      <textarea id="headers" name="headers"></textarea>
      <br />
      <label for="body">Body:</label>
      <textarea id="body" name="body"></textarea>
      <br />
      <input type="submit" value="Submit" />
    </form>
  </body>
</html>
```