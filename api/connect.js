// This script should connect the users github account to the website through actual github, and once that happens it gets a token from the user to access their account, of which MUST have access to all repositories and to edit and delete and add them.  The token will be used in AI.py
const express = require('express');
const router = express.Router();
const { Octokit } = require("@octokit/rest");
const { createAppAuth } = require("@octokit/auth-app");
const { request } = require("@octokit/request");
const { ClientSecret } = require('twilio/lib/twiml/VoiceResponse');
const { env } = require('process');

require('dotenv').config()

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const redirectUri = process.env.GITHUB_REDIRECT_URI;

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

    // Use the access token to fetch user data or store it securely
    // For example, you can fetch the user's GitHub profile:
    const octokit = new Octokit({ auth: accessToken });
    const user = await octokit.rest.users.getAuthenticated();

    // Store the access token securely and associate it with the user
    req.session.githubToken = accessToken; // Example using session
    req.session.githubUser = user.data;

    // Redirect the user to a success page or their profile
    res.redirect('/github/success');

  } catch (error) {
    console.error('Error during GitHub callback:', error);
    res.status(500).send('Authentication failed.');
  }
});

router.get('/github/success', (req, res) => {
  res.send('GitHub authentication successful!'); // Replace with a proper page
});

module.exports = router;