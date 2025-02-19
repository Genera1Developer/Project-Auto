file: public/index.html
content: 
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Web Proxy</title>
  <link rel="stylesheet" href="/styles.css" />
</head>

<body>
  <div id="container">
    <h1>Web Proxy</h1>
    <form id="search-form">
      <input type="text" placeholder="Search..." name="query" />
      <button type="submit">Go</button>
    </form>

    <div id="results">
      <iframe src="" id="iframe"></iframe>
    </div>
  </div>

  <script src="/script.js"></script>
</body>

</html>
```