FILE PATH: views/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Web Proxy</h1>
  <form action="/proxy" method="POST">
    <label for="url">URL:</label>
    <input type="text" name="url" id="url">
    <input type="submit" value="Submit">
  </form>
  <div id="result"></div>
  <script src="script.js"></script>
</body>
</html>
```