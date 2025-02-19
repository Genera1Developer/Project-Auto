FILE PATH: views/search.ejs
CONTENT: 
```html
<!DOCTYPE html>
<html>
<head>
  <title>Proxy Search</title>
</head>
<body>
  <form action="/api/search" method="POST">
    <label for="query">Search Query:</label>
    <input type="text" id="query" name="query">
    <input type="submit" value="Search">
  </form>
  <div id="results"></div>
</body>
</html>
```