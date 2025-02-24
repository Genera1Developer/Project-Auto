file: index.html

content:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy</title>
    <link rel="stylesheet" href="./css/main.css">
    <script src="./js/main.js"></script>
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

        .login-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
        }

        .login-form {
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

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #ff0000;
            margin-right: 5px;
        }

        .connection-status {
            display: flex;
            align-items: center;
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
        <h1>Web Proxy</h1>
        <p>Use this proxy to access websites securely and privately.</p>
        <div class="login-container">
            <form class="login-form">
                <div class="input-container">
                    <div class="input-label">Username:</div>
                    <input type="text" class="input-field" id="username">
                </div>
                <div class="input-container">
                    <div class="input-label">Password:</div>
                    <input type="password" class="input-field" id="password">
                </div>
                <div class="button-container">
                    <button class="button" id="login-button">Login</button>
                </div>
                <div class="error-message" id="error-message"></div>
            </form>
        </div>
        <div class="connection-status">
            <div class="status-indicator" id="status-indicator"></div>
            <span id="connection-status">Disconnected</span>
        </div>
    </div>
</body>

</html>
```