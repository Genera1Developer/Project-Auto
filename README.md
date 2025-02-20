```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Project Auto Proxy</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="container">
      <header>
        <h1 id="title">Project Auto Proxy</h1>
        <nav>
          <ul>
            <li class="nav-item" data-nav="index.html">
              <a href="#index.html">Home</a>
            </li>
            <li class="nav-item" data-nav="dashboard.html">
              <a href="#dashboard.html">Dashboard</a>
            </li>
            <li class="nav-item" data-nav="settings.html">
              <a href="#settings.html">Settings</a>
            </li>
          </ul>
        </nav>
        <div class="side-bar">
          <ul>
            <li data-nav="index.html">
              <a href="#index.html">Home</a>
            </li>
            <li data-nav="dashboard.html">
              <a href="#dashboard.html">Dashboard</a>
            </li>
            <li data-nav="settings.html">
              <a href="#settings.html">Settings</a>
            </li>
          </ul>
        </div>
      </header>
      <main>
        <section class="form-container">
          <h2>Login</h2>
          <form id="login-form">
            <label for="username">Username</label>
            <input type="text" id="username" />
            <label for="password">Password</label>
            <input type="password" id="password" />
            <button type="submit">Login</button>
          </form>
        </section>
        <section class="status-container">
          <h3 id="status">Status:</h3>
          <span id="status-indicator"></span>
          <span id="connection-status"></span>
        </section>
        <section class="error-container">
          <div id="error-message"></div>
        </section>
      </main>
      <footer>
        <p>Copyright &copy; 2023 Project Auto Proxy</p>
      </footer>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```