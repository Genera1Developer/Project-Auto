import os
from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
import subprocess
import datetime
from dotenv import load_dotenv
import requests
import secrets

load_dotenv()

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # Secure secret key for sessions
CORS(app)

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
PROJECT_AUTO_PATH = os.getenv('PROJECT_AUTO_PATH', '/app')  # Default to /app if not set

@app.route('/api/time', methods=['GET'])
def get_time():
    now = datetime.datetime.now()
    return jsonify({'time': now.strftime('%Y-%m-%d %H:%M:%S')})

@app.route('/api/github_login', methods=['GET'])
def github_login():
    redirect_uri = request.args.get('redirect_uri')
    session['redirect_uri'] = redirect_uri  # Store redirect URI in session
    return jsonify({'github_client_id': GITHUB_CLIENT_ID, 'redirect_uri': redirect_uri})

@app.route('/api/github_callback', methods=['GET'])
def github_callback():
    code = request.args.get('code')
    
    # Exchange code for access token
    token_url = 'https://github.com/login/oauth/access_token'
    data = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code,
    }
    headers = {'Accept': 'application/json'}
    response = requests.post(token_url, json=data, headers=headers)
    token_data = response.json()

    if 'access_token' in token_data:
        access_token = token_data['access_token']
        session['github_token'] = access_token  # Store access token in session
        return jsonify({'access_token': access_token})
    else:
        return jsonify({'error': 'Failed to obtain access token'}), 400
    
@app.route('/api/run_auto', methods=['POST'])
def run_auto():
    data = request.get_json()
    repo_url = data.get('repo_url')
    prompt = data.get('prompt')
    github_token = session.get('github_token')  # Retrieve token from session

    if not repo_url or not prompt:
        return jsonify({'error': 'Repository URL and prompt are required.'}), 400

    if not github_token:
        return jsonify({'error': 'GitHub token is missing. Please authenticate.'}), 401

    try:
        repo_owner, repo_name = repo_url.split('/')[-2:]
    except ValueError:
        return jsonify({'error': 'Invalid repository URL format. Use username/repo.'}), 400

    try:
        # Construct command to run Project Auto
        command = [
            "python",
            os.path.join(PROJECT_AUTO_PATH, "main.py"),  # Path to your main script
            "--repo_url", repo_url,
            "--prompt", prompt,
            "--github_token", github_token
        ]
        result = subprocess.run(command, capture_output=True, text=True, check=True, cwd=PROJECT_AUTO_PATH) # set working directory
        return jsonify({'message': 'Project Auto executed successfully.', 'output': result.stdout})
    except subprocess.CalledProcessError as e:
        return jsonify({'error': f'Project Auto execution failed: {e.stderr}'}), 500
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)


edit filepath: public/index.html
content:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Auto</title>
    <link rel="stylesheet" href="https://github.com/Genera1Developer/Project-Auto/public/style/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />

