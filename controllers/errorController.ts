import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const handleCastErrorDB = (err: AppErrorType) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: AppErrorType) => {
  const message = `Duplicate field value: ${err.keyValue?.name}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: AppErrorType) => {
  const errors = Object.values(err.errors as Object).map(
    (el: any) => el.message
  );
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again!', 401);

const sendErrorDev = (err: AppErrorType, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api'))
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  // RENDERED WEBSITE
  else {
    console.error('ERROR 💥', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });
  }
};

const sendErrorProd = (err: AppErrorType, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational)
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    // Programming or other unknown error: don't leak error details
    else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
  // RENDERED WEBSITE
  else {
    // Operational, trusted error: send message to client
    if (err.isOperational)
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        message: err.message,
      });
    // Programming or other unknown error: don't leak error details
    else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        message: 'Please try again later.',
      });
    }
  }
};

export default (
  err: AppErrorType,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500; // 500 = Internal Server Error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log(err.message);
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error: AppErrorType = Object.create(err);

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
