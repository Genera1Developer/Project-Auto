file path: settings.html
content: 
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Proxy Settings</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="container">
      <div class="sidebar">
        <a href="/index.html">Home</a>
        <a href="/dashboard.html">Dashboard</a>
        <a href="/settings.html">Settings</a>
      </div>
      <div class="content">
        <h1>Proxy Settings</h1>
        <form>
          <label for="proxy-host">Host:</label>
          <input type="text" id="proxy-host" />
          <br />
          <label for="proxy-port">Port:</label>
          <input type="number" id="proxy-port" />
          <br />
          <label for="proxy-protocol">Protocol:</label>
          <select id="proxy-protocol">
            <option value="http">HTTP</option>
            <option value="https">HTTPS</option>
          </select>
          <br />
          <label for="proxy-auth">Authentication:</label>
          <input type="checkbox" id="proxy-auth" />
          <br />
          <label for="proxy-username">Username:</label>
          <input type="text" id="proxy-username" />
          <br />
          <label for="proxy-password">Password:</label>
          <input type="password" id="proxy-password" />
          <br />
          <label for="proxy-bandwidth-limit">Bandwidth Limit (MB):</label>
          <input type="number" id="proxy-bandwidth-limit" />
          <br />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  </body>
</html>

```