</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="https://github.com/Genera1Developer/Project-Auto/public/images/logo.png" alt="Project Auto Logo">
        </div>
        <ul class="menu">
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/index.html">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/Configuration">
                    <i class="fas fa-cog"></i>
                    <span>Configuration</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/About-Us">
                    <i class="fas fa-info-circle"></i>
                    <span>About Us</span>
                </a>
            </li>
        </ul>
    </div>

    <div class="main-content">
        <header>
            <div class="time" id="current-time"></div>
            <h1>Project Auto</h1>
        </header>
        <main>
            <div class="container">
                <div class="input-section">
                    <label for="repo_url">GitHub Repository (username/repo):</label>
                    <input type="text" id="repo_url" placeholder="e.g., Genera1Developer/Project-Auto">
                </div>
                <div class="input-section">
                    <label for="prompt">Customization Prompt:</label>
                    <textarea id="prompt" rows="5" placeholder="Enter your customization instructions here."></textarea>
                </div>
                <div class="button-section">
                    <button id="github-login-button">Authenticate with GitHub</button>
                    <button id="start-button">Start</button>
                </div>
                <div class="output-section">
                    <h2>Output:</h2>
                    <pre id="output"></pre>
                </div>
            </div>
        </main>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Function to update the time
            function updateTime() {
                fetch('/api/time')
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('current-time').textContent = data.time;
                    });
            }

            // Update the time every second
            updateTime();
            setInterval(updateTime, 1000);

            const repoUrlInput = document.getElementById('repo_url');
            const promptInput = document.getElementById('prompt');
            const startButton = document.getElementById('start-button');
            const githubLoginButton = document.getElementById('github-login-button');
            const outputDiv = document.getElementById('output');

            githubLoginButton.addEventListener('click', () => {
                const redirectUri = window.location.origin; // Current URL
                fetch(`/api/github_login?redirect_uri=${encodeURIComponent(redirectUri)}`)
                    .then(response => response.json())
                    .then(data => {
                        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${data.github_client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
                        window.location.href = githubAuthUrl;
                    });
            });


            startButton.addEventListener('click', () => {
                const repoUrl = repoUrlInput.value;
                const prompt = promptInput.value;

                outputDiv.textContent = 'Running...';

                fetch('/api/run_auto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ repo_url: repoUrl, prompt: prompt })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        outputDiv.textContent = `Error: ${data.error}`;
                    } else {
                        outputDiv.textContent = `Success: ${data.message}\n${data.output}`;
                    }
                })
                .catch(error => {
                    outputDiv.textContent = `An unexpected error occurred: ${error}`;
                });
            });
        });
    </script>
</body>
</html>


edit filepath: public/style/style.css
content:

body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f8;
    color: #333;
    display: flex;
    height: 100vh;
}

/* Sidebar Styles */
.sidebar {
    width: 220px;
    background-color: #301934;
    color: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.sidebar .logo img {
    width: 80px;
    margin-bottom: 20px;
}

.sidebar .menu {
    list-style: none;
    padding: 0;
    width: 100%;
}

.sidebar .menu li {
    margin-bottom: 10px;
}

.sidebar .menu a {
    display: flex;
    align-items: center;
    color: #ddd;
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.sidebar .menu a:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.sidebar .menu a i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
}

.sidebar .menu a span {
    flex-grow: 1;
}


/* Main Content Styles */
.main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

/* Header Styles */
header {
    background-color: #4e3654;
    color: #fff;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
    margin: 0;
    font-size: 2em;
}

/* Main Styles */
main {
    padding: 20px;
    overflow: auto;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.input-section {
    margin-bottom: 20px;
}

.input-section label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

.input-section input[type="text"],
.input-section textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    color: #333;
    resize: vertical;
}

.button-section {
    text-align: center;
    margin-bottom: 20px;
}

.button-section button {
    background-color: #7e57c2;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin: 0 10px;
}

.button-section button:hover {
    background-color: #673ab7;
}

.output-section h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
    color: #555;
}

