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
  forceCodec: process.env.FORCE_CODEC === 'true',
  allowServiceWorkers: process.env.ALLOW_SERVICE_WORKERS === 'true',
  blockAll: process.env.BLOCK_ALL === 'true',
  xForwardedFor: process.env.X_FORWARDED_FOR === 'true',
  __dirname: process.env.__dirname || process.cwd(),
  cdnURL: process.env.CDN_URL || '/',
  healthCheckPath: process.env.HEALTH_CHECK_PATH || '/healthcheck',
  bypassBypass: process.env.BYPASS_BYPASS || 'bypass',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 30000,
};

module.exports = config;