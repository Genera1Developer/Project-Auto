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
      <h1>Proxy Login</h1>
      <form class="login-form">
        <label for="username">Username</label>
        <input type="text" id="username">
        <label for="password">Password</label>
        <input type="password" id="password">
        <button type="submit">Login</button>
      </form>
      <div class="status">Status: Offline</div>
      <div class="errors">Errors:</div>
      <div class="connection">Connection: Waiting...</div>
    </div>
  </div>

  <script>
    const form = document.querySelector('.login-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;

      // Check if username and password are valid
      if (username === 'admin' && password === 'password') {
        // Login successful
        window.location.href = '/dashboard.html';
      } else {
        // Login failed
        alert('Invalid username or password');
      }
    });
  </script>
</body>
</html>
```