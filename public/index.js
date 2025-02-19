FILE PATH: public/index.html
CONTENT:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
</head>
<body>
  <h1>Web Proxy</h1>
  <form action="/proxy" method="POST">
    <label for="url">URL:</label>
    <input type="text" name="url" id="url">
    <br>
    <label for="method">Method:</label>
    <select name="method" id="method">
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
    </select>
    <br>
    <label for="body">Body:</label>
    <textarea name="body" id="body"></textarea>
    <br>
    <input type="submit" value="Submit">
  </form>
  <br>
  <div id="result"></div>
</body>
</html>
```