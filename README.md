file path: settings.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy Settings</title>
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
          <input type="checkbox" name="authentication" id="authentication">
        </div>
        <div class="field" id="credentials" style="display: none;">
          <label for="username">Username</label>
          <input type="text" name="username" required>
          <label for="password">Password</label>
          <input type="password" name="password" required>
        </div>
        <div class="field">
          <label for="bandwidth-limit">Bandwidth Limit (MB/s)</label>
          <input type="number" name="bandwidth-limit" min="0" max="1000" required>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  </div>

  <script>
    const authentication = document.querySelector('#authentication');
    const credentials = document.querySelector('#credentials');

    authentication.addEventListener('change', () => {
      if (authentication.checked) {
        credentials.style.display = 'block';
      } else {
        credentials.style.display = 'none';
      }
    });

    const form = document.querySelector('#settings-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);

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
  </script>
</body>
</html>
```