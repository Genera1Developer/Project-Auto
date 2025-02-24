const settings = {
  general: {
    enabled: true,
    language: 'en',
    currency: 'USD',
    timeZone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
  },
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    passwordHash: 'hash-of-your-password', // Properly handle passwords in a real application.
    role: 'user',
  },
  application: {
    name: 'My Application',
    version: '1.0.0',
    buildDate: '2023-01-01T00:00:00.000Z', // Use ISO 8601 format with milliseconds for timestamps.
    environment: 'development',
  },
};

export default settings;