const config = {
  githubClientId: process.env.GITHUB_CLIENT_ID || 'Iv1.1234567890abcdef',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || 'YOUR_GITHUB_CLIENT_SECRET',
  githubRedirectUri: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api'
};

module.exports = config;