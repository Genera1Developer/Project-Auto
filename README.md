file: index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/index.css">
</head>

<body>
    <div class="sidebar">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/settings">Settings</a>
    </div>

    <div class="container">
        <div class="login-form">
            <h1>Web Proxy</h1>
            <form action="/login" method="POST">
                <label for="username">Username:</label>
                <input type="text" name="username" id="username">
                <br>
                <label for="password">Password:</label>
                <input type="password" name="password" id="password">
                <br>
                <input type="submit" value="Login">
            </form>
        </div>
    </div>
</body>

</html>
```