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

    res.redirect('https://github.com/Project-Auto/public/');

  } catch (error) {
    console.error('Error during GitHub callback:', error);
    res.status(500).send('Authentication failed.');
  }
});

module.exports = router;