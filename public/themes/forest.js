FILE PATH: public/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/css/forest.css" />
  </head>

  <body>
    <h1>Web Proxy</h1>

    <form action="/proxy">
      <label for="url">URL:</label>
      <input type="text" id="url" name="url" />

      <input type="submit" value="Go" />
    </form>

    <div id="result"></div>
  </body>
</html>
```