.output-section pre {
    background-color: #f0f0f0;
    padding: 15px;
    border-radius: 5px;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    color: #444;
    border: 1px solid #ddd;
}
/* Time Display */
.time {
    font-size: 1.2em;
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
     <div class="sidebar">
        <div class="logo">
            <img src="https://github.com/Genera1Developer/Project-Auto/public/images/logo.png" alt="Project Auto Logo">
        </div>
        <ul class="menu">
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/index.html">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/Configuration">
                    <i class="fas fa-cog"></i>
                    <span>Configuration</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/About-Us">
                    <i class="fas fa-info-circle"></i>
                    <span>About Us</span>
                </a>
            </li>
        </ul>
    </div>

    <div class="main-content">
        <header>
            <div class="time" id="current-time"></div>
            <h1>About Us</h1>
        </header>
        <main>
            <div class="container">
                <section class="about-section">
                    <h2>Our Mission</h2>
                    <p>Project Auto aims to automate and simplify the process of software customization and development. We provide a platform where users can easily apply modifications to their projects through intelligent automation, saving time and resources.</p>
                </section>

                <section class="team-section">
                    <h2>Our Team</h2>
                    <p>We are a team of passionate developers and innovators dedicated to pushing the boundaries of what's possible in software development. With expertise in AI, automation, and software engineering, we strive to deliver cutting-edge solutions that empower developers worldwide.</p>
                </section>

                <section class="contact-section">
                    <h2>Contact Us</h2>
                    <p>Have questions or feedback? We'd love to hear from you!</p>
                    <p>Email: contact@projectauto.com</p>
                    <p>LinkedIn: <a href="#">LinkedIn Profile</a></p>
                </section>
            </div>
        </main>
    </div>
       <script>
        // Function to update the time
        function updateTime() {
            fetch('/api/time')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('current-time').textContent = data.time;
                });
        }

        // Update the time every second
        updateTime();
        setInterval(updateTime, 1000);
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <img src="https://github.com/Genera1Developer/Project-Auto/public/images/logo.png" alt="Project Auto Logo">
        </div>
        <ul class="menu">
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/index.html">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/Configuration">
                    <i class="fas fa-cog"></i>
                    <span>Configuration</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/Genera1Developer/Project-Auto/public/About-Us">
                    <i class="fas fa-info-circle"></i>
                    <span>About Us</span>
                </a>
            </li>
        </ul>
    </div>

    <div class="main-content">
        <header>
            <div class="time" id="current-time"></div>
            <h1>Configuration</h1>
        </header>
        <main>
            <div class="container">
                <section class="configuration-section">
                    <h2>Project Auto Settings</h2>
                    <p>Configure Project Auto to match your specific needs.</p>

                    <div class="setting">
                        <label for="api-key">API Key:</label>
                        <input type="text" id="api-key" placeholder="Enter your API key">
                        <button class="save-button">Save</button>
                    </div>

                    <div class="setting">
                        <label for="default-branch">Default Branch:</label>
                        <select id="default-branch">
                            <option value="main">main</option>
                            <option value="master">master</option>
                            <option value="develop">develop</option>
                        </select>
                        <button class="save-button">Save</button>
                    </div>
                </section>
            </div>
        </main>
    </div>
    <script>
        // Function to update the time
        function updateTime() {
            fetch('/api/time')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('current-time').textContent = data.time;
                });
        }

        // Update the time every second
        updateTime();
        setInterval(updateTime, 1000);
    </script>
</body>
</html>


edit filepath: public/images/logo.png
content:
[insert logo image binary data here - placeholder]

edit filepath: main.py
content:

import argparse
import os
import subprocess

def main():
    parser = argparse.ArgumentParser(description="Project Auto - Automate repository modifications.")
    parser.add_argument("--repo_url", required=True, help="GitHub repository URL (e.g., username/repo)")
    parser.add_argument("--prompt", required=True, help="Customization prompt")
    parser.add_argument("--github_token", required=True, help="GitHub access token")

    args = parser.parse_args()

    repo_url = args.repo_url
    prompt = args.prompt
    github_token = args.github_token

    print(f"Repository URL: {repo_url}")
    print(f"Prompt: {prompt}")

    # Implement your Project Auto logic here
    # This is a placeholder for the actual automation process

    # Example: Clone the repository (replace with your actual logic)
    try:
        repo_owner, repo_name = repo_url.split('/')[-2:]
        clone_url = f"https://{github_token}@github.com/{repo_owner}/{repo_name}.git"
        repo_dir = repo_name  # Directory to clone into

        if not os.path.exists(repo_dir):
            print(f"Cloning repository to {repo_dir}...")
            subprocess.run(["git", "clone", clone_url, repo_dir], check=True)
        else:
            print(f"Repository already cloned in {repo_dir}. Skipping clone.")

        # Execute some actions based on the prompt...
        print(f"Executing actions based on prompt: {prompt}...")

        # Placeholder for executing the automation
        print("Automation process completed (placeholder).")


    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()