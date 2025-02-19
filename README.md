file: index.html
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

FILE PATH: style.css
CONTENT: body {
    font-family: Arial, Helvetica, sans-serif;
}

h1 {
    text-align: center;
}

form {
    display: flex;
    justify-content: center;
}

input[type="text"] {
    width: 250px;
    height: 30px;
    padding: 5px;
    margin: 5px;
}

input[type="submit"] {
    width: 100px;
    height: 30px;
    margin: 5px;
    background-color: #000;
    color: #fff;
    cursor: pointer;
}

#result {
    width: 100%;
}