file path: index.html
content:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Web Proxy</title>
  <link rel="stylesheet" href="css/style.css" />
  <style>
    body {
      background-color: #e0f2f1;
    }

    .container {
      display: flex;
      height: 100vh;
    }

    .sidebar {
      width: 200px;
      padding: 20px;
      background-color: #3498db;
      color: white;
      border-right: 1px solid #000;
    }

    .sidebar-link {
      display: block;
      margin-bottom: 10px;
      font-size: 1.2rem;
      text-decoration: none;
      color: white;
    }

    .sidebar-link:hover {
      color: #e0f2f1;
    }

    .main {
      flex: 1;
      padding: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    h1 {
      margin-top: 0;
    }

    label {
      font-weight: bold;
    }

    input {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    select {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 200px;
    }

    button {
      padding: 5px 10px;
      border: 1px solid #3498db;
      border-radius: 5px;
      background-color: #3498db;
      color: white;
    }

    button:hover {
      background-color: #e0f2f1;
      border-color: #e0f2f1;
    }

    .error {
      color: red;
    }

    .success {
      color: green;
    }

    .status {
      font-weight: bold;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }

    .loading-text {
      font-size: 2rem;
      margin-right: 10px;
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
      <div class="main-content">
        <h1>Web Proxy</h1>
        <p>This is a simple web proxy that allows you to browse the web anonymously. Enter a URL below to get started.</p>
        <form id="proxy-form">
          <label for="url">URL:</label>
          <input type="text" name="url" id="url" required />
          <br />
          <button type="submit">Go</button>
        </form>
      </div>
      <div class="proxy-status">
        <h2>Proxy Status</h2>
        <span class="status"></span>
      </div>
      <div class="connection-status">
        <h2>Connection Status</h2>
        <span class="status"></span>
      </div>
    </div>
  </div>

  <script src="js/index.js"></script>
</body>

</html>
```

file path: settings.html
content:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Settings</title>
  <link rel="stylesheet" href="css/style.css" />
  <style>
    body {
      background-color: #e0f2f1;
    }

    .container {
      display: flex;
      height: 100vh;
    }

    .sidebar {
      width: 200px;
      padding: 20px;
      background-color: #3498db;
      color: white;
      border-right: 1px solid #000;
    }

    .sidebar-link {
      display: block;
      margin-bottom: 10px;
      font-size: 1.2rem;
      text-decoration: none;
      color: white;
    }

    .sidebar-link:hover {
      color: #e0f2f1;
    }

    .main {
      flex: 1;
      padding: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    h1 {
      margin-top: 0;
    }

    label {
      font-weight: bold;
    }

    input {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    select {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 200px;
    }

    button {
      padding: 5px 10px;
      border: 1px solid #3498db;
      border-radius: 5px;
      background-color: #3498db;
      color: white;
    }

    button:hover {
      background-color: #e0f2f1;
      border-color: #e0f2f1;
    }

    .error {
      color: red;
    }

    .success {
      color: green;
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
      <h1>Settings</h1>
      <form id="settings-form">
        <label for="protocol">Protocol:</label>
        <select name="protocol" id="protocol">
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
        <br />
        <label for="port">Port:</label>
        <input type="text" name="port" id="port" required />
        <br />
        <label for="username">Username:</label>
        <input type="text" name="username" id="username" />
        <br />
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" />
        <br />
        <label for="bandwidth-limit">Bandwidth Limit (MB/s):</label>
        <input type="number" name="bandwidth-limit" id="bandwidth-limit" />
        <br />
        <button type="submit">Save</button>
      </form>
      <div class="error"></div>
      <div class="success"></div>
    </div>
  </div>

  <script src="js/settings.js"></script>
</body>

</html>
```

file path: dashboard.html
content:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="css/style.css" />
  <style>
    body {
      background-color