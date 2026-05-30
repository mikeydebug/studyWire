const errorHandler = (err, req, res, next) => {
  // Log error internally
  console.error(`[Error] ${req.method} ${req.url}`);
  console.error(err.stack || err.message);

  // Determine status code
  const statusCode = err.status || 500;

  // Standardize error response
  // NEVER expose stack traces to the user
  const response = {
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : err.message
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
