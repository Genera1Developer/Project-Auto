FILE PATH: public/index.html
CONTENT:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Web Proxy</title>
  <link rel="stylesheet" href="/public/style.css" />
</head>
<body>
  <h1>Web Proxy</h1>
  <form>
    <label for="url">URL:</label>
    <input type="text" name="url" id="url" />
    <br />
    <label for="method">Method:</label>
    <select name="method" id="method">
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
    </select>
    <br />
    <label for="request-body">Request Body:</label>
    <textarea name="request-body" id="request-body"></textarea>
    <br />
    <input type="submit" value="Submit" />
  </form>
  <br />
  <div id="response-body"></div>
  <script src="/public/index.js"></script>
</body>
</html>
```