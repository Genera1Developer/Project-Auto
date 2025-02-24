file path: index.html
content: 
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy</title>
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

        .form-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
        }

        .form-group {
            margin-bottom: 10px;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
        }

        .form-input {
            width: 100%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .button-container {
            margin-top: 10px;
        }

        .button {
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #3498db;
            color: white;
            cursor: pointer;
        }

        .button:hover {
            background-color: #2980b9;
        }

        .error-message {
            color: red;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .success-message {
            color: green;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
        }

        .online {
            background-color: green;
        }

        .offline {
            background-color: red;
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
        <h1>Proxy</h1>
        <p>Connect to the web anonymously and securely with our advanced proxy service.</p>
        <div class="form-container">
            <form action="/login" method="post">
                <div class="form-group">
                    <label class="form-label" for="username">Username</label>
                    <input class="form-input" type="text" name="username" id="username">
                </div>
                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input class="form-input" type="password" name="password" id="password">
                </div>
                <div class="button-container">
                    <button class="button" type="submit">Login</button>
                </div>
            </form>
        </div>
    </div>
</body>

</html>
```

file path: settings.html
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

        .form-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
        }

        .form-group {
            margin-bottom: 10px;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
        }

        .form-input {
            width: 100%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .button-container {
            margin-top: 10px;
        }

        .button {
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #3498db;
            color: white;
            cursor: pointer;
        }

        .button:hover {
            background-color: #2980b9;
        }

        .error-message {
            color: red;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .success-message {
            color: green;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
        }

        .online {
            background-color: green;
        }

        .offline {
            background-color: red;
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
        <p>Configure your proxy settings below.</p>
        <div class="form-container">
            <form action="/settings/update" method="post">
                <div class="form-group">
                    <label class="form-label" for="protocol">Protocol</label>
                    <select class="form-input" name="protocol" id="protocol">
                        <option value="HTTP">HTTP</option>
                        <option value="HTTPS">HTTPS</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="port">Port</label>
                    <input class="form-input" type="number" name="port" id="port" min="0" max="65535">
                </div>
                <div class="form-group">
                    <label class="form-label" for="authentication">Authentication</label>
                    <input class="form-input" type="checkbox" name="authentication" id="authentication">
                </div>
                <div class="form-group">
                    <label class="form-label" for="username">Username</label>
                    <input class="form-input" type="text" name="username" id="username" disabled>