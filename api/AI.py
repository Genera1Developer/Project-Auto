import time
import datetime
import re
import google.generativeai as genai
from github import Github, GithubException
import requests
import logging
import random
import os
import json
from flask import Flask, render_template, request, redirect, url_for, session
from flask_oauthlib.client import OAuth
from urllib.parse import quote

GITHUB_TOKEN = "{ghp_ TOKEN FROM CONNECT.JS HERE!}" # CHANGE TO BE DYNAMIC 
GOOGLE_API_KEY = "AIzaSyAYcscrApPcDNkHxvzAPLek8ij0YSOsYKg"
REPO_NAME = "{User}/{Repository}" # CHANGE TO BE DYNAMIC
DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1352379007945019412/z-hkYi6uw5yw-1WzxeuuF_Pm-iR0-fUm2v7uxpDd1KZYxy53oNGGg3uvupVXUrXmmXWx"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler("automation.log", mode='a'), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Initialize APIs
genai.configure(api_key=GOOGLE_API_KEY)
# github_client = Github(GITHUB_TOKEN) # REMOVE 

VALID_FILE_EXTENSIONS = { # EDIT TO WHERE ITS GRABBED DYNAMICALLY AND SORTED!!!
    "js": [],
    "html": [],
    "css": [],
    "json": [],
    "md": [],  
    "py": [],
    "txt": [],  
    "env": [],  
    "config": []
}

# Flask App Initialization
app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key

# OAuth Configuration
oauth = OAuth(app)
github = oauth.remote_app(
    'github',
    consumer_key=os.environ.get('GITHUB_CLIENT_ID'),
    consumer_secret=os.environ.get('GITHUB_CLIENT_SECRET'),
    request_token_params={'scope': 'repo'},
    base_url='https://api.github.com/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize'
)

@app.route('/')
def index():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    github_username = session.get('github_username')
    access_token = session.get('github_token')
    if access_token:
        return render_template('index.html', time=now, github_username=github_username)
    return render_template('index.html', time=now, github_username=None)

@app.route('/login')
def login():
    return github.authorize(callback=url_for('authorized', _external=True))

@app.route('/logout')
def logout():
    session.pop('github_token', None)
    session.pop('github_username', None)
    return redirect(url_for('index'))

@app.route('/login/authorized')
def authorized():
    resp = github.authorized_response()
    if resp is None or isinstance(resp, Exception):
        return 'Access denied: reason=%s error=%s' % (
            request.args['error'],
            request.args['error_description']
        )
    session['github_token'] = (resp['access_token'], '')
    g = Github(resp['access_token'])
    session['github_username'] = g.get_user().login
    return redirect(url_for('index'))

@github.tokengetter
def get_github_token():
    return session.get('github_token')

@app.route('/configuration')
def configuration():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return render_template('configuration.html', time=now)

@app.route('/about-us')
def about_us():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return render_template('about_us.html', time=now)

@app.route('/start', methods=['POST'])
def start_project_auto():
    github_username = session.get('github_username')
    access_token = session.get('github_token')
    
    if not access_token:
        return "Please log in with GitHub first."

    repo_name = request.form.get('repo_name')
    custom_prompt = request.form.get('custom_prompt')

    if not repo_name:
        return "Repository name is required."

    try:
        github_client = Github(access_token[0])
        repo = github_client.get_repo(repo_name)
    except GithubException as e:
        return f"GitHub API error: {e}"
    except Exception as e:
        return f"Error accessing repository: {e}"

    # Run Project Auto logic (replace with actual implementation)
    # This is a placeholder, implement actual Project Auto logic here
    log_discord(f"Project Auto started on {repo_name} with prompt: {custom_prompt}", "INFO")
    result_message = f"Project Auto started on {repo_name} with prompt: {custom_prompt} - Check logs for updates!"
    
    return result_message

def log_discord(msg, level="INFO"):
    levels = {
        "INFO": f"> ℹ️ INFO: {msg}",
        "SUCCESS": f"> ✅ SUCCESS: {msg}",
        "ERROR": f"> ❌ ERROR: {msg}",
        "WARN": f"> ⚠️ WARN: {msg}",
        "MISC": f"> 💡 {msg}"
    }
    payload = {"content": levels.get(level, msg)}
    try:
        r = requests.post(DISCORD_WEBHOOK_URL, json=payload, timeout=10)
        r.raise_for_status()
        logger.info(f"Discord log sent: {level} - {msg}")
    except Exception as e:
        logger.error(f"Failed to log to Discord: {e}")

def get_repo():
    try:
        repo = github_client.get_repo(REPO_NAME)
        user = github_client.get_user().login
        log_discord(f"Authenticated as {user}", "SUCCESS")
        logger.info(f"Successfully authenticated as {user} and connected to {REPO_NAME}")
        return repo
    except GithubException as e:
        log_discord(f"GitHub API error: {e.status} - {e.data.get('message', 'Unknown error')}", "ERROR")
        logger.error(f"GitHub API error: {e.status} - {e.data.get('message', 'Unknown error')}")
        exit(1)
    except Exception as e:
        log_discord(f"Accessing repository failed: {str(e)}", "ERROR")
        logger.error(f"Accessing repository failed: {str(e)}")
        exit(1)

