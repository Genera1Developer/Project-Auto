FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const url = e.target.querySelector('input[name="url"]').value;
  const method = e.target.querySelector('select[name="method"]').value;
  const body = e.target.querySelector('textarea[name="body"]').value;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });

  const responseBody = await response.text();

  document.querySelector('#response-body').textContent = responseBody;
});
```
FILE PATH: public/index.html
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
  <form>
    <label for="url">URL:</label>
    <input type="text" name="url" id="url">

    <label for="method">Method:</label>
    <select name="method" id="method">
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
    </select>

    <label for="body">Body:</label>
    <textarea name="body" id="body"></textarea>

    <button type="submit">Submit</button>
  </form>

  <div id="response-body"></div>
</body>
</html>
```