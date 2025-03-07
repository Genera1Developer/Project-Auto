function errorHandler(err, req, res, next) {
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(val => val.message);
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate key error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized: ' + err.message;
  } else if (err.message && err.message.includes('jwt expired')) {
    statusCode = 401;
    message = 'Unauthorized: Token expired';
  } else if (err instanceof SyntaxError && err.message.includes('JSON')) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  } else if (err.status) {
    statusCode = err.status;
    message = err.message;
  } else if (err.code === 'ENOENT') {
        statusCode = 404;
        message = 'Resource not found';
  } else if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Service Unavailable';
  }

  const response = {
    success: false,
    message: message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;