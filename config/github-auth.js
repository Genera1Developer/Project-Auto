// must be dynamic from ./api/auth/github.js
const githubAuth = {
  clientID: 'YOUR_GITHUB_APP_CLIENT_ID',
  clientSecret: 'YOUR_GITHUB_APP_CLIENT_SECRET',
  callbackURL: 'https://your-app-url/api/auth/github/callback'
};

module.exports = githubAuth;