file path: index.html
content: 

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="./styles.css" />
    <script src="./script.js"></script>
  </head>

  <body>
    <div class="container">
      <div class="sidebar">
        <nav>
          <a href="/index.html">Home</a>
          <a href="/settings.html">Settings</a>
          <a href="/dashboard.html">Dashboard</a>
        </nav>
      </div>
      <main>
        <div class="login-form">
          <h1>Login</h1>
          <form>
            <label for="username">Username</label>
            <input type="text" id="username" />
            <label for="password">Password</label>
            <input type="password" id="password" />
            <button type="submit">Login</button>
          </form>
        </div>
        <div class="proxy-status">
          <h2>Proxy Status</h2>
          <p id="proxy-status"></p>
        </div>
        <div class="error-messages"></div>
        <div class="connection-status">
          <h2>Connection Status</h2>
          <p id="connection-status"></p>
        </div>
      </main>
    </div>
  </body>
</html>

```