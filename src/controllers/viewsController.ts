import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Tour from '../models/tourModel';
import AppError from '../utils/appError';
import User from '../models/userModel';
import { CustomRequest } from '../@types/merged';
import Booking from '../models/bookingModel';

export const alerts = (req: Request, res: Response, next: NextFunction) => {
  const { alert } = req.query;

  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation.\nIf your booking doesn't show up here immediatly, please come back later.";

  next();
};

export const getOverview = catchAsync(async (_req: Request, res: Response) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTour = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const { slug } = _req.params;

    // @ts-ignore
    const tour = await Tour.findOne({ slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
    });

    if (!tour)
      return next(new AppError('There is no tour with that name', 404));

    res.status(200).render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
  }
);

export const getLoginForm = (_req: Request, res: Response) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

export const getAccount = (_req: any, res: Response) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

export const signup = (_req: Request, res: Response) => {
  res.status(200).render('signup', {
    title: 'Create your account!',
  });
};

export const getMyTours = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    // 1) Find all bookings for the current user
    const bookings = await Booking.find({ user: req.user?.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
      title: 'My Tours',
      tours,
    });
  }
);

export const updateUserData = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).render('account', {
      title: 'Your account',
      user,
    });
  }
);
