export default class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  stack: string;
  value: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.value = '';
    this.stack = '';

    Error.captureStackTrace(this, this.constructor);
  }
}
