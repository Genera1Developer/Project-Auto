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
      <form action="#">
        <h2>Proxy Configuration</h2>
        <label for="protocol">Protocol:</label>
        <select name="protocol" id="protocol">
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
        <br />
        <label for="port">Port:</label>
        <input type="number" name="port" id="port" required />
        <br />
        <h2>Authentication</h2>
        <label for="username">Username:</label>
        <input type="text" name="username" id="username" required />
        <br />
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required />
        <br />
        <h2>Bandwidth Limits</h2>
        <label for="download-limit">Download Limit (KB/s):</label>
        <input type="number" name="download-limit" id="download-limit" />
        <br />
        <label for="upload-limit">Upload Limit (KB/s):</label>
        <input type="number" name="upload-limit" id="upload-limit" />
        <br />
        <input type="submit" value="Save" />
      </form>
    </div>
  </div>

  <script src="js/settings.js"></script>
</body>

</html>
```