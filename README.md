file: settings.html

content:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings</title>
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
        <h1>Settings</h1>
        <p>Configure your proxy settings here.</p>
        <div class="settings-container">
            <form class="settings-form">
                <div class="error-message" id="error-message"></div>
                <div class="input-container">
                    <div class="input-label">Protocol:</div>
                    <select class="input-field" id="protocol">
                        <option value="HTTP">HTTP</option>
                        <option value="HTTPS">HTTPS</option>
                    </select>
                </div>
                <div class="input-container">
                    <div class="input-label">Port:</div>
                    <input type="number" class="input-field" id="port">
                </div>
                <div class="input-container">
                    <div class="input-label">Authentication:</div>
                    <input type="checkbox" class="input-field" id="authentication">
                </div>
                <div class="input-container" id="authentication-details" style="display: none;">
                    <div class="input-label">Username:</div>
                    <input type="text" class="input-field" id="username">
                </div>
                <div class="input-container" id="authentication-details" style="display: none;">
                    <div class="input-label">Password:</div>
                    <input type="password" class="input-field" id="password">
                </div>
                <div class="input-container">
                    <div class="input-label">Bandwidth Limit:</div>
                    <input type="number" class="input-field" id="bandwidth-limit">
                </div>
                <div class="button-container">
                    <button class="button" id="save-button">Save</button>
                </div>
            </form>
        </div>
    </div>
</body>

</html>
```