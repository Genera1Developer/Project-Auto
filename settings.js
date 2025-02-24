const settings = {
  general: {
    enabled: true,
    language: "en",
    currency: "USD",
    timeZone: "UTC",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "HH:mm:ss",
  },
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password", // Properly handle passwords in a real application.
    role: "user",
  },
  application: {
    name: "My Application",
    version: "1.0.0",
    buildDate: "2023-01-01",
    environment: "development",
  },
};

export default settings;