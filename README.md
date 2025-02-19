FILE PATH: html/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./css/style.css">
  <title>Web Proxy</title>
</head>
<body>
  <h1>Web Proxy</h1>
  <form action="/proxy" method="POST">
    <input type="text" id="url-input" placeholder="Enter URL">
    <button type="submit" id="submit-button">Submit</button>
  </form>
  <div id="result" style="display: none;">
    <h3 id="result-header">Result:</h3>
    <p id="result-body"></p>
  </div>
  <script src="./js/main.js"></script>
</body>
</html>
```