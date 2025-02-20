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
      <div class="login-form">
        <form id="login-form">
          <h1>Login</h1>
          <div class="field">
            <label for="username">Username</label>
            <input type="text" name="username" required>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input type="password" name="password" required>
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
      <div class="status">
        <p>Proxy status: <span id="proxy-status">Disconnected</span></p>
        <p>Connection status: <span id="connection-status">Disconnected</span></p>
        <p>Error message: <span id="error-message"></span></p>
      </div>
    </div>
  </div>

  <script>
    const loginForm = document.querySelector('#login-form');
    const proxyStatus = document.querySelector('#proxy-status');
    const connectionStatus = document.querySelector('#connection-status');
    const errorMessage = document.querySelector('#error-message');

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
            proxyStatus.textContent = 'Connected';
            connectionStatus.textContent = 'Connected';
            errorMessage.textContent = '';
          } else {
            proxyStatus.textContent = 'Disconnected';
            connectionStatus.textContent = 'Disconnected';
            errorMessage.textContent = data.error;
          }
        })
        .catch(err => {
          console.error(err);
          proxyStatus.textContent = 'Disconnected';
          connectionStatus.textContent = 'Disconnected';
          errorMessage.textContent = 'Failed to connect';
        });
    });
  </script>
</body>
</html>
```