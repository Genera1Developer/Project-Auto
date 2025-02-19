FILE PATH: public/index.html
CONTENT:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/style.css" />
  </head>

  <body>
    <h1>Web Proxy</h1>
    <form>
      <label for="url">URL:</label>
      <input type="text" name="url" id="url" />

      <label for="method">Method:</label>
      <select name="method" id="method">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <label for="request-body">Request Body:</label>
      <textarea name="request-body" id="request-body"></textarea>

      <button type="submit">Send Request</button>
    </form>

    <div id="response-body"></div>
  </body>
</html>
```
FILE PATH: public/style.css
CONTENT:
```css
body {
  font-family: Arial, sans-serif;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 10rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

#response-body {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #efefef;
}
```