import { Octokit } from "octokit";

export default async function handler(req, res) {
  const { code } = req.query;

  if (code) {
    try {
      const octokit = new Octokit({
        authStrategy: require("@octokit/auth-oauth-app").createOAuthAppAuth,
        auth: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        },
      });

      const { data: auth } = await octokit.auth({
        type: "oauth-user",
      });

      const token = auth.token;

      // Redirect to configuration page with token and username
      const octokitUser = new Octokit({ auth: token });
      const { data: user } = await octokitUser.request('GET /user');
      const username = user.login;

      res.redirect(`/Configuration?token=${token}&username=${username}`);

    } catch (error) {
      console.error("Error exchanging code for token:", error);
      res.status(500).json({ error: "Failed to authenticate with GitHub." });
    }
  } else {
    res.redirect(`/?error=Missing code parameter`);
  }
}