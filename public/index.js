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
    <div class="container">
      <h1>Web Proxy</h1>
      <p>
        Enter the URL of the website you want to access, select the request
        method, and optionally provide a request body.
      </p>
      <form>
        <label for="url">URL:</label>
        <input type="text" id="url" name="url" required />
        <br />
        <label for="method">Method:</label>
        <select name="method" id="method">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <br />
        <label for="body">Request Body (optional):</label>
        <br />
        <textarea name="body" id="body" rows="4" cols="50"></textarea>
        <br />
        <input type="submit" value="Send" />
      </form>

      <div class="result"></div>
    </div>
  </body>
</html>
```