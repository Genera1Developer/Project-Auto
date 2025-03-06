const errorHandler = (err, req, res, next) => {
  console.error('Global error handler:', err);

  // Differentiate between client errors (4xx) and server errors (5xx)
  const statusCode = err.statusCode || 500;

  // Customize error message based on status code or error type. Potentially expose more info for debugging
  let message = 'Internal Server Error'; // Default message

  if (statusCode >= 400 && statusCode < 500) {
    message = err.message || 'Bad Request'; // Use the error message if available.
  } else if (err.name === 'ProxyError') {
    message = 'Error reaching target server.';
  }

  res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;