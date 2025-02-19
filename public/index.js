FILE PATH: public/index.html
CONTENT:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Web Proxy</title>
  </head>
  <body>
    <label for="path">Path:</label>
    <input type="text" id="path"/>

    <label for="method">Method:</label>
    <select id="method">
      <option value="get">GET</option>
      <option value="post">POST</option>
      <option value="put">PUT</option>
      <option value="delete">DELETE</option>
    </select>

    <label for="request-body">Request Body:</label>
    <textarea id="request-body"></textarea>

    <button type="button" id="submit">Submit</button>

    <div id="response-body"></div>
  </body>
</html>
```