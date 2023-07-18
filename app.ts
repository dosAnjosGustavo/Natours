import express from 'express';
import morgan from 'morgan';

import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import { ROOT, TOURS, USERS } from './routes/variables';

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use(ROOT + TOURS, tourRouter);
app.use(ROOT + USERS, userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
