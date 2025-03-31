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
  secret: process.env.SESSION_SECRET || 'your_secret_key',
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

    res.redirect('https://project-auto.github.io/public/');

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
    // Placeholder for Auto execution logic
    //  - Use octokit to access and modify the repository
    //  - Implement the instructions provided by the user
    console.log(`Running Auto on ${repo} with instructions: ${instructions}`);

    // Example: Get repository information
    const repoData = await octokit.rest.repos.get({
      owner,
      repo: repository,
    });
    console.log('Repo Data:', repoData.data);

    // Implement Auto execution logic here

    res.status(200).send('Project Auto executed successfully!');

  } catch (error) {
    console.error('Error during Project Auto execution:', error);
    res.status(500).send(`Project Auto execution failed: ${error.message}`);
  }
});

module.exports = router;