FILE PATH: public/index.html
CONTENT:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Web Proxy</h1>

    <form>
      <label for="path">Path</label>
      <input id="path" type="text" />

      <label for="method">Method</label>
      <input id="method" type="text" />

      <label for="request-body">Request Body</label>
      <textarea id="request-body"></textarea>

      <input type="submit" value="Send" />
    </form>

    <div id="response-body"></div>
  </body>
</html>
```