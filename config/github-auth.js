const githubAuth = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://project-auto-v1029.vercel.app/api/auth/github/callback'
};

module.exports = githubAuth;