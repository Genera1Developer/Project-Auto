FILE PATH: public/index.html
CONTENT:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 0;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    label {
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    textarea {
      width: 100%;
      height: 10rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
    }

    #response-body {
      width: 100%;
      height: 10rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f5f5f5;
      overflow: auto;
    }
  </style>
</head>
<body>
  <form>
    <label for="path">Path:</label>
    <input type="text" id="path">

    <label for="method">Method:</label>
    <input type="text" id="method">

    <label for="request-body">Request Body:</label>
    <textarea id="request-body"></textarea>

    <button type="submit">Send</button>
  </form>

  <div id="response-body"></div>
</body>
</html>
```