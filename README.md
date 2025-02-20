file path: settings.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy - Settings</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div class="wrapper">
    <div class="sidebar">
      <a href="/index.html">Home</a>
      <a href="/dashboard.html">Dashboard</a>
      <a href="/settings.html">Settings</a>
    </div>
    <div class="main">
      <h1>Settings</h1>
      <form id="settings-form">
        <div class="form-group">
          <label for="protocol">Protocol</label>
          <select name="protocol" id="protocol">
            <option value="HTTP">HTTP</option>
            <option value="HTTPS">HTTPS</option>
          </select>
        </div>
        <div class="form-group">
          <label for="port">Port</label>
          <input type="number" name="port" id="port" placeholder="8080">
        </div>
        <div class="form-group">
          <label for="auth-user">Authentication User</label>
          <input type="text" name="auth-user" id="auth-user" placeholder="Username">
        </div>
        <div class="form-group">
          <label for="auth-password">Authentication Password</label>
          <input type="password" name="auth-password" id="auth-password" placeholder="Password">
        </div>
        <div class="form-group">
          <label for="bandwidth-limit">Bandwidth Limit (MB/s)</label>
          <input type="number" name="bandwidth-limit" id="bandwidth-limit" placeholder="10">
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>
  </div>

  <script>
    const settingsForm = document.getElementById('settings-form');

    const saveSettings = (e) => {
      e.preventDefault();

      const protocol = document.getElementById('protocol').value;
      const port = document.getElementById('port').value;
      const authUser = document.getElementById('auth-user').value;
      const authPassword = document.getElementById('auth-password').value;
      const bandwidthLimit = document.getElementById('bandwidth-limit').value;

      // TODO: Implement saving settings to storage

      alert('Settings saved successfully!');
    };

    settingsForm.addEventListener('submit', saveSettings);
  </script>
</body>
</html>
```