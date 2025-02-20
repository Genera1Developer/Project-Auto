index.html:
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>

<body>
  <div id="main-container">
    <div id="sidebar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </div>
    <div id="main-content">
      <div id="login-form">
        <h1>Login</h1>
        <form>
          <label for="username">Username:</label>
          <input type="text" id="username">
          <br>
          <label for="password">Password:</label>
          <input type="password" id="password">
          <br>
          <button type="submit">Login</button>
        </form>
      </div>
      <div id="proxy-status">
        <h2>Proxy Status:</h2>
        <p id="status">Disconnected</p>
      </div>
      <div id="error-message"></div>
      <div id="connection-status">
        <h2>Connection Status:</h2>
        <ul id="connections"></ul>
      </div>
    </div>
  </div>
</body>

</html>
```

styles.css:
```css
/* Color scheme variables */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #f8f9fa;
}

/* Reset styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Typography */
body {
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 16px;
  color: #333;
}

h1,
h2 {
  font-weight: bold;
}

h2 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 10px;
}

/* Layout */
#main-container {
  display: flex;
  height: 100vh;
}

#sidebar {
  width: 200px;
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
}

#sidebar ul {
  list-style-type: none;
}

#sidebar li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

#sidebar a {
  text-decoration: none;
  color: #333;
}

#sidebar a:hover {
  color: #007bff;
}

#main-content {
  flex: 1;
  padding: 20px;
}

/* Forms */
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #0069d9;
}

/* Status indicators */
#proxy-status p {
  font-weight: bold;
}

#status.connected {
  color: #008000;
}

#status.disconnected {
  color: #ff0000;
}

#error-message {
  color: #ff0000;
}

#connection-status ul {
  list-style-type: none;
  padding: 0;
}

#connection-status li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

#connection-status li:last-child {
  border-bottom: none;
}

#connection-status li .ip-address {
  font-weight: bold;
}

#connection-status li .status {
  color: #008000;
}

#connection-status li .status.disconnected {
  color: #ff0000;
}
```

script.js:
```javascript
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('login-form');
const statusElement = document.getElementById('status');
const errorMessageElement = document.getElementById('error-message');
const connectionStatusElement = document.getElementById('connection-status');

let proxy = null;

function connectProxy() {
  if (!usernameInput.value || !passwordInput.value) {
    errorMessageElement.textContent = 'Please enter a username and password.';
    return;
  }

  try {
    proxy = new ProxyServer(usernameInput.value, passwordInput.value);
    statusElement.textContent = 'Connected';
    statusElement.classList.add('connected');
    loginForm.classList.add('hidden');
  } catch (error) {
    errorMessageElement.textContent = error.message;
  }
}

function disconnectProxy() {
  proxy.disconnect();
  statusElement.textContent = 'Disconnected';
  statusElement.classList.remove('connected');
}

function updateConnectionStatus(connections) {
  connectionStatusElement.innerHTML = '';

  for (const connection of connections) {
    const li = document.createElement('li');
    const ipAddress = document.createElement('span');
    const status = document.createElement('span');

    ipAddress.textContent = connection.ipAddress;
    status.textContent = connection.status;

    if (connection.status === 'disconnected') {
      status.classList.add('disconnected');
    }

    li.appendChild(ipAddress);
    li.appendChild(status);
    connectionStatusElement.appendChild(li);
  }
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  connectProxy();
});

proxy.on('connect', () => {
  updateConnectionStatus(proxy.connections);
});

proxy.on('disconnect', () => {
  updateConnectionStatus(proxy.connections);
});

proxy.on('error', (error) => {
  errorMessageElement.textContent = error.message;
});
```

settings.html:
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy Settings</title>
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>

<body>
  <div id="main-container">
    <div id="sidebar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </div>
    <div id="main-content">
      <h1>Proxy Settings</h1>
      <form>
        <label for="protocol">Protocol:</label>
        <select id="protocol">
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
        <br>
        <label for="port">Port:</label>
        <input type="number" id="port" min="1" max="65535">
        <br>
        <label for="username">Username:</label>
        <input type="text" id="username">
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password">
        <br>
        <label for="bandwidth-limit">Bandwidth Limit (MB/s):</label>
        <input type="number" id="bandwidth-limit" min="