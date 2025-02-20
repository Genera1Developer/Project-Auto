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
      <h1>Proxy Settings</h1>
      <form id="settings-form">
        <div class="field">
          <label for="protocol">Protocol</label>
          <select name="protocol">
            <option value="http">HTTP</option>
            <option value="https">HTTPS</option>
          </select>
        </div>
        <div class="field">
          <label for="port">Port</label>
          <input type="number" name="port" min="1" max="65535" required>
        </div>
        <div class="field">
          <label for="authentication">Authentication</label>
          <select name="authentication">
            <option value="none">None</option>
            <option value="basic">Basic</option>
            <option value="digest">Digest</option>
          </select>
        </div>
        <div class="field username-field">
          <label for="username">Username</label>
          <input type="text" name="username">
        </div>
        <div class="field password-field">
          <label for="password">Password</label>
          <input type="password" name="password">
        </div>
        <div class="field">
          <label for="bandwidth-limit">Bandwidth limit (MB/s)</label>
          <input type="number" name="bandwidth-limit" min="0" required>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  </div>

  <script>
    const settingsForm = document.querySelector('#settings-form');
    const usernameField = document.querySelector('.username-field');
    const passwordField = document.querySelector('.password-field');

    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(settingsForm);

      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(data)),
      };

      fetch('/api/settings', settings)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('Settings saved successfully');
          } else {
            alert('Failed to save settings');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Failed to save settings');
        });
    });

    const authenticationSelect = document.querySelector('select[name="authentication"]');

    authenticationSelect.addEventListener('change', (e) => {
      const value = e.target.value;

      if (value === 'none') {
        usernameField.classList.remove('active');
        passwordField.classList.remove('active');
      } else {
        usernameField.classList.add('active');
        passwordField.classList.add('active');
      }
    });
  </script>
</body>
</html>
```