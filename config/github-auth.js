// config/github-auth.js
// This file should contain the GitHub App's credentials,
// but for security reasons, we'll fetch them from environment variables.

module.exports = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || "https://project-auto-v1029.vercel.app/api/auth/github/callback"
};