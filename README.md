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
      <form class="settings-form">
        <label for="protocol">Protocol</label>
        <select id="protocol">
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
        <label for="port">Port</label>
        <input type="number" id="port">
        <label for="authentication">Authentication</label>
        <input type="checkbox" id="authentication">
        <label for="username">Username</label>
        <input type="text" id="username">
        <label for="password">Password</label>
        <input type="password" id="password">
        <label for="bandwidth">Bandwidth Limit</label>
        <input type="number" id="bandwidth">
        <button type="submit">Save</button>
      </form>
    </div>
  </div>

  <script>
    const form = document.querySelector('.settings-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const protocol = document.querySelector('#protocol').value;
      const port = document.querySelector('#port').value;
      const authentication = document.querySelector('#authentication').checked;
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;
      const bandwidth = document.querySelector('#bandwidth').value;

      // Save settings to local storage
      localStorage.setItem('protocol', protocol);
      localStorage.setItem('port', port);
      localStorage.setItem('authentication', authentication);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('bandwidth', bandwidth);

      // Redirect to dashboard
      window.location.href = '/dashboard.html';
    });
  </script>
</body>
</html>
```