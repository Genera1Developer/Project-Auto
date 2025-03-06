function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log the stack trace for better debugging

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message; // Keep the detailed validation message
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 11000) { // Handle MongoDB duplicate key error
        statusCode = 400;
        message = 'Duplicate key error';
  }

  res.status(statusCode).json({
    success: false, // Add a success flag for error responses
    message: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

module.exports = errorHandler;