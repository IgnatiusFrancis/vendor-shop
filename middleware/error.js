const ErrorHandler = require("../utils/ErrorHandler");


const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new ErrorHandler(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const keyValue = err.keyValue.name;
  const message = `Duplicate field value: '${keyValue}'. please use another value!`;

  return new ErrorHandler(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((item) => item.message);
  console.log(errors);
  const message = `Invalid Input data. ${errors.join('. ')}`;
  return new ErrorHandler(message, 400);
};

const handlejwtError = (err) =>
  new ErrorHandler('Invalid token, please log in again', 401);

const handlejwtExpirationError = () =>
  new ErrorHandler('Token expired, please login again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const error = { ...err };

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handlejwtError(error);
    if (error.name === 'TokenExpiredError') error = handlejwtExpirationError();
    sendErrorProd(error, res);
  }
};
