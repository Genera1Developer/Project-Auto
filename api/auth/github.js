const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const { Octokit } = require('@octokit/rest');

module.exports = (app) => {
  // Session configuration
  app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GitHubStrategy({
    clientID: 'YOUR_GITHUB_CLIENT_ID', // Replace with your GitHub Client ID
    clientSecret: 'YOUR_GITHUB_CLIENT_SECRET', // Replace with your GitHub Client Secret
    callbackURL: 'https://project-auto-website.vercel.app/api/auth/github/callback' // Replace with your callback URL
  },
  async (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken;
    return done(null, profile);
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.get('/api/auth/github',
    passport.authenticate('github', { scope: [ 'repo' ] }));

  app.get('/api/auth/github/callback',
    passport.authenticate('github', { failureRedirect: 'https://github.com/Genera1Developer/Project-Auto/public/' }),
    (req, res) => {
      res.redirect('https://github.com/Genera1Developer/Project-Auto/public/');
    });

  app.get('/api/auth/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('https://github.com/Genera1Developer/Project-Auto/public/');
    });
  });

  app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json(null);
    }
  });

    app.post('/api/run-auto', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { repo, instructions } = req.body;
        const [owner, repository] = repo.split('/');
        const accessToken = req.user.accessToken;

        const octokit = new Octokit({ auth: accessToken });

        try {
            const content = `Project Auto ran with instructions: ${instructions}`;
            const filename = `project-auto-${Date.now()}.txt`;
            const path = filename;

            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo: repository,
                path,
                message: `Project Auto: ${instructions}`,
                content: Buffer.from(content).toString('base64'),
                committer: {
                    name: 'Project Auto',
                    email: 'projectauto@example.com',
                },
                author: {
                    name: 'Project Auto',
                    email: 'projectauto@example.com',
                },
            });

            res.json({ success: true, message: 'Project Auto executed successfully!' });
        } catch (error) {
            console.error('Error running Project Auto:', error);
            res.status(500).json({ error: 'Failed to execute Project Auto.' });
        }
    });
};


edit filepath: public/index.html
content:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Auto</title>
    <link rel="stylesheet" href="https://github.com/Genera1Developer/Project-Auto/public/style/style.css">
</head>
<body>
    <div class="sidebar">
        <h1>Project Auto</h1>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/">Home</a>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/Configuration">Configuration</a>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/About-Us">About Us</a>
        <a href="/api/auth/logout">Logout</a>
    </div>
    <div class="content">
        <header>
            <div id="current-time"></div>
            <h1>Welcome to Project Auto</h1>
        </header>
        <main>
            <div id="auth-status"></div>
            <div id="app">
                <input type="text" id="repo" placeholder="username/repo">
                <textarea id="instructions" placeholder="Enter customization instructions"></textarea>
                <button id="start-button">Start</button>
                <div id="message"></div>
            </div>
        </main>
    </div>
    <script>
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            document.getElementById('current-time').textContent = timeString;
        }

        setInterval(updateTime, 1000);
        updateTime();

        fetch('/api/auth/user')
            .then(response => response.json())
            .then(user => {
                const authStatusDiv = document.getElementById('auth-status');
                if (user) {
                    authStatusDiv.textContent = `Logged in as ${user.displayName}`;
                } else {
                    authStatusDiv.innerHTML = '<a href="/api/auth/github">Login with GitHub</a>';
                }
            });

        document.getElementById('start-button').addEventListener('click', () => {
            const repo = document.getElementById('repo').value;
            const instructions = document.getElementById('instructions').value;
            const messageDiv = document.getElementById('message');

            fetch('/api/run-auto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ repo, instructions })
            })
            .then(response => response.json())
            .then(data => {
                messageDiv.textContent = data.message || data.error;
            })
            .catch(error => {
                console.error('Error:', error);
                messageDiv.textContent = 'An error occurred.';
            });
        });
    </script>
</body>
</html>


edit filepath: public/style/style.css
content:

