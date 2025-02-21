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
      <h1>Proxy Configuration</h1>
      <form action="#">
        <label for="protocol">Protocol:</label>
        <select name="protocol" id="protocol">
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
        <br />
        <label for="port">Port:</label>
        <input type="number" name="port" id="port" />
        <br />
        <label for="username">Username:</label>
        <input type="text" name="username" id="username" />
        <br />
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" />
        <br />
        <label for="bandwidth-limit">Bandwidth Limit (MB):</label>
        <input type="number" name="bandwidth-limit" id="bandwidth-limit" />
        <br />
        <input type="submit" value="Save" />
      </form>
    </div>
  </div>

  <script src="js/settings.js"></script>
</body>

</html>
```