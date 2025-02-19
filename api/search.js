Based on the project goal, here is the file:

FILE PATH: views/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/static/style.css" />
  </head>

  <body>
    <h1>Web Proxy</h1>
    <form action="/api/search">
      <input type="text" name="q" placeholder="Search" />
      <input type="submit" value="Search" />
    </form>

    <div id="results"></div>

    <script src="/static/script.js"></script>
  </body>
</html>
```