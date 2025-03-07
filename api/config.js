const config = {
  port: process.env.PORT || 3000,
  hostname: process.env.HOSTNAME || 'localhost',
  cacheTTL: process.env.CACHE_TTL || 3600, // Cache time-to-live in seconds, default 1 hour
  apiKey: process.env.API_KEY || 'your_default_api_key', //API key for authorization
  maxBodySize: process.env.MAX_BODY_SIZE || '1mb', //Maximum body size accepted
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3001'] //CORS allowed origins
};

module.exports = config;