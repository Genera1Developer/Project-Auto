Based on the project goal, the following file should be created:

FILE PATH: index.html
CONTENT: <!DOCTYPE html>
<html>
<head>
    <title>Web Proxy</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Web Proxy</h1>
    <form action="/" method="POST">
        <input type="text" name="url" placeholder="Enter URL">
        <input type="submit" value="Fetch">
    </form>
    <div id="result"></div>
    <script src="script.js"></script>
</body>
</html>