body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 200px;
    background-color: #301934;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.sidebar h1 {
    margin-bottom: 20px;
    text-align: center;
    color: #FFD700;
}

.sidebar a {
    text-decoration: none;
    color: #ddd;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 5px;
    transition: background-color 0.3s;
    width: 100%;
    text-align: center;
}

.sidebar a:hover {
    background-color: #4e3054;
}

.content {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

header {
    background-color: #542E71;
    color: #FFD700;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
    margin: 0;
}

#current-time {
    font-size: 1.2em;
}

main {
    padding: 20px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#app {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input[type="text"],
textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
}

textarea {
    resize: vertical;
    height: 100px;
}

button {
    background-color: #FFD700;
    color: #301934;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #D4AF37;
}

#message {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
    border: 1px solid #eee;
}

#auth-status {
    margin-bottom: 20px;
    text-align: right;
}

#auth-status a {
    color: #542E71;
    text-decoration: none;
    font-weight: bold;
}


edit filepath: public/About-Us
content:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - Project Auto</title>
    <link rel="stylesheet" href="https://github.com/Genera1Developer/Project-Auto/public/style/style.css">
</head>
<body>
    <div class="sidebar">
        <h1>Project Auto</h1>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/">Home</a>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/Configuration">Configuration</a>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/About-Us">About Us</a>
        <a href="/api/auth/logout">Logout</a>
    </div>
    <div class="content">
        <header>
            <div id="current-time"></div>
            <h1>About Us</h1>
        </header>
        <main>
            <h2>Our Mission</h2>
            <p>Project Auto aims to automate software development tasks, making development faster and more efficient. We strive to provide a user-friendly platform that empowers developers to customize and automate their workflows.</p>

            <h2>Our Team</h2>
            <p>We are a team of dedicated developers passionate about automation and improving the software development lifecycle.</p>

            <h2>Contact</h2>
            <p>For any inquiries, please contact us at: <a href="mailto:projectauto@example.com">projectauto@example.com</a></p>
        </main>
    </div>
    <script>
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            document.getElementById('current-time').textContent = timeString;
        }

        setInterval(updateTime, 1000);
        updateTime();
    </script>
</body>
</html>


edit filepath: public/Configuration
content:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuration - Project Auto</title>
    <link rel="stylesheet" href="https://github.com/Genera1Developer/Project-Auto/public/style/style.css">
</head>
<body>
    <div class="sidebar">
        <h1>Project Auto</h1>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/">Home</a>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/Configuration">Configuration</a>
        <a href="https://github.com/Genera1Developer/Project-Auto/public/About-Us">About Us</a>
        <a href="/api/auth/logout">Logout</a>
    </div>
    <div class="content">
        <header>
            <div id="current-time"></div>
            <h1>Configuration</h1>
        </header>
        <main>
            <h2>Customize Project Auto</h2>
            <p>Here, you can configure various settings to tailor Project Auto to your specific needs.</p>

            <section>
                <h3>Repository Settings</h3>
                <p>Set the default repository settings for your projects.</p>
                <label for="default-branch">Default Branch:</label>
                <input type="text" id="default-branch" placeholder="e.g., main">
            </section>

            <section>
                <h3>Automation Rules</h3>
                <p>Define custom rules for automating tasks.</p>
                <textarea id="automation-rules" placeholder="Enter your automation rules here."></textarea>
            </section>

            <button id="save-config">Save Configuration</button>

            <div id="config-message"></div>
        </main>
    </div>
    <script>
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            document.getElementById('current-time').textContent = timeString;
        }

        setInterval(updateTime, 1000);
        updateTime();

        document.getElementById('save-config').addEventListener('click', () => {
            const defaultBranch = document.getElementById('default-branch').value;
            const automationRules = document.getElementById('automation-rules').value;
            const configMessageDiv = document.getElementById('config-message');

            // Placeholder: Add logic to save configuration
            configMessageDiv.textContent = 'Configuration saved successfully!';
        });
    </script>
</body>
</html>