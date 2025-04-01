// config/config.js
module.exports = {
  githubClientId: process.env.GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || 'YOUR_GITHUB_CLIENT_SECRET',
  redirectUri: process.env.REDIRECT_URI || 'https://project-auto-v1029.vercel.app/api/auth/callback', // Ensure this matches your Vercel deployment URL
  apiBaseUrl: process.env.API_BASE_URL || 'https://project-auto-v1029.vercel.app/api',
};