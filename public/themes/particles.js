Based on the project goal, the following file should be created:

FILE PATH: public/index.html
CONTENT: ```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/script.js"></script>
</head>
<body>
  <div id="particles-js"></div>
  <div id="container">
    <h1>Web Proxy</h1>
    <form action="/proxy" method="POST">
      <label for="url">URL:</label>
      <input type="text" id="url" name="url">
      <input type="submit" value="Submit">
    </form>
    <div id="result"></div>
  </div>
</body>
</html>
```