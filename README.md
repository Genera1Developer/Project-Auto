file path: settings.html
content: 
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy Settings</title>
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
            <h1>Web Proxy Settings</h1>
            <form id="settings-form">
                <label for="protocol">Protocol</label>
                <select name="protocol">
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                </select>
                <label for="port">Port</label>
                <input type="number" id="port">
                <label for="username">Authentication Username</label>
                <input type="text" id="username">
                <label for="password">Authentication Password</label>
                <input type="password" id="password">
                <label for="bandwidth-limit">Bandwidth Limit (MB/s)</label>
                <input type="number" id="bandwidth-limit">
                <button type="submit">Save Changes</button>
            </form>
        </div>
    </div>

    <script src="/js/settings.js"></script>
</body>

</html>
```