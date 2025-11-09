const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
module.exports = (req, res, err, next) => {
  if ((process.env.NODE_ENV = "development")) {
    sendDevError(err, res);
  }
};
