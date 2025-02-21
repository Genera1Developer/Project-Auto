file path: dashboard.html
content: 
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy Dashboard</title>
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
            <h1>Web Proxy Dashboard</h1>
            <section id="connection-status">
                <h2>Connection Status</h2>
                <div id="connection-status-indicator"></div>
                <p id="connection-status-message"></p>
            </section>
            <section id="bandwidth-usage">
                <h2>Bandwidth Usage</h2>
                <canvas id="bandwidth-usage-graph"></canvas>
            </section>
            <section id="active-connections">
                <h2>Active Connections</h2>
                <ul id="active-connections-list"></ul>
            </section>
            <section id="error-log">
                <h2>Error Log</h2>
                <ul id="error-log-list"></ul>
            </section>
            <section id="user-statistics">
                <h2>User Statistics</h2>
                <ul id="user-statistics-list"></ul>
            </section>
        </div>
    </div>
    <script src="/js/dashboard.js"></script>
</body>

</html>
```