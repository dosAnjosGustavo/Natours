"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    var _a;
    const message = `Duplicate field value: ${(_a = err.keyValue) === null || _a === void 0 ? void 0 : _a.name}. Please use another value!`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError_1.default(message, 400);
};
const handleJWTError = () => new appError_1.default('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new appError_1.default('Your token has expired! Please log in again!', 401);
const sendErrorDev = (err, req, res) => {
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
const sendErrorProd = (err, req, res) => {
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
exports.default = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500; // 500 = Internal Server Error
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        console.log(err.message);
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.create(err);
        if (err.name === 'CastError')
            error = handleCastErrorDB(error);
        if (err.code === 11000)
            error = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (err.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
//# sourceMappingURL=errorController.js.map