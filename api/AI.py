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
app.secret_key = secrets.token_hex(16)
CORS(app)

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
PROJECT_AUTO_PATH = os.getenv('PROJECT_AUTO_PATH', '/app')

@app.route('/api/time', methods=['GET'])
def get_time():
    now = datetime.datetime.now()
    return jsonify({'time': now.strftime('%Y-%m-%d %H:%M:%S')})

@app.route('/api/github_login', methods=['GET'])
def github_login():
    redirect_uri = request.args.get('redirect_uri')
    session['redirect_uri'] = redirect_uri
    return jsonify({'github_client_id': GITHUB_CLIENT_ID, 'redirect_uri': redirect_uri})

@app.route('/api/github_callback', methods=['GET'])
def github_callback():
    code = request.args.get('code')
    
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
        session['github_token'] = access_token
        return jsonify({'access_token': access_token})
    else:
        return jsonify({'error': 'Failed to obtain access token'}), 400
    
@app.route('/api/run_auto', methods=['POST'])
def run_auto():
    data = request.get_json()
    repo_url = data.get('repo_url')
    prompt = data.get('prompt')
    github_token = session.get('github_token')

    if not repo_url or not prompt:
        return jsonify({'error': 'Repository URL and prompt are required.'}), 400

    if not github_token:
        return jsonify({'error': 'GitHub token is missing. Please authenticate.'}), 401

    try:
        repo_owner, repo_name = repo_url.split('/')[-2:]
    except ValueError:
        return jsonify({'error': 'Invalid repository URL format. Use username/repo.'}), 400

    try:
        command = [
            "python",
            os.path.join(PROJECT_AUTO_PATH, "main.py"),
            "--repo_url", repo_url,
            "--prompt", prompt,
            "--github_token", github_token
        ]
        result = subprocess.run(command, capture_output=True, text=True, check=True, cwd=PROJECT_AUTO_PATH)
        return jsonify({'message': 'Project Auto executed successfully.', 'output': result.stdout})
    except subprocess.CalledProcessError as e:
        return jsonify({'error': f'Project Auto execution failed: {e.stderr}'}), 500
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path}')
def serve(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)