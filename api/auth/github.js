const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const { Octokit } = require('@octokit/rest');

module.exports = (app) => {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'Beauty&TheBeast', // Use environment variable for secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', sameSite: 'none', domain: process.env.NODE_ENV === 'production' ? 'project-auto-v1029.vercel.app' : undefined } // Secure cookies in production
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID, // Replace with your GitHub Client ID
    clientSecret: process.env.GITHUB_CLIENT_SECRET, // Replace with your GitHub Client Secret
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://project-auto-v1029.vercel.app/api/auth/github/callback' // Replace with your callback URL
  },
  async (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken;
    return done(null, profile);
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.get('/api/auth/github',
    passport.authenticate('github', { scope: [ 'repo' ] }));

  app.get('/api/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/error' }),
    (req, res) => {
      res.redirect('/');
    });

  app.get('/api/auth/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json(null);
    }
  });

    app.post('/api/run-auto', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { repo, instructions } = req.body;
        if (!repo || !instructions) {
            return res.status(400).json({ error: 'Repository and instructions are required.' });
        }
        const [owner, repository] = repo.split('/');
          if (!owner || !repository) {
              return res.status(400).json({ error: 'Invalid repository format. Use owner/repo.' });
          }
        const accessToken = req.user.accessToken;

        const octokit = new Octokit({ auth: accessToken });

        try {
            // Check if the repository exists
            try {
                await octokit.repos.get({
                    owner,
                    repo: repository,
                });
            } catch (repoError) {
                console.error('Repository not found:', repoError);
                return res.status(400).json({ error: 'Repository not found.' });
            }

            const content = `Project Auto ran with instructions: ${instructions}`;
            const filename = `project-auto-${Date.now()}.txt`;
            const path = filename;

            try {
              await octokit.repos.createOrUpdateFileContents({
                  owner,
                  repo: repository,
                  path,
                  message: `Project Auto: ${instructions}`,
                  content: Buffer.from(content).toString('base64'),
                  committer: {
                      name: 'Project Auto',
                      email: 'projectauto@example.com',
                  },
                  author: {
                      name: 'Project Auto',
                      email: 'projectauto@example.com',
                  },
              });

              res.json({ success: true, message: 'Project Auto executed successfully!' });
          } catch (error) {
              console.error('Error running Project Auto:', error);
              res.status(500).json({ error: 'Failed to execute Project Auto: ' + error.message });
          }
        } catch (error) {
            console.error('Error running Project Auto:', error);
            res.status(500).json({ error: 'Failed to execute Project Auto.' });
        }
    });
};