const errorHandler = (err, req, res, next) => {
  console.error(`🔥 Error: ${err.message}`);

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
