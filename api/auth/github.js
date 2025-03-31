const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const githubAuth = require('../../config/github-auth');

passport.use(new GitHubStrategy({
    clientID: githubAuth.clientID,
    clientSecret: githubAuth.clientSecret,
    callbackURL: githubAuth.callbackURL,
    scope: ['repo'] // Request repository access
},
    function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        return done(null, profile);
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;