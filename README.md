file path: index.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
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
      <h1>Web Proxy</h1>
      <div class="login-form">
        <form id="login-form">
          <div class="field">
            <label for="username">Username</label>
            <input type="text" name="username" required>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input type="password" name="password" required>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="status-indicator">
        <p>Proxy Status: <span id="status">Disconnected</span></p>
      </div>
      <div class="error-message" style="display: none;">
        <p id="error-message"></p>
      </div>
      <div class="connection-status" style="display: none;">
        <p>Connected to: <span id="connected-to"></span></p>
      </div>
    </div>
  </div>

  <script>
    const loginForm = document.querySelector('#login-form');
    const status = document.querySelector('#status');
    const errorMessage = document.querySelector('#error-message');
    const connectionStatus = document.querySelector('.connection-status');
    const connectedTo = document.querySelector('#connected-to');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(loginForm);

      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(data)),
      };

      fetch('/api/login', settings)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            status.textContent = 'Connected';
            errorMessage.style.display = 'none';
            connectionStatus.style.display = 'block';
            connectedTo.textContent = data.host;
          } else {
            status.textContent = 'Disconnected';
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.error;
            connectionStatus.style.display = 'none';
          }
        })
        .catch(err => {
          console.error(err);
          status.textContent = 'Disconnected';
          errorMessage.style.display = 'block';
          errorMessage.textContent = 'Failed to connect';
          connectionStatus.style.display = 'none';
        });
    });
  </script>
</body>
</html>
```