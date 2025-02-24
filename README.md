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

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
        }

        .status-indicator--online {
            background-color: #00ff00;
        }

        .status-indicator--offline {
            background-color: #ff0000;
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
                <h1>Web Proxy</h1>
                <div class="form-group">
                    <label class="form-label" for="username">Username:</label>
                    <input class="form-input" type="text" id="username">
                </div>
                <div class="form-group">
                    <label class="form-label" for="password">Password:</label>
                    <input class="form-input" type="password" id="password">
                </div>
                <button class="btn" type="submit" id="login-btn">Login</button>
            </div>
            <div class="message-container hidden" id="error-message"></div>
            <div class="message-container hidden" id="success-message"></div>
        </div>
    </div>
    <script src="/js/script.js"></script>
</body>

</html>
```