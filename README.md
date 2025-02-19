FILE PATH: index.html
CONTENT: 
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="./style.css">
</head>

<body>
  <h1>Web Proxy</h1>

  <form action="./proxy.php" method="POST">
    <label for="url">URL:</label>
    <input type="url" name="url" id="url" required>
    <input type="submit" value="Go">
  </form>

  <div id="result"></div>
</body>

</html>
```