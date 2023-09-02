import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Tour from '../models/tourModel';
import AppError from '../utils/appError';

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

// export const updateUserData = catchAsync(
//   async (req: CustomRequest, res: Response, _next: NextFunction) => {
//     const user = await User.findByIdAndUpdate(
//       req.user?.id,
//       {
//         name: req.body.name,
//         email: req.body.email,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).render('account', {
//       title: 'Your account',
//       user,
//     });
//   }
// );
