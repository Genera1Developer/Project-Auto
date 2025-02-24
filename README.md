file: settings.html

content:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy - Settings</title>
    <link rel="stylesheet" href="./css/main.css">
    <script src="./js/settings.js"></script>
    <style>
        body {
            background-color: #e0f2f1;
            font-family: Arial, sans-serif;
        }

        .sidebar {
            width: 200px;
            float: left;
            background-color: #3498db;
            padding: 20px;
            border-radius: 10px;
        }

        .sidebar a {
            display: block;
            color: white;
            text-decoration: none;
            padding: 10px;
        }

        .sidebar a:hover {
            background-color: #2980b9;
        }

        .content {
            margin-left: 220px;
        }

        .settings-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
        }

        .settings-form {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .input-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .input-label {
            width: 100px;
        }

        .input-field {
            width: 200px;
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        .select-field {
            width: 200px;
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        .button-container {
            text-align: right;
        }

        .button {
            padding: 5px 10px;
            border-radius: 5px;
            background-color: #3498db;
            color: white;
        }

        .button:hover {
            background-color: #2980b9;
        }

        .error-message {
            color: red;
            font-weight: bold;
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <div class="sidebar">
        <a href="/index.html">Proxy</a>
        <a href="/settings.html">Settings</a>
        <a href="/dashboard.html">Dashboard</a>
    </div>
    <div class="content">
        <h1>Web Proxy - Settings</h1>
        <p>Configure the proxy settings here.</p>
        <div class="settings-container">
            <form class="settings-form">
                <div class="input-container">
                    <div class="input-label">Proxy Type:</div>
                    <select class="select-field" id="proxy-type">
                        <option value="http">HTTP</option>
                        <option value="https">HTTPS</option>
                    </select>
                </div>
                <div class="input-container">
                    <div class="input-label">Port:</div>
                    <input type="number" class="input-field" id="port" value="8080">
                </div>
                <div class="input-container">
                    <div class="input-label">Username:</div>
                    <input type="text" class="input-field" id="username">
                </div>
                <div class="input-container">
                    <div class="input-label">Password:</div>
                    <input type="password" class="input-field" id="password">
                </div>
                <div class="input-container">
                    <div class="input-label">Bandwidth Limit (MB):</div>
                    <input type="number" class="input-field" id="bandwidth-limit">
                </div>
                <div class="button-container">
                    <button class="button" id="save-settings-button">Save Settings</button>
                </div>
                <div class="error-message" id="error-message"></div>
            </form>
        </div>
    </div>
</body>

</html>
```

file: dashboard.html

content:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy - Dashboard</title>
    <link rel="stylesheet" href="./css/main.css">
    <script src="./js/dashboard.js"></script>
    <style>
        body {
            background-color: #e0f2f1;
            font-family: Arial, sans-serif;
        }

        .sidebar {
            width: 200px;
            float: left;
            background-color: #3498db;
            padding: 20px;
            border-radius: 10px;
        }

        .sidebar a {
            display: block;
            color: white;
            text-decoration: none;
            padding: 10px;
        }

        .sidebar a:hover {
            background-color: #2980b9;
        }

        .content {
            margin-left: 220px;
        }

        .dashboard-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
        }

        .realtime-status {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .realtime-status-label {
            width: 100px;
            font-weight: bold;
        }

        .realtime-status-value {
            width: 200px;
        }

        .graph-container {
            margin-bottom: 20px;
        }

        .graph-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .graph-wrapper {
            width: 200px;
            height: 100px;
        }

        .active-connections-heading {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .active-connections-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .active-connections-list-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }

        .active-connections-list-item-ip {
            width: 100px;
        }

        .active-connections-list-item-time {
            width: 100px;
        }

        .error-log-heading {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .error-log-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .error-log-list-item {
            margin-bottom: 5px;
        }

        .user-statistics-heading {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .user-statistics-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .user-statistics-list-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }

        .user-statistics-list-item-username {
            width: 100px;
        }

        .user-statistics-list-item-bandwidth {
            width: 100px;
        }
    </style>
</head>

<body>
    <div class