Based on the project goal, what file should be created? Provide the file path and content in the following format:
FILE PATH: views/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <h1>Web Proxy</h1>
    <p>Enter the URL of the website you want to visit:</p>
    <form action="/proxy" method="POST">
        <input type="text" name="url" placeholder="URL">
        <input type="submit" value="Go">
    </form>
    <div id="result"></div>
</body>
</html>
```