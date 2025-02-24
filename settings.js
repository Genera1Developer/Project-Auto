const settings = {
  // General settings
  general: {
    // Enable or disable the app
    enabled: true,

    // The default language of the app
    language: 'en',

    // The default currency of the app
    currency: 'USD',

    // The default time zone of the app
    timeZone: 'UTC',

    // The default date format of the app
    dateFormat: 'YYYY-MM-DD',

    // The default time format of the app
    timeFormat: 'HH:mm:ss',
  },

  // User settings
  user: {
    // The default user name
    name: 'John Doe',

    // The default user email
    email: 'john.doe@example.com',

    // The default user password
    password: 'password',

    // The default user role
    role: 'user',
  },

  // Application settings
  application: {
    // The default application name
    name: 'My Application',

    // The default application version
    version: '1.0.0',

    // The default application build date
    buildDate: '2023-01-01',

    // The default application environment
    environment: 'development',
  },
};

export default settings;