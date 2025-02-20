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
      <h1 class="title">Web Proxy</h1>
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
      <div class="status">
        <h2 id="status">Status: <span class="status-text">Loading...</span></h2>
        <div class="error-message" id="error-message"></div>
      </div>
      <div class="connection-status" id="connection-status">
        <span>Connection:</span>
        <span id="connection-status-icon"></span>
        <span id="connection-status-text"></span>
      </div>
    </div>
  </div>

  <script>
    const loginForm = document.querySelector('#login-form');
    const status = document.querySelector('#status');
    const statusText = document.querySelector('.status-text');
    const errorMessage = document.querySelector('#error-message');
    const connectionStatus = document.querySelector('#connection-status');
    const connectionStatusIcon = document.querySelector('#connection-status-icon');
    const connectionStatusText = document.querySelector('#connection-status-text');

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
            statusText.textContent = 'Logged in';
            connectionStatusIcon.classList.add('online');
            connectionStatusText.textContent = 'Online';
          } else {
            errorMessage.textContent = data.error;
          }
        })
        .catch(err => {
          console.error(err);
          statusText.textContent = 'Error connecting to proxy';
          connectionStatusIcon.classList.add('offline');
          connectionStatusText.textContent = 'Offline';
          errorMessage.textContent = 'Failed to connect to proxy';
        });
    });

    window.addEventListener('online', () => {
      connectionStatusIcon.classList.add('online');
      connectionStatusText.textContent = 'Online';
    });

    window.addEventListener('offline', () => {
      connectionStatusIcon.classList.remove('online');
      connectionStatusText.textContent = 'Offline';
    });
  </script>
</body>
</html>
```