function changeTheme() {
  const body = document.body;
  const theme = body.getAttribute("data-theme");
  const newTheme = theme === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", newTheme);
}

function setThemeOnLoad() {
  const body = document.body;
  const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  body.setAttribute("data-theme", storedTheme);
}

function saveTheme() {
    const body = document.body;
    const theme = body.getAttribute("data-theme");
    localStorage.setItem('theme', theme);
}

setThemeOnLoad();
saveTheme();

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            changeTheme();
            saveTheme();
        });
    }
});
edit filepath: public/style.css
content: :root {
  --background-color: #fff;
  --text-color: #333;
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --accent-color: #28a745;
}

body[data-theme="dark"] {
  --background-color: #121212;
  --text-color: #eee;
  --primary-color: #5bc0de;
  --secondary-color: #808080;
  --accent-color: #32cd32;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
  transition: background-color 0.3s, color 0.3s;
}

.container {
  width: 80%;
  margin: auto;
  overflow: hidden;
  padding: 1em;
}

header {
  background: var(--primary-color);
  color: #fff;
  padding-top: 30px;
  min-height: 70px;
  border-bottom: 3px solid #5bc0de;
}

header a {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 16px;
}

header ul {
  margin: 0;
  padding: 0;
}

header li {
  float: left;
  display: inline;
  padding: 0 20px 0 20px;
}

header #branding {
  float: left;
}

header #branding h1 {
  margin: 0;
}

header nav {
  float: right;
  margin-top: 10px;
}

header .highlight, header .current a {
  color: #5bc0de;
  font-weight: bold;
}

header a:hover {
  color: #ccc;
  font-weight: bold;
}

#newsletter {
  padding: 15px;
  color: #fff;
  background: var(--secondary-color);
}

#newsletter h1 {
  float: left;
}

#newsletter form {
  float: right;
  margin-top: 15px;
}

#newsletter input[type="email"] {
  padding: 4px;
  height: 25px;
  width: 250px;
}

.button_1 {
  height: 38px;
  background: var(--accent-color);
  border: 0;
  padding-left: 20px;
  padding-right: 20px;
  color: #fff;
}

section#boxes {
  margin-top: 20px;
}

section#boxes .box {
  float: left;
  width: 30%;
  padding: 10px;
  text-align: center;
}

section#boxes .box img {
  width: 90px;
}

footer {
  padding: 20px;
  margin-top: 20px;
  color: #fff;
  background-color: var(--primary-color);
  text-align: center;
}

.dark {
  padding: 15px;
  background: var(--background-color);
  color: var(--text-color);
  margin-top: 10px;
  margin-bottom: 10px;
}

/* Page Specific Styles */
#main-header {
  background: url("../img/showcase.jpg") no-repeat 0 -400px;
  text-align: center;
  color: #fff;
  padding: 150px;
}

#main-header h1 {
  font-size: 55px;
  margin-bottom: 10px;
}

#main-header button {
  background-color: var(--accent-color);
  color: white;
  font-size: 18px;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#main-header button:hover {
  background-color: #1e8449;
}

#theme-toggle {
    background-color: var(--secondary-color);
    color: white;
    font-size: 16px;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 10px;
}

#theme-toggle:hover {
    background-color: #555;
}

/* Media Queries */
@media(max-width: 768px) {
  header #branding,
  header nav,
  header nav li,
  #newsletter h1,
  #newsletter form,
  #boxes .box,
  article#main-col,
  aside#sidebar {
    float: none;
    text-align: center;
    width: 100%;
  }

  header {
    padding-bottom: 20px;
  }

  #newsletter form {
    margin-top: 10px;
  }

  #boxes .box {
    margin-bottom: 5px;
  }
}

/* Particles.js container */
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--background-color); /* Match body */
  z-index: -1; /* Behind the content */
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Web Proxy</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
</head>
<body>

    <div id="particles-js"></div>

    <header>
        <div class="container">
            <div id="branding">
                <h1><span class="highlight">Secure</span> Web Proxy</h1>
            </div>
            <nav>
                <ul>
                    <li class="current"><a href="index.html">Home</a></li>
                    <li><a href="login.html">Login</a></li>
                    <li><a href="signup.html">Sign Up</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section id="main-header">
        <div class="container">
            <h1>Securely Access the Web</h1>
            <button>Learn More</button>
        </div>
    </section>

    <section id="newsletter">
        <div class="container">
            <h1>Subscribe to Our Newsletter</h1>
            <form>
                <input type="email" placeholder="Enter Email...">
                <button type="submit" class="button_1">Subscribe</button>
            </form>
        </div>
    </section>
    <button id="theme-toggle">Toggle Theme</button>
    <section id="boxes">
        <div class="container">
            <div class="box">
                <img src="./img/encryption.png" alt="Encryption">
                <h3>End-to-End Encryption</h3>
                <p>Your data is protected with advanced encryption algorithms.</p>
            </div>
            <div class="box">
                <img src="./img/anonymous.png" alt="Anonymous Browsing">
                <h3>Anonymous Browsing</h3>
                <p>Browse the web anonymously without revealing your IP address.</p>
            </div>
            <div class="box">
                <img src="./img/secure.png" alt="Secure Connection">
                <h3>Secure Connection</h3>
                <p>Enjoy a secure and private browsing experience.</p>
            </div>
        </div>
    </section>

    <footer>
        <p>Secure Web Proxy, Copyright &copy; 2024</p>
    </footer>

    <script src="particles.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles-config.json', function() {
            console.log('particles.js loaded - callback');
        });
    </script>
</body>
</html>