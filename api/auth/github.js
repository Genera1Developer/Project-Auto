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

      res.redirect(`/configuration?token=${token}`);

    } catch (error) {
      console.error("Error exchanging code for token:", error);
      res.status(500).json({ error: "Failed to authenticate with GitHub." });
    }
  } else {
    res.status(400).json({ error: "Missing code parameter." });
  }
}