const express = require('express');
const router = express.Router();
const { Octokit } = require("@octokit/rest");
const session = require('express-session');
const fetch = require('node-fetch');
require('dotenv').config();

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const redirectUri = process.env.GITHUB_REDIRECT_URI;

router.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

router.get('/github/login', (req, res) => {
  const authURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
  res.redirect(authURL);
});

router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const octokit = new Octokit({ auth: accessToken });
    const user = await octokit.rest.users.getAuthenticated();

    req.session.githubToken = accessToken;
    req.session.githubUser = user.data;

    res.redirect('https://github.com/Genera1Developer/Project-Auto/blob/main/public/index.html');

  } catch (error) {
    console.error('Error during GitHub callback:', error);
    res.status(500).send('Authentication failed.');
  }
});

router.post('/run-auto', async (req, res) => {
  if (!req.session.githubToken) {
    return res.status(401).send('Unauthorized: GitHub token missing.');
  }

  const { repo, instructions } = req.body;
  const accessToken = req.session.githubToken;

  try {
    const octokit = new Octokit({ auth: accessToken });

    const [owner, repository] = repo.split('/');

    // Get Repo information
    const repoData = await octokit.rest.repos.get({
      owner,
      repo: repository,
    });
    console.log("Repo Data:", repoData);

    // Get the tree
    const files = await octokit.rest.git.getTree({
      owner,
      repo: repository,
      tree_sha: repoData.data.default_branch,
      recursive: 'true',
    });

    console.log(`Running Auto on ${repo} with instructions: ${instructions}`);

    // Example: Create a new file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo: repository,
      path: `project-auto-${Date.now()}.txt`,
      message: 'feat: Project Auto generated file',
      content: `Project Auto ran with instructions: ${instructions}\nFiles in repo: ${JSON.stringify(files.data.tree.map(file => file.path))}`,
    });

    res.status(200).send('Project Auto executed successfully!');

  } catch (error) {
    console.error('Error during Project Auto execution:', error);
    res.status(500).send(`Project Auto execution failed: ${error.message}`);
  }
});

module.exports = router;