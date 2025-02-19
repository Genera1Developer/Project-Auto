FILE PATH: views/proxy.ejs
CONTENT: 
```html
<!DOCTYPE html>
<html>
<head>
  <title>Proxy Server</title>
</head>
<body>
  <h1>Proxy Server</h1>
  <form action="/api/proxy" method="POST">
    <label for="url">URL:</label>
    <input type="text" id="url" name="url">
    <input type="submit" value="Proxy">
  </form>
  <div id="results"></div>
</body>
</html>
```