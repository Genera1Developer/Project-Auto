file path: index.html
content: 
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy</title>
    <link rel="stylesheet" href="/css/style.css">
</head>

<body>
    <div class="container">
        <div class="sidebar">
            <a href="/index.html" class="sidebar-link">Home</a>
            <a href="/settings.html" class="sidebar-link">Settings</a>
            <a href="/dashboard.html" class="sidebar-link">Dashboard</a>
        </div>
        <div class="main">
            <h1>Proxy</h1>
            <form id="login-form">
                <label for="username">Username</label>
                <input type="text" id="username">
                <label for="password">Password</label>
                <input type="password" id="password">
                <button type="submit">Login</button>
            </form>
            <div class="proxy-status">
                <span>Proxy Status:</span>
                <span class="status"></span>
            </div>
            <div class="error-message"></div>
            <div class="connection-status"></div>
        </div>
    </div>

    <script src="/js/index.js"></script>
</body>

</html>
```