def get_file_content(repo, file_path):
    try:
        file_content = repo.get_contents(file_path)
        return file_content.decoded_content.decode("utf-8"), file_content.sha
    except GithubException as e:
        if e.status == 404:
            log_discord(f"File {file_path} does not exist. It will be created.", "WARN")
            logger.warning(f"File {file_path} does not exist. It will be created.")
            return None, None
        else:
            log_discord(f"GitHub error accessing {file_path}: {e.data.get('message', 'Unknown error')}", "ERROR")
            logger.error(f"GitHub error accessing {file_path}: {e.data.get('message', 'Unknown error')}")
            return None, None
    except Exception as e:
        log_discord(f"Error accessing {file_path}: {str(e)}", "ERROR")
        logger.error(f"Error accessing {file_path}: {str(e)}")
        return None, None

def update_file(repo, file_path, new_content, sha, commit_message):
    try:
        repo.update_file(file_path, commit_message, new_content, sha)
        log_discord(f"Updated {file_path} | Commit: '{commit_message}' | V7.9.5", "SUCCESS")
        logger.info(f"Updated {file_path} | Commit: '{commit_message}'")
    except GithubException as e:
        if e.status == 409:
            log_discord(f"SHA conflict for {file_path}. Retrying with latest SHA.", "WARN")
            logger.warning(f"SHA conflict for {file_path}. Retrying with latest SHA.")
            latest_content, latest_sha = get_file_content(repo, file_path)
            if latest_sha:
                update_file(repo, file_path, new_content, latest_sha, commit_message)
            else:
                log_discord(f"Failed to resolve SHA conflict for {file_path}. Skipping update.", "ERROR")
                logger.error(f"Failed to resolve SHA conflict for {file_path}. Skipping update.")
        else:
            log_discord(f"GitHub error updating {file_path}: {e.data.get('message', 'Unknown error')}", "ERROR")
            logger.error(f"GitHub error updating {file_path}: {e.data.get('message', 'Unknown error')}")
    except Exception as e:
        log_discord(f"Failed to update {file_path}: {str(e)}", "ERROR")
        logger.error(f"Failed to update {file_path}: {str(e)}")

def create_file(repo, file_path, content, commit_message):
    try:
        repo.create_file(file_path, commit_message, content)
        log_discord(f"Created {file_path} | Commit: '{commit_message}' | V7.9.5", "SUCCESS")
        logger.info(f"Created {file_path} | Commit: '{commit_message}'")
    except GithubException as e:
        if e.status == 422:
            log_discord(f"File {file_path} already exists. Updating instead.", "WARN")
            logger.warning(f"File {file_path} already exists. Updating instead.")
            latest_content, latest_sha = get_file_content(repo, file_path)
            if latest_sha:
                update_file(repo, file_path, content, latest_sha, commit_message)
        else:
            log_discord(f"GitHub error creating {file_path}: {e.data.get('message', 'Unknown error')}", "ERROR")
            logger.error(f"GitHub error creating {file_path}: {e.data.get('message', 'Unknown error')}")
    except Exception as e:
        log_discord(f"Failed to create {file_path}: {str(e)}", "ERROR")
        logger.error(f"Failed to create {file_path}: {str(e)}")

def validate_ai_content(file_path, content):
    if len(content) < 10:
        return False, "Content too short"
    if "" in content:
        return False, "Content contains markdown code blocks"
    return True, "Content valid"

def clean_ai_response(response_text):
    response_text = re.sub(r"[a-zA-Z]*", "", response_text)
    response_text = response_text.replace("", "").strip()
    return response_text

def get_repo_structure(repo):
    structure = { # EDIT TO WHERE ITS GRABBED DYNAMICALLY AND SORTED!!!
        "timestamp": datetime.datetime.now().isoformat(),
        "current_files": [],
        "directories": set(),
        "file_types": {},
        "file_categories": {
            "frontend": [],
            "backend": [],
            "styles": [],
            "config": [],
            "about_us": [],
            "configuration": [],
            "other": []
        }
    }
    try:
        def get_contents(path=""):
            try:
                contents = repo.get_contents(path)
                for content in contents:
                    if content.type == "dir":
                        structure["directories"].add(content.path + "/")
                        get_contents(content.path)
                    else:
                        if content.path.lower() != "readme.md":
                            structure["current_files"].append(content.path)
                            extension = content.path.split(".")[-1].lower() if "." in content.path else "unknown"
                            if extension not in structure["file_types"]:
                                structure["file_types"][extension] = []
                            structure["file_types"][extension].append(content.path)
                            
                            # Categorize files based on new structure
                            if content.path.startswith("public/") and not content.path.startswith("public/style/") and not content.path.startswith("public/About-Us/") and not content.path.startswith("public/Configuration/"):
                                structure["file_categories"]["frontend"].append(content.path)
                            elif content.path.startswith("public/style/"):
                                structure["file_categories"]["styles"].append(content.path)
                            elif content.path.startswith("public/About-Us/"):
                                structure["file_categories"]["about_us"].append(content.path)
                            elif content.path.startswith("public/Configuration/"):
                                structure["file_categories"]["configuration"].append(content.path)
                            elif content.path.startswith("api/"):
                                structure["file_categories"]["backend"].append(content.path)
                            elif content.path.startswith("config/"):
                                structure["file_categories"]["config"].append(content.path)
                            else:
                                structure["file_categories"]["other"].append(content.path)
            except Exception as e:
                logger.error(f"Error accessing {path}: {e}")
        get_contents()
        structure["directories"] = list(structure["directories"])
        return structure
    except Exception as e:
        log_discord(f"Error building repository structure: {str(e)}", "ERROR")
        logger.error(f"Error building repository structure: {str(e)}")
        return structure

def generate_ai_directive(file_path, file_content, repo_structure):
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = f"""
    You are a specialized web development expert. Your task is to create a standalone website for Project Auto.
File Path: {file_path}
Current Content:
{file_content}
Response Format (STRICTLY FOLLOW):
edit filepath: {file_path}
content: [Your website code here]