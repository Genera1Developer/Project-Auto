const config = {
  port: process.env.PORT || 3000,
  hostname: process.env.HOSTNAME || 'localhost',
  uvPath: process.env.UV_PATH || '/uv/',
  bareURL: process.env.BARE_URL || 'http://localhost:8080/',
};

module.exports = config;