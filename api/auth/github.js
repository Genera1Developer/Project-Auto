const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const githubAuth = require('../../config/github-auth');

passport.use(new GitHubStrategy({
  clientID: githubAuth.clientID,
  clientSecret: githubAuth.clientSecret,
  callbackURL: githubAuth.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  // In a real application, you would likely associate
  // the GitHub profile with a user record in your database.
  // For this example, we'll just pass the profile along.
  profile.accessToken = accessToken;
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;