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

        .settings-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
        }

        .settings-section {
            margin-bottom: 20px;
        }

        .settings-section-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .settings-section-content {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
        }

        .input-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .input-label {
            width: 150px;
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
        <p>Configure your proxy settings to match your requirements.</p>
        <div class="settings-container">
            <div class="settings-section">
                <div class="settings-section-title">Protocol</div>
                <div class="settings-section-content">
                    <div class="input-container">
                        <div class="input-label">Protocol:</div>
                        <select class="input-field">
                            <option value="http">HTTP</option>
                            <option value="https">HTTPS</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="settings-section">
                <div class="settings-section-title">Port</div>
                <div class="settings-section-content">
                    <div class="input-container">
                        <div class="input-label">Port:</div>
                        <input type="number" class="input-field" value="8080">
                    </div>
                </div>
            </div>
            <div class="settings-section">
                <div class="settings-section-title">Authentication</div>
                <div class="settings-section-content">
                    <div class="input-container">
                        <div class="input-label">Username:</div>
                        <input type="text" class="input-field">
                    </div>
                    <div class="input-container">
                        <div class="input-label">Password:</div>
                        <input type="password" class="input-field">
                    </div>
                </div>
            </div>
            <div class="settings-section">
                <div class="settings-section-title">Bandwidth Limits</div>
                <div class="settings-section-content">
                    <div class="input-container">
                        <div class="input-label">Daily Limit (MB):</div>
                        <input type="number" class="input-field">
                    </div>
                    <div class="input-container">
                        <div class="input-label">Monthly Limit (GB):</div>
                        <input type="number" class="input-field">
                    </div>
                </div>
            </div>
            <div class="button-container">
                <button class="button">Save</button>
            </div>
        </div>
    </div>
</body>

</html>
```