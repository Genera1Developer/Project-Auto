// must be dynamic from ./api/auth/github.js
const config = {
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubRedirectUri: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
  apiBaseUrl: '/api',
};

module.exports = config;