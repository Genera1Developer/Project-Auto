document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = document.getElementById('darkModeIcon');

    // Check for saved preference
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // Function to enable dark mode
    function enableDarkMode() {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    }

    // Function to disable dark mode
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('darkMode', null);
    }

    // Set initial dark mode state
    if (isDarkMode) {
        enableDarkMode();
    }

    // Toggle dark mode on click
    darkModeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
});

edit filepath: public/style.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
}

.dark-mode {
    background-color: #1e1e1e;
    color: #eee;
}

.container {
    width: 80%;
    margin: auto;
    overflow: hidden;
    padding: 20px;
}

header {
    background: #333;
    color: #fff;
    padding-top: 30px;
    min-height: 70px;
    border-bottom: 3px solid #e8491d;
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
    color: #e8491d;
    font-weight: bold;
}

header a:hover {
    color: #ccc;
    font-weight: bold;
}

#newsletter {
    padding: 15px;
    color: #fff;
    background: #333;
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
    background: #e8491d;
    border: 0;
    padding-left: 20px;
    padding-right: 20px;
    color: #fff;
}

#main {
    padding: 20px;
}

article#main-col {
    float: left;
    width: 65%;
}

aside#sidebar {
    float: right;
    width: 30%;
    margin-top: 10px;
}

#services {
    padding: 20px;
}

#services .box {
    padding: 20px;
    margin-bottom: 40px;
    border-bottom: #e8491d 3px solid;
}

aside#sidebar .quote input, aside#sidebar .quote textarea {
    width: 90%;
    padding: 5px;
}

footer {
    padding: 20px;
    margin-top: 20px;
    color: #fff;
    background-color: #e8491d;
    text-align: center;
}

/* Dark Mode Styles */
body.dark-mode {
    background-color: #121212;
    color: #ffffff;
}

body.dark-mode header {
    background: #222;
    border-bottom: 3px solid #bb3915;
}

body.dark-mode #newsletter {
    background: #222;
}

body.dark-mode footer {
    background-color: #bb3915;
}

/* Font Awesome Icons for Dark Mode Toggle */
.dark-mode-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: #fff; /* Default color */
    padding: 0;
    transition: color 0.3s ease;
}

body.dark-mode .dark-mode-toggle {
    color: #ffcc00; /* Color when dark mode is enabled */
}

#particles-js {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #232741;
    z-index: -1;
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
    <div id="particles-js"></div>
    <header>
        <div class="container">
            <div id="branding">
                <h1><span class="highlight">Encrypted</span> Web Proxy</h1>
            </div>
            <nav>
                <ul>
                    <li class="current"><a href="index.html">Home</a></li>
                    <li><a href="login.html">Login</a></li>
                    <li><a href="signup.html">Signup</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section id="newsletter">
        <div class="container">
            <h1>Subscribe to Our Newsletter</h1>
            <form>
                <input type="email" placeholder="Enter Email...">
                <button type="submit" class="button_1">Subscribe</button>
            </form>
        </div>
    </section>

    <section id="main">
        <div class="container">
            <article id="main-col">
                <h1>About Us</h1>
                <p>This is a secure web proxy designed to encrypt your web traffic and protect your privacy. We use state-of-the-art encryption techniques to ensure that your data remains confidential and secure.</p>
                <p>Our proxy supports various encryption protocols, including AES and TLS, to provide a robust security layer for your online activities.</p>
            </article>

            <aside id="sidebar">
                <div class="quote">
                    <h3>Get a Quote</h3>
                    <form>
                        <div>
                            <label>Name</label><br>
                            <input type="text" placeholder="Name">
                        </div>
                        <div>
                            <label>Email</label><br>
                            <input type="email" placeholder="Email Address">
                        </div>
                        <div>
                            <label>Message</label><br>
                            <textarea placeholder="Message"></textarea>
                        </div>
                        <button class="button_1" type="submit">Send</button>
                    </form>
                </div>
            </aside>
        </div>
    </section>

    <footer>
        <p>Encrypted Web Proxy, Copyright &copy; 2024</p>
    </footer>
    <button id="darkModeToggle" class="dark-mode-toggle">
        <i id="darkModeIcon" class="fas fa-moon"></i>
    </button>
    <script src="particles.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles-config.json', function() {
            console.log('particles.js loaded - callback');
        });
    </script>
    <script src="script.js"></script>
</body>
</html>