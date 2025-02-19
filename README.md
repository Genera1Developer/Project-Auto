FILE PATH: index.html
CONTENT: <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Web Proxy</h1>
  <form action="proxy.py" method="POST">
    <label for="url">URL:</label>
    <input type="text" id="url" name="url">
    <input type="submit" value="Go">
  </form>
  <div id="result"></div>
  <script src="script.js"></script>
</body>
</html>