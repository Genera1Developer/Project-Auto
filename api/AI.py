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
github_client = Github(GITHUB_TOKEN)

VALID_FILE_EXTENSIONS = { # EDIT TO WHERE ITS GRABBED DYNAMICALLY AND SORTED!!!
    "js": [],
    "html": [],
    "css": [],
    "json": []
    "md": [],  
    "py": [],
    "txt": [],  
    "env": [],  
    "config": []
}

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
    if "```" in content:
        return False, "Content contains markdown code blocks"
    return True, "Content valid"

def clean_ai_response(response_text):
    response_text = re.sub(r"```[a-zA-Z]*", "", response_text)
    response_text = response_text.replace("```", "").strip()
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
commit: [Brief description of changes]
Rules:
- Create a full-featured website for Project Auto to run itself
- The code being modified IS Project Auto - this website will allow Project Auto to run directly on users' repositories
- Include functionality for users to enter their GitHub repository (username/repo format)
- Add a prompt input field where users can write their customization instructions
- Implement GitHub authentication to get access to the user's repositories (THIS IS REQUIRED)
- Design an attractive, modern UI with professional styling using a purple and gold color scheme
- Ensure the website has a "Start" button that executes Project Auto on the specified repository
- The website must be completely self-contained and operate Project Auto directly, not as a proxy
- Create proper directory structure: backend in api/, frontend in public/, styles in public/style/, configurations in config/
- MUST include an "About Us" page at public/About-Us and a Configuration page at public/Configuration
- MUST include a sidebar with tabs for Home (public/), Configuration, and About-Us
- MUST display the current time at the top left of every page
- MUST use valid GitHub links to files within the repository (no relative links like href="/file")
- When linking to pages or resources, use the full GitHub URL structure for the repo being edited
- Navigation links must point ONLY to files that you create, not external files
- All links must be functional and correctly reference the appropriate filepath in the repository
- Do NOT include any explanations or markdown code blocks
- Provide raw code only after the "content:" marker
- Keep commit messages concise and descriptive (max 50 chars)
- Do NOT include anything before "edit filepath:" or after "commit:"
- IF you need to ADD a file, simply put the file/path you want to add after "edit" and it will be added to the repository
    """
    
    try:
        response = model.generate_content(prompt)
        cleaned = clean_ai_response(response.text.strip())
        pattern = r"edit filepath:\s*(.+?)\s*content:\s*(.+?)\s*commit:\s*(.+)"
        match = re.search(pattern, cleaned, re.DOTALL)
        
        if not match:
            log_discord(f"AI response for {file_path} did not match expected format. Retrying with simplified prompt.", "WARN")
            logger.warning(f"AI response format error for {file_path}. Retrying.")
            
            # Simplified prompt for retry
            simplified_prompt = f"""
            Create a professional website file with these requirements:
            - Directory structure: backend in api/, frontend in public/, styles in public/style/, config in config/
            - Include About Us page (public/About-Us) and Configuration page (public/Configuration)
            - Sidebar with Home, Configuration, and About Us tabs
            - Current time at top left
            - Purple and gold color scheme
            - GitHub authentication functionality
            - Repository input field (username/repo format)
            - Prompt input field for customization instructions
            - "Start" button to execute Project Auto
            - Use full GitHub URLs for all links to repository files

            File Path: {file_path}
            Current Content:
            {file_content}

            Respond ONLY in this exact format:
            edit filepath: {file_path}
            content: [Your improved code here]
            commit: [Brief description of changes]
            """
            
            response = model.generate_content(simplified_prompt)
            cleaned = clean_ai_response(response.text.strip())
            match = re.search(pattern, cleaned, re.DOTALL)
            
            if not match:
                log_discord(f"Simplified prompt also failed for {file_path}", "ERROR")
                logger.error(f"Multiple prompt attempts failed for {file_path}")
                return None, None, None
        
        generated_file_path = match.group(1).strip()
        content = match.group(2).strip()
        commit_message = match.group(3).strip()
        
        is_valid, validation_message = validate_ai_content(generated_file_path, content)
        if not is_valid:
            log_discord(f"Content validation failed for {generated_file_path}: {validation_message}", "ERROR")
            logger.error(f"Content validation failed: {validation_message}")
            return None, None, None
            
        if len(commit_message) > 50:
            commit_message = commit_message[:47] + "..."
            
        logger.info(f"Successfully generated content for {generated_file_path} with commit: {commit_message}")
        
        return generated_file_path, content, commit_message
    except Exception as e:
        log_discord(f"AI API error for {file_path}: {str(e)}", "ERROR")
        logger.error(f"AI API error for {file_path}: {str(e)}")
        return None, None, None
        
        generated_file_path = match.group(1).strip()
        content = match.group(2).strip()
        commit_message = match.group(3).strip()
        
        is_valid, validation_message = validate_ai_content(generated_file_path, content)
        if not is_valid:
            log_discord(f"Content validation failed for {generated_file_path}: {validation_message}", "ERROR")
            logger.error(f"Content validation failed: {validation_message}")
            return None, None, None
            
        if len(commit_message) > 50:
            commit_message = commit_message[:47] + "..."
            
        logger.info(f"Successfully generated content for {generated_file_path} with commit: {commit_message}")
        
        return generated_file_path, content, commit_message
    except Exception as e:
        log_discord(f"AI API error for {file_path}: {str(e)}", "ERROR")
        logger.error(f"AI API error for {file_path}: {str(e)}")
        return None, None, None

def process_ai_directive(repo, processed_files=None, repo_structure=None):
    if processed_files is None:
        processed_files = set()
    if repo_structure is None:
        repo_structure = get_repo_structure(repo)
    unprocessed_files = [
        f for f in repo_structure["current_files"]
        if f not in processed_files and "/" in f  
    ]
    
    if not unprocessed_files:
        log_discord("All files have been processed. Starting new cycle.", "INFO")
        processed_files.clear()
        unprocessed_files = [f for f in repo_structure["current_files"] if "/" in f] 
    
    if not unprocessed_files:
        log_discord("No files to process.", "WARN")
        return processed_files
    
    file_path = random.choice(unprocessed_files)
    original_content, sha = get_file_content(repo, file_path)
    
    if original_content is None:
        log_discord(f"No content found for {file_path}, generating new file", "WARN")
        file_path, content, commit_message = generate_ai_directive(file_path, "", repo_structure)
        if not all([file_path, content, commit_message]):
            log_discord(f"Failed to generate directive for new file {file_path}", "ERROR")
            return processed_files
        create_file(repo, file_path, content, commit_message)
    else:
        file_path, content, commit_message = generate_ai_directive(file_path, original_content, repo_structure)
        if not all([file_path, content, commit_message]):
            log_discord(f"Failed to generate directive for {file_path}", "ERROR")
            return processed_files
        if content.strip() == original_content.strip():
            log_discord(f"No meaningful changes for {file_path}. Skipping update.", "INFO")
            processed_files.add(file_path)
            return processed_files
        update_file(repo, file_path, content, sha, commit_message)
    
    processed_files.add(file_path)
    time.sleep(5)
    return processed_files

def main():
    try:
        log_discord(f"🚀 Starting Project-Auto v7.9.5 - Web Creator - Watching updates live on GitHub: https://github.com/{REPO_NAME}", "INFO")
        repo = get_repo()
        processed_files = set()
        cycle_count = 0
        while True:
            cycle_count += 1
            log_discord(f"Starting optimization cycle #{cycle_count}", "INFO")
            repo_structure = get_repo_structure(repo)
            processed_files = process_ai_directive(repo, processed_files, repo_structure)
            delay = random.randint(15, 30)
            log_discord(f"⏳ Cycle #{cycle_count} complete. Waiting {delay}s for next cycle | V7", "INFO")
            time.sleep(delay)
            if cycle_count % 5 == 0:
                log_discord("Resetting processed files cache to ensure comprehensive coverage", "INFO")
                processed_files.clear()
    except KeyboardInterrupt:
        log_discord("Script execution terminated by user", "INFO")
    except Exception as e:
        log_discord(f"☠️ Fatal error: {str(e)}", "ERROR")

if __name__ == "__main__":
    main()
