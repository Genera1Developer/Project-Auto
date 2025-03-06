const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  hostname: process.env.HOSTNAME || 'localhost',
  uvPath: process.env.UV_PATH || '/uv/',
  bareURL: process.env.BARE_URL || 'http://localhost:8080/',
  encodeURL: process.env.ENCODE_URL || '/encode/',
  decodeURL: process.env.DECODE_URL || '/decode/',
  apiKey: process.env.API_KEY || 'your-default-api-key',
  cacheAge: parseInt(process.env.CACHE_AGE, 10) || 86400,
  logLevel: process.env.LOG_LEVEL || 'info',
  domain: process.env.DOMAIN || 'http://localhost:3000',
  forceCodec: process.env.FORCE_CODEC === 'true' || false,
};

module.exports = config;