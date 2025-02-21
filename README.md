file path: index.html
content: 
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy</title>
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
            <h1>Web Proxy</h1>
            <section id="login">
                <h2>Login</h2>
                <form id="login-form">
                    <label for="username">Username:</label>
                    <input type="text" id="username">
                    <br>
                    <label for="password">Password:</label>
                    <input type="password" id="password">
                    <br>
                    <button type="submit">Login</button>
                </form>
            </section>
            <section id="proxy-status">
                <h2>Proxy Status</h2>
                <div id="proxy-status-indicator"></div>
                <p id="proxy-status-message"></p>
            </section>
            <section id="connection-status">
                <h2>Connection Status</h2>
                <div id="connection-status-indicator"></div>
                <p id="connection-status-message"></p>
            </section>
            <section id="error-message">
                <h2>Error Message</h2>
                <p id="error-message-text"></p>
            </section>
        </div>
    </div>
    <script src="/js/index.js"></script>
</body>

</html>
```