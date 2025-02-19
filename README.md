Based on the project goal, the following files should be added:

FILE PATH: src/index.js
CONTENT: 
```
const { proxyRequest } = require('./proxy.js');
const express = require('express');

const app = express();
const port = 3000;

app.get('/:url', async (req, res) => {
    const url = req.params.url;
    const data = await proxyRequest(url);
    res.send(data);
});

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
```

FILE PATH: index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Web Proxy</title>
</head>
<body>
    <h1>Web Proxy</h1>
    <form action="/">
        <label for="url">URL:</label>
        <input type="text" id="url" name="url">
        <input type="submit" value="Submit">
    </form>
    <div id="result"></div>
</body>
</html>
```

FILE PATH: src/style.css
CONTENT: 
```css
body {
    font-family: Arial, sans-serif;
}

h1 {
    margin-bottom: 1rem;
}

form {
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

label {
    margin-bottom: .2rem;
}

input {
    padding: .5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

#result {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
```

FILE PATH: package.json
CONTENT: 
```json
{
    "name": "web-proxy",
    "version": "1.0.0",
    "description": "A simple web proxy",
    "scripts": {
        "start": "node src/index.js"
    },
    "dependencies": {
        "axios": "^0.27.2",
        "express": "^4.17.3"
    }
}
```