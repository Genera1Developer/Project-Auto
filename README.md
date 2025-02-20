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
      <div class="settings-container">
        <form action="" method="post">
          <div class="row">
            <label for="protocol">Protocol:</label>
            <select name="protocol" id="protocol">
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
            </select>
          </div>
          <div class="row">
            <label for="port">Port:</label>
            <input type="number" name="port" id="port" placeholder="Enter port number">
          </div>
          <div class="row">
            <label for="username">Username:</label>
            <input type="text" name="username" id="username" placeholder="Enter username">
          </div>
          <div class="row">
            <label for="password">Password:</label>
            <input type="password" name="password" id="password" placeholder="Enter password">
          </div>
          <div class="row">
            <label for="bandwidth-limit">Bandwidth limit:</label>
            <input type="number" name="bandwidth-limit" id="bandwidth-limit" placeholder="Enter bandwidth limit in MB">
          </div>
          <div class="row">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script>
    const protocolSelect = document.getElementById('protocol');
    const portInput = document.getElementById('port');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const bandwidthLimitInput = document.getElementById('bandwidth-limit');

    const settings = {
      protocol: protocolSelect.value,
      port: portInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      bandwidthLimit: bandwidthLimitInput.value
    };

    const updateSettings = () => {
      settings.protocol = protocolSelect.value;
      settings.port = portInput.value;
      settings.username = usernameInput.value;
      settings.password = passwordInput.value;
      settings.bandwidthLimit = bandwidthLimitInput.value;
    };

    protocolSelect.addEventListener('change', updateSettings);
    portInput.addEventListener('input', updateSettings);
    usernameInput.addEventListener('input', updateSettings);
    passwordInput.addEventListener('input', updateSettings);
    bandwidthLimitInput.addEventListener('input', updateSettings);

    const saveSettings = () => {
      // TODO: Implement saving settings logic
      alert('Settings saved successfully');
    };

    const settingsForm = document.querySelector('form');
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSettings();
    });
  </script>
</body>
</html>
```