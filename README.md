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
    <style>
        body {
            background-color: #e5f1f4;
        }

        .container {
            display: flex;
            flex-direction: row;
            height: 100vh;
        }

        .sidebar {
            background-color: #3b5998;
            padding: 20px;
            width: 250px;
        }

        .sidebar-link {
            color: #fff;
            text-decoration: none;
            margin-bottom: 10px;
            display: block;
        }

        .main {
            flex: 1;
            padding: 20px;
        }

        .form-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
        }

        .form-group {
            margin-bottom: 10px;
        }

        .form-label {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .form-input {
            width: 100%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .btn {
            background-color: #3b5998;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .message-container {
            padding: 10px;
            border-radius: 10px;
        }

        .error {
            background-color: #f44336;
        }

        .success {
            background-color: #4caf50;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="sidebar">
            <a href="/index.html" class="sidebar-link">Home</a>
            <a href="/settings.html" class="sidebar-link">Settings</a>
            <a href="/dashboard.html" class="sidebar-link">Dashboard</a>
        </div>
        <div class="main">
            <div class="form-container">
                <h1>Web Proxy Settings</h1>
                <form action="/settings" method="post">
                    <div class="form-group">
                        <label class="form-label" for="protocol">Protocol:</label>
                        <select class="form-input" name="protocol" id="protocol">
                            <option value="http">HTTP</option>
                            <option value="https">HTTPS</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="port">Port:</label>
                        <input class="form-input" type="number" name="port" id="port">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="auth-username">Authentication Username:</label>
                        <input class="form-input" type="text" name="auth-username" id="auth-username">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="auth-password">Authentication Password:</label>
                        <input class="form-input" type="password" name="auth-password" id="auth-password">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="bandwidth-limit">Bandwidth Limit (MB):</label>
                        <input class="form-input" type="number" name="bandwidth-limit" id="bandwidth-limit">
                    </div>
                    <button class="btn" type="submit">Save Settings</button>
                </form>
            </div>
            <div class="message-container hidden" id="error-message"></div>
            <div class="message-container hidden" id="success-message"></div>
        </div>
    </div>
    <script src="/js/script.js"></script>
</body>

</html>
```
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
    <style>
        body {
            background-color: #e5f1f4;
        }

        .container {
            display: flex;
            flex-direction: row;
            height: 100vh;
        }

        .sidebar {
            background-color: #3b5998;
            padding: 20px;
            width: 250px;
        }

        .sidebar-link {
            color: #fff;
            text-decoration: none;
            margin-bottom: 10px;
            display: block;
        }

        .main {
            flex: 1;
            padding: 20px;
        }

        .card {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        .card-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .chart {
            height: 300px;
            border: 1px solid #ccc;
            border-radius: 10px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th,
        .table td {
            padding: 5px;
            border: 1px solid #ccc;
            text-align: left;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="sidebar">
            <a href="/index.html" class="sidebar-link">Home</a>
            <a href="/settings.html" class="sidebar-link">Settings</a>
            <a href="/dashboard.html" class="sidebar-link">Dashboard</a>
        </div>
        <div class="main">
            <div class="card">
                <div class="card-title">Real-time Connection Status</div>
                <div class="status-indicator status-indicator--online"></div>
                <span>Online</span>
            </div>
            <div class="card">
                <div class="card-title">Bandwidth Usage</div>
                <canvas class="chart" id="bandwidth-chart"></canvas>
            </div>
            <div class="card">
                <div class="card-title">Active Connections</div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>IP Address</th>
                            <th>Port</th>
                            <th>Protocol</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>127.0.0.1</td>
                            <td>80</td>
                            <td>HTTP</td>
                            <td>10 minutes</td>
                        </tr>
                        <tr>
                            <td>192.168.1.1</td>
                            <td>443</td>
                            <td>HTTPS</td>
                            <td>5 minutes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card">
                <div class="card-title">Error Log</div>
                <ul id="error-log">
                    <li>Error 1</li>
                    <li>Error 2</li>
                    <li>Error 3</li>
                </ul>
            </div>
            <div class="card">
                <div class="card-title">User Statistics</div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Total Connections</th>
                            <th>Total Bandwidth</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>user1</td>
                            <td>10</td>
                            <td>100MB</td>
                        </tr>
                        